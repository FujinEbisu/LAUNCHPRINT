/**
 * Stack Auth Webhooks API Route
 *
 * This file handles Stack Auth webhook events to sync users between
 * Stack Auth and our custom Neon database schema.
 *
 * Events handled:
 * - user.created: When a new user signs up
 * - user.updated: When user data is updated
 * - user.deleted: When a user is deleted
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/neon';
import { users, subscriptions } from '@/lib/schema';
import { createDripSchedule, sendTemplate } from '@/lib/mailer';
import { eq } from 'drizzle-orm';

interface StackAuthUser {
  id: string;
  displayName?: string;
  primaryEmail: string;
  primaryEmailVerified?: boolean;
  profileImageUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify webhook signature (you should add this for security)
    // const signature = request.headers.get('stack-signature');
    // if (!verifyWebhookSignature(body, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const { type, data } = body;

    switch (type) {
      case 'user.created':
        await handleUserCreated(data);
        break;

      case 'user.updated':
        await handleUserUpdated(data);
        break;

      case 'user.deleted':
        await handleUserDeleted(data);
        break;

      default:
        console.log(`Unhandled Stack Auth webhook type: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stack Auth webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleUserCreated(userData: StackAuthUser) {
  try {
    console.log('Creating user in Neon DB:', userData);

    await db.insert(users).values({
      id: userData.id,
      name: userData.displayName || userData.primaryEmail || 'Unknown',
      email: userData.primaryEmail,
      emailVerified: userData.primaryEmailVerified || false,
      image: userData.profileImageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('User created successfully in Neon DB');

    // Create Free tier subscription for new user
    await createFreeTierSubscription(userData.id);

    // Send welcome email + create drip schedule
    try {
      await sendTemplate(userData.primaryEmail, 'welcome', { plan: 'free', priceMap: { starterMonthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID, proMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID } }, userData.id, { key: `welcome_${userData.primaryEmail}` })
      await createDripSchedule(userData.id, new Date())
    } catch (e) {
      console.error('Error sending welcome / scheduling drip:', e)
    }

  } catch (error) {
    console.error('Error creating user in Neon DB:', error);
    throw error;
  }
}

async function handleUserUpdated(userData: StackAuthUser) {
  try {
    console.log('Updating user in Neon DB:', userData);

    await db
      .update(users)
      .set({
        name: userData.displayName || userData.primaryEmail || 'Unknown',
        email: userData.primaryEmail,
        emailVerified: userData.primaryEmailVerified || false,
        image: userData.profileImageUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userData.id));

    console.log('User updated successfully in Neon DB');
  } catch (error) {
    console.error('Error updating user in Neon DB:', error);
    throw error;
  }
}

async function handleUserDeleted(userData: StackAuthUser) {
  try {
    console.log('Deleting user from Neon DB:', userData);

    await db.delete(users).where(eq(users.id, userData.id));

    console.log('User deleted successfully from Neon DB');
  } catch (error) {
    console.error('Error deleting user from Neon DB:', error);
    throw error;
  }
}

/**
 * Create a Free tier subscription for new users
 */
async function createFreeTierSubscription(userId: string): Promise<void> {
  try {
    const freeTierSubscription = {
      userId,
      stripeCustomerId: null, // No Stripe customer for free tier
      stripeSubscriptionId: `free_${userId}`, // Unique identifier for free subscription
      stripePriceId: 'free_tier',
      stripeCurrentPeriodEnd: null, // Free tier doesn't expire
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(subscriptions).values(freeTierSubscription);
    console.log(`Created Free tier subscription for user ${userId}`);
  } catch (error) {
    console.error(`Error creating Free tier subscription for user ${userId}:`, error);
    throw error;
  }
}
