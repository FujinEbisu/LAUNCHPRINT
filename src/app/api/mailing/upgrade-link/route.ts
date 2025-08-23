import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { STRIPE_PRICE_IDS } from '@/lib/subscription-manager'

const ALLOWED: Record<string,string[]> = {
  starter: [STRIPE_PRICE_IDS.STARTER_MONTHLY, STRIPE_PRICE_IDS.STARTER_YEARLY].filter(Boolean) as string[],
  pro: [STRIPE_PRICE_IDS.PRO_MONTHLY, STRIPE_PRICE_IDS.PRO_YEARLY].filter(Boolean) as string[]
}

function origin(req: NextRequest) {
  try { return new URL(req.url).origin } catch { return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tier = searchParams.get('tier') || ''
  const priceId = searchParams.get('priceId') || ''
  const email = searchParams.get('email') || undefined

  if (!tier || !priceId) return NextResponse.json({ error: 'Missing tier/priceId' }, { status: 400 })
  // Pick test key in non-production if available
  const stripeKey = (process.env.NODE_ENV !== 'production' && process.env.STRIPE_TEST_SECRET_KEY)
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  if (!(tier in ALLOWED) || !ALLOWED[tier].includes(priceId)) return NextResponse.json({ error: 'Invalid tier/priceId mapping' }, { status: 400 })

  const stripe = new Stripe(stripeKey)
  // Validate price exists in this Stripe environment to avoid opaque 500
  try {
    await stripe.prices.retrieve(priceId)
  } catch {
    return NextResponse.json({ error: 'Price not found in current Stripe mode', priceId, mode: (process.env.NODE_ENV !== 'production' ? 'test' : 'live') }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin(req)}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin(req)}/pricing?canceled=true`,
      allow_promotion_codes: true,
      metadata: { tier }
    })
    return NextResponse.redirect(session.url!, { status: 302 })
  } catch (err) {
    console.error('Checkout session create error', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
