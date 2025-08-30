import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/neon'
import { users, subscriptions } from '@/lib/schema'
import { sendTemplate, classifyPlan } from '@/lib/mailer'
import { STRIPE_PRICE_IDS } from '@/lib/subscription-manager'

const MAX_RECIPIENTS = 500

function auth(req: NextRequest) { return req.headers.get('x-admin-key') === process.env.ADMIN_INTERNAL_KEY }

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({})) as { audience?: string; subject?: string; template?: string; html?: string }
  const audience = body.audience || 'all'
  const templateName = ((body.template as string) || 'genericTest') as 'welcome' | 'subscriptionActive' | 'paymentFailed' | 'subscriptionCanceled' | 'planChanged' | 'genericTest' | 'internalSaleNotice' | 'internalPaymentFailed' | 'internalCancellation'

  // fetch users
  const userRows = await db.select().from(users)
  const subs = await db.select().from(subscriptions)
  const subByUser = new Map(subs.map(s => [s.userId, s]))
  const filtered = userRows.filter(u => {
    if (audience === 'all') return true
    const sub = subByUser.get(u.id)
    const plan = classifyPlan(sub?.stripePriceId)
    return plan === audience
  })
  if (filtered.length > MAX_RECIPIENTS) return NextResponse.json({ error: 'Too many recipients', count: filtered.length }, { status: 400 })

  const priceMap = { starterMonthly: STRIPE_PRICE_IDS.STARTER_MONTHLY, proMonthly: STRIPE_PRICE_IDS.PRO_MONTHLY }

  const results: Array<{ sent?: boolean; skipped?: boolean; key: string; reason?: string }> = []
  for (const u of filtered) {
    const sub = subByUser.get(u.id)
    const plan = classifyPlan(sub?.stripePriceId)
    const r = await sendTemplate(
      u.email,
      templateName,
      { name: u.name, plan, priceMap },
      u.id,
      { key: `${templateName}_${u.email}` }
    )
    results.push(r)
  }

  return NextResponse.json({ sent: results.length, results })
}
