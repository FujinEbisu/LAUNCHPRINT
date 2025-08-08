/**
 * Stripe Webhooks API Route
 *
 * This file handles Stripe webhook events for payment processing.
 * It processes various Stripe events including:
 * - checkout.session.completed: When a checkout session is completed
 * - payment_intent.succeeded: When a payment is successful
 * - payment_intent.payment_failed: When a payment fails
 * - customer.subscription.* events: For subscription management
 * - invoice.payment_* events: For invoice handling
 *
 * All repository-specific logic has been removed to focus on
 * generic payment and subscription processing.
 */

import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import {
  updateNeonSubscription,
  deleteNeonSubscription,
  linkStripeCustomerToUser,
  getUserIdFromStripeCustomer
} from '@/lib/neon-subscription-sync'
import { db } from '@/lib/neon';
import { subscriptions } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

// Webhook endpoint secret for signature verification
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

/**
 * Main webhook handler
 * Verifies webhook signature and routes events to appropriate handlers
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: unknown) {
    console.error('Webhook signature verification failed.', err)
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }

  try {
    // Route events to appropriate handlers
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionEvent(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handling error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle completed checkout sessions
 * Processes both subscription and one-time payment checkouts
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id)

  if (session.mode === 'subscription') {
    // Link customer to user if we have metadata
    if (session.customer && session.metadata?.userId) {
      await linkStripeCustomerToUser(
        session.customer as string,
        session.metadata.userId
      );
    }

    // Handle subscription creation - this will be updated by subscription.created event
    console.log('Subscription checkout completed, waiting for subscription events...');
  } else if (session.mode === 'payment') {
    await handleOneTimePurchase(session)
  }
}

/**
 * Handle subscription events (create/update)
 * Updates subscription status in the database
 */
async function handleSubscriptionEvent(subscription: Stripe.Subscription) {
  try {
    // Cast subscription to include current_period_end property
    const subscriptionWithPeriod = subscription as Stripe.Subscription & { current_period_end: number };

    // Get the user ID for this Stripe customer
    const userId = await getUserIdFromStripeCustomer(subscription.customer as string);

    if (userId) {
      // Remove existing free tier subscription when upgrading to paid
      await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.userId, userId),
            eq(subscriptions.stripePriceId, 'free_tier')
          )
        );

      console.log(`Removed free tier subscription for user ${userId} - upgrading to paid`);
    }

    await updateNeonSubscription({
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0]?.price?.id,
      status: subscription.status,
      currentPeriodEnd: subscriptionWithPeriod.current_period_end
        ? new Date(subscriptionWithPeriod.current_period_end * 1000)
        : undefined,
      userId: userId || undefined,
    });

    console.log('Subscription event processed:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription event:', error);
  }
}

/**
 * Handle subscription deletion
 * Marks subscription as canceled in the database
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    await deleteNeonSubscription(subscription.id);
    console.log('Subscription deleted:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

/**
 * Handle successful invoice payment
 * Placeholder for additional success logic
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded for invoice:', invoice.id)
  // Additional logic for successful payments can be added here
}

/**
 * Handle failed invoice payment
 * Placeholder for additional failure logic
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed for invoice:', invoice.id)
  // Additional logic for failed payments can be added here
}

/**
 * Handle new customer creation
 * Placeholder for customer onboarding logic
 */
async function handleCustomerCreated(customer: Stripe.Customer) {
  console.log('New customer created:', customer.id)
  // Additional logic for new customers can be added here
}

/**
 * Handle one-time purchases
 * Creates payment records for non-subscription payments
 */
async function handleOneTimePurchase(session: Stripe.Checkout.Session) {
  try {
    const customerId = session.customer as string;

    // Try to find user ID from our subscription records
    const userId = await getUserIdFromStripeCustomer(customerId);

    if (!userId) {
      console.error('User not found for Stripe customer:', customerId);
      return;
    }

    console.log(`One-time purchase completed for user ${userId}, session: ${session.id}`);
    // Add any additional one-time purchase logic here

  } catch (error) {
    console.error('Error handling one-time purchase:', error);
  }
}

/**
 * Handle successful payment intent
 * Generic payment success handler (repository logic removed)
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Processing successful payment intent:', paymentIntent.id)

    const customerEmail = paymentIntent.receipt_email ||
                         paymentIntent.metadata.customer_email || ''

    if (!customerEmail) {
      console.error('Missing customer email in payment metadata')
      return
    }

    // Log the successful payment for record keeping
    console.log(`Payment succeeded: ${paymentIntent.id} for ${customerEmail}`)

    // Additional payment processing logic can be added here
    // For example: updating user credits, unlocking features, etc.

  } catch (error) {
    console.error('Error processing payment intent:', error)
  }
}

/**
 * Handle failed payment intent
 * Generic payment failure handler
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Processing failed payment intent:', paymentIntent.id)
    // Additional logic for failed payments can be added here
  } catch (error) {
    console.error('Error processing payment intent failure:', error)
  }
}
