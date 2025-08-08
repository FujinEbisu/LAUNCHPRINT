import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function getOrigin(req: Request) {
  try {
    const url = new URL(req.url);
    return url.origin;
  } catch {
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }
}

export async function POST(req: Request) {
  try {
  const { tier, email, priceId } = await req.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe secret key is not configured.' }, { status: 500 });
    }

    if (!priceId || !tier) {
      return NextResponse.json({ error: 'Missing required parameters: priceId, tier.' }, { status: 400 });
    }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const origin = getOrigin(req);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email || undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      allow_promotion_codes: true,
      client_reference_id: email || undefined,
      metadata: {
        tier,
        ...(email ? { email } : {}),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url }, { status: 200 });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    const message = error instanceof Error ? error.message : 'Unable to create checkout session';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
