import { safeSendEmail } from '@/lib/lettermint'
import { templates, dripTemplate, Plan, TemplateResult } from '@/lib/mailer-templates'
import { db } from '@/lib/neon'
import { emailEvents, dripSchedule, users, subscriptions } from '@/lib/schema'
import { eq, and, inArray, isNull } from 'drizzle-orm'
import { getTierFromStripePrice, STRIPE_PRICE_IDS } from '@/lib/subscription-manager'

const INTERNAL_EMAIL = process.env.LETTERMINT_FROM_EMAIL || 'contact@launch-print.com'

export interface EmailMeta { [k: string]: unknown }
export type TemplateContext = Record<string, unknown>

export async function recordEmailEvent(key: string, email: string, template: string, userId?: string, meta?: EmailMeta) {
  try {
    await db.insert(emailEvents).values({ key, email, template, userId: userId || null, meta })
  } catch {
    // unique violation means already sent
    console.warn('emailEvents insert issue (likely duplicate):', key)
  }
}

export async function alreadySent(key: string): Promise<boolean> {
  const rows = await db.select().from(emailEvents).where(eq(emailEvents.key, key)).limit(1)
  return rows.length > 0
}

export async function sendTemplate(to: string, templateName: keyof typeof templates, ctx: TemplateContext, userId?: string, meta?: EmailMeta) {
  const builder = templates[templateName] as (c: unknown) => TemplateResult
  const t = builder(ctx)
  const key = (meta?.key as string) || `${templateName}_${to}_${meta?.ref || Date.now()}`
  if (await alreadySent(key)) return { skipped: true, reason: 'duplicate', key }
  await safeSendEmail({ to, subject: t.subject, html: t.html, text: t.text })
  await recordEmailEvent(key, to, templateName, userId, meta)
  return { sent: true, key }
}

export async function sendInternal(templateName: keyof typeof templates, ctx: TemplateContext, meta?: EmailMeta) {
  return sendTemplate(INTERNAL_EMAIL, templateName, ctx, undefined, meta)
}

export function classifyPlan(stripePriceId: string | null | undefined): Plan {
  return getTierFromStripePrice(stripePriceId) as Plan
}

export async function createDripSchedule(userId: string, createdAt: Date) {
  const dayOffsets = [0,1,2,3,4,5,6,7,9,11,13]
  const inserts = dayOffsets.map(d => ({
    userId,
    dayIndex: d,
    template: `drip_day_${d}`,
    scheduledFor: new Date(createdAt.getTime() + d*24*3600*1000),
    createdAt: new Date()
  }))
  await db.insert(dripSchedule).values(inserts)
}

export async function runDueDrip(limit = 200) {
  const now = new Date()
  const due = await db.select().from(dripSchedule)
    .where(and(isNull(dripSchedule.sentAt),
               inArray(dripSchedule.dayIndex, [0,1,2,3,4,5,6,7,9,11,13])
    ))
  const slice = due.filter(r => r.scheduledFor <= now).slice(0, limit)
  for (const row of slice) {
    const userRows = await db.select().from(users).where(eq(users.id, row.userId)).limit(1)
    if (!userRows.length) continue
    const user = userRows[0]
    // plan
    const subs = await db.select().from(subscriptions).where(eq(subscriptions.userId, row.userId))
    const active = subs.find(s => s.status === 'active' || s.status === 'trialing')
    const plan = classifyPlan(active?.stripePriceId)
    const priceMap = {
      starterMonthly: STRIPE_PRICE_IDS.STARTER_MONTHLY,
      proMonthly: STRIPE_PRICE_IDS.PRO_MONTHLY
    }
    const dayIdx = row.dayIndex
    const t: TemplateResult = dripTemplate(dayIdx, { plan, priceMap })
    const key = `drip_${dayIdx}_${user.email}`
    if (await alreadySent(key)) continue
    await safeSendEmail({ to: user.email, subject: t.subject, html: t.html, text: t.text })
    await recordEmailEvent(key, user.email, `drip_day_${dayIdx}`, row.userId, { dayIndex: dayIdx })
    await db.update(dripSchedule).set({ sentAt: new Date() }).where(eq(dripSchedule.id, row.id))
  }
  return { processed: slice.length }
}
