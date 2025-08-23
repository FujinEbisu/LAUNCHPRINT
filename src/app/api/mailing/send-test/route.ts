import { NextRequest, NextResponse } from 'next/server'
import { sendTemplate } from '@/lib/mailer'
import { templates } from '@/lib/mailer-templates'
import { STRIPE_PRICE_IDS } from '@/lib/subscription-manager'

function auth(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_INTERNAL_KEY
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const to = body.to || process.env.LETTERMINT_FROM_EMAIL
  const templateReq = body.template as string | undefined
  const templateName = (templateReq && templateReq in templates ? templateReq : 'genericTest') as keyof typeof templates
  const plan = body.plan || 'free'
  const name = body.name || undefined
  const customKey = body.key as string | undefined
  // Provide priceMap automatically for templates that reference it
  const priceMap = { starterMonthly: STRIPE_PRICE_IDS.STARTER_MONTHLY, proMonthly: STRIPE_PRICE_IDS.PRO_MONTHLY }
  const ctx: Record<string, unknown> = { plan, name, priceMap }
  if (body.reason) ctx.reason = body.reason
  try {
    const result = await sendTemplate(to, templateName, ctx, undefined, { key: customKey || `test_${templateName}_${Date.now()}` })
    return NextResponse.json({ result })
  } catch (e: unknown) {
    console.error('send-test error', e)
    interface ErrShape { message?: string; name?: string; status?: number; code?: string; details?: unknown; responseBody?: unknown }
    const errObj = (typeof e === 'object' && e ? e : {}) as ErrShape
    return NextResponse.json({ error: errObj.message || 'send failed', raw: {
      name: errObj.name,
      status: errObj.status,
      code: errObj.code,
      details: errObj.details || errObj.responseBody || errObj
    } }, { status: 500 })
  }
}
