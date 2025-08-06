/**
 * Neon Database Subscription Sync
 *
 * Functions to sync Stripe subscription data to our Neon database.
 */

import { db } from '@/lib/neon';
import { subscriptions } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

interface SubscriptionData {
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId?: string;
  status: string;
  currentPeriodEnd?: Date;
  userId?: string;
}

/**
 * Update or create subscription in Neon DB
 */
export async function updateNeonSubscription(data: SubscriptionData): Promise<void> {
  try {
    // If we don't have a userId, try to find it by Stripe customer ID
    let userId = data.userId;

    if (!userId) {
      // Try to find user by existing subscription with this customer ID
      const existingSubscription = await db
        .select({ userId: subscriptions.userId })
        .from(subscriptions)
        .where(eq(subscriptions.stripeCustomerId, data.stripeCustomerId))
        .limit(1);

      if (existingSubscription.length > 0) {
        userId = existingSubscription[0].userId;
      } else {
        console.warn(`No user found for Stripe customer ${data.stripeCustomerId}`);
        return;
      }
    }

    // Check if subscription already exists
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.stripeSubscriptionId, data.stripeSubscriptionId),
          eq(subscriptions.userId, userId)
        )
      )
      .limit(1);

    const subscriptionData = {
      userId,
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId,
      stripePriceId: data.stripePriceId || null,
      stripeCurrentPeriodEnd: data.currentPeriodEnd || null,
      status: data.status,
      updatedAt: new Date(),
    };

    if (existingSubscription.length > 0) {
      // Update existing subscription
      await db
        .update(subscriptions)
        .set(subscriptionData)
        .where(eq(subscriptions.id, existingSubscription[0].id));

      console.log(`Updated subscription ${data.stripeSubscriptionId} for user ${userId}`);
    } else {
      // Create new subscription
      await db.insert(subscriptions).values({
        ...subscriptionData,
        createdAt: new Date(),
      });

      console.log(`Created subscription ${data.stripeSubscriptionId} for user ${userId}`);
    }
  } catch (error) {
    console.error('Error updating Neon subscription:', error);
    throw error;
  }
}

/**
 * Delete subscription from Neon DB
 */
export async function deleteNeonSubscription(stripeSubscriptionId: string): Promise<void> {
  try {
    await db
      .delete(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));

    console.log(`Deleted subscription ${stripeSubscriptionId} from Neon DB`);
  } catch (error) {
    console.error('Error deleting Neon subscription:', error);
    throw error;
  }
}

/**
 * Link Stripe customer to user in our database
 */
export async function linkStripeCustomerToUser(stripeCustomerId: string, userId: string): Promise<void> {
  try {
    // Create or update a subscription record to link the customer
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeCustomerId, stripeCustomerId))
      .limit(1);

    if (existingSubscription.length === 0) {
      // Create a placeholder subscription record to link customer to user
      await db.insert(subscriptions).values({
        userId,
        stripeCustomerId,
        stripeSubscriptionId: `temp_${stripeCustomerId}`, // Temporary ID
        status: 'incomplete',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`Linked Stripe customer ${stripeCustomerId} to user ${userId}`);
    }
  } catch (error) {
    console.error('Error linking Stripe customer to user:', error);
    throw error;
  }
}

/**
 * Get user ID from Stripe customer ID
 */
export async function getUserIdFromStripeCustomer(stripeCustomerId: string): Promise<string | null> {
  try {
    const result = await db
      .select({ userId: subscriptions.userId })
      .from(subscriptions)
      .where(eq(subscriptions.stripeCustomerId, stripeCustomerId))
      .limit(1);

    return result.length > 0 ? result[0].userId : null;
  } catch (error) {
    console.error('Error getting user ID from Stripe customer:', error);
    return null;
  }
}
