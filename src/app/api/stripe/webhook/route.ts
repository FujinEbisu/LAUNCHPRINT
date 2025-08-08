import { NextResponse } from 'next/server';
import Stripe from 'stripe';

async function bufferReadableStream(readable: ReadableStream<Uint8Array>) {
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  if (!sig || !endpointSecret) {
    return NextResponse.json({ error: 'Missing webhook signature/secret' }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const buf = await bufferReadableStream(req.body as unknown as ReadableStream<Uint8Array>);
    const event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
  // const session = event.data.object as Stripe.Checkout.Session;
  // const customerEmail = session.customer_details?.email;
  // const clientRef = session.client_reference_id; // may be userId if provided
  // TODO: integrate with your auth/store (Stack) to upsert or link user and attach subscription
        // Example pseudo:
        // const user = clientRef ? await Users.getById(clientRef) : (customerEmail ? await Users.getByEmail(customerEmail) : null);
        // if (!user) {
        //   const newUser = await Users.create({ email: customerEmail, source: 'stripe' });
        //   await Subscriptions.attach(newUser.id, session.subscription as string, session);
        // } else {
        //   await Subscriptions.attach(user.id, session.subscription as string, session);
        // }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // Optionally keep subscription status in sync
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}
