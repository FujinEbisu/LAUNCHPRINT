/**
 * Subscription Manager
 *
 * Centralized subscription logic for determining user tiers, limits, and access.
 * This is the single source of truth for all subscription-related decisions.
 */

import { db } from '@/lib/neon';
import { subscriptions } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getTierConfig, type TierConfig } from '@/lib/tier-config';

// Type for subscription records from the database
export type SubscriptionRecord = typeof subscriptions.$inferSelect;

// Define subscription tiers with hardcoded pricing (but still use Stripe for payments)
export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free_tier',
    name: 'Free',
    price: 0,
    interval: null,
    limits: { monthlyStrategies: 1 }
  },
  STARTER: {
    id: 'starter_monthly',
    name: 'Starter',
    price: 29, // $29/month - hardcoded pricing
    interval: 'month',
    stripePriceId: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || 'price_starter_monthly',
    limits: { monthlyStrategies: 25 }
  },
  PRO: {
    id: 'pro_monthly',
    name: 'Pro',
    price: 99, // $99/month - hardcoded pricing
    interval: 'month',
    stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
    limits: { monthlyStrategies: 75 }
  }
} as const;

// Stripe price IDs for production (get from your Stripe Dashboard)
export const STRIPE_PRICE_IDS = {
  FREE: 'free_tier',

  // Production Stripe Price IDs - replace with actual IDs from Stripe Dashboard
  STARTER_MONTHLY: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || 'price_starter_monthly',
  STARTER_YEARLY: process.env.STRIPE_STARTER_YEARLY_PRICE_ID || 'price_starter_yearly',
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
  PRO_YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',

  // Test price IDs for development
  STARTER_TEST: 'price_starter_test',
  PRO_TEST: 'price_pro_test',
} as const;export type SubscriptionTier = 'free' | 'starter' | 'pro';

export interface UserSubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  isPaid: boolean;
  currentSubscription: SubscriptionRecord | null;
  allSubscriptions: SubscriptionRecord[];
  tierConfig: TierConfig;
  limits: {
    monthlyStrategies: number;
    canSaveData: boolean;
    hasTeamCollaboration: boolean;
    supportLevel: string;
    availableChatRooms: string[];
  };
}

/**
 * Get the tier from a Stripe price ID using comprehensive mapping
 */
export function getTierFromStripePrice(stripePriceId: string | null | undefined): SubscriptionTier {
  if (!stripePriceId || stripePriceId === STRIPE_PRICE_IDS.FREE) {
    return 'free';
  }

  // Starter tier price IDs
  if ([
    STRIPE_PRICE_IDS.STARTER_MONTHLY,
    STRIPE_PRICE_IDS.STARTER_YEARLY,
    STRIPE_PRICE_IDS.STARTER_TEST
  ].includes(stripePriceId)) {
    return 'starter';
  }

  // Pro tier price IDs
  if ([
    STRIPE_PRICE_IDS.PRO_MONTHLY,
    STRIPE_PRICE_IDS.PRO_YEARLY,
    STRIPE_PRICE_IDS.PRO_TEST
  ].includes(stripePriceId)) {
    return 'pro';
  }

  // Legacy/pattern-based detection as fallback
  const lowerPriceId = stripePriceId.toLowerCase();

  if (lowerPriceId.includes('starter') || lowerPriceId.includes('basic')) {
    return 'starter';
  }

  if (lowerPriceId.includes('pro') || lowerPriceId.includes('premium')) {
    return 'pro';
  }

  // Default to free for unknown price IDs
  console.warn(`Unknown price ID: ${stripePriceId}, defaulting to free tier`);
  return 'free';
}

/**
 * Get comprehensive subscription status for a user
 */
export async function getUserSubscriptionStatus(userId: string): Promise<UserSubscriptionStatus> {
  try {
    // Get all subscriptions for the user
    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));

    // Find active subscriptions
    const activeSubscriptions = userSubscriptions.filter(sub =>
      sub.status === 'active' || sub.status === 'trialing'
    );

    // Separate paid and free subscriptions
    const paidSubscriptions = activeSubscriptions.filter(sub =>
      sub.stripePriceId && sub.stripePriceId !== STRIPE_PRICE_IDS.FREE
    );

    const freeSubscriptions = activeSubscriptions.filter(sub =>
      !sub.stripePriceId || sub.stripePriceId === STRIPE_PRICE_IDS.FREE
    );

    // Determine current subscription priority: Paid > Active > Any
    let currentSubscription = null;
    let tier: SubscriptionTier = 'free';

    if (paidSubscriptions.length > 0) {
      // Use the highest tier paid subscription
      currentSubscription = paidSubscriptions.reduce((highest, current) => {
        const currentTier = getTierFromStripePrice(current.stripePriceId);
        const highestTier = getTierFromStripePrice(highest.stripePriceId);

        // Pro > Starter > Free
        const tierRank = { pro: 3, starter: 2, free: 1 };
        return tierRank[currentTier] > tierRank[highestTier] ? current : highest;
      });

      tier = getTierFromStripePrice(currentSubscription.stripePriceId);
    } else if (activeSubscriptions.length > 0) {
      // Fall back to any active subscription
      currentSubscription = activeSubscriptions[0];
      tier = getTierFromStripePrice(currentSubscription.stripePriceId);
    } else if (freeSubscriptions.length > 0) {
      // Use free subscription if available
      currentSubscription = freeSubscriptions[0];
      tier = 'free';
    }

    // Get tier configuration
    const tierConfig = getTierConfig(tier);
    if (!tierConfig) {
      throw new Error(`Invalid tier configuration for tier: ${tier}`);
    }

    return {
      tier,
      isActive: activeSubscriptions.length > 0,
      isPaid: paidSubscriptions.length > 0,
      currentSubscription,
      allSubscriptions: userSubscriptions,
      tierConfig,
      limits: {
        monthlyStrategies: tierConfig.monthlyStrategies,
        canSaveData: tierConfig.canSaveData,
        hasTeamCollaboration: tierConfig.hasTeamCollaboration,
        supportLevel: tierConfig.supportLevel,
        availableChatRooms: tierConfig.chatRooms,
      }
    };

  } catch (error) {
    console.error(`Error getting subscription status for user ${userId}:`, error);

    // Return safe defaults on error
    const defaultConfig = getTierConfig('free')!;
    return {
      tier: 'free',
      isActive: false,
      isPaid: false,
      currentSubscription: null,
      allSubscriptions: [],
      tierConfig: defaultConfig,
      limits: {
        monthlyStrategies: defaultConfig.monthlyStrategies,
        canSaveData: defaultConfig.canSaveData,
        hasTeamCollaboration: defaultConfig.hasTeamCollaboration,
        supportLevel: defaultConfig.supportLevel,
        availableChatRooms: defaultConfig.chatRooms,
      }
    };
  }
}

/**
 * Create or update a user's subscription
 */
export async function createOrUpdateSubscription(
  userId: string,
  stripePriceId: string,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string,
  status: string = 'active',
  currentPeriodEnd?: Date
) {
  try {
    const subscriptionData = {
      userId,
      stripePriceId,
      stripeCustomerId: stripeCustomerId || null,
      stripeSubscriptionId: stripeSubscriptionId || `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      stripeCurrentPeriodEnd: currentPeriodEnd || null,
      status,
      updatedAt: new Date(),
    };

    // Check if subscription already exists for this user and price
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (existingSubscription.length > 0) {
      // Update existing subscription
      await db
        .update(subscriptions)
        .set(subscriptionData)
        .where(eq(subscriptions.userId, userId));

      console.log(`Updated subscription for user ${userId} to ${stripePriceId}`);
    } else {
      // Create new subscription
      await db.insert(subscriptions).values({
        ...subscriptionData,
        createdAt: new Date(),
      });

      console.log(`Created subscription for user ${userId} with ${stripePriceId}`);
    }

    return true;
  } catch (error) {
    console.error(`Error creating/updating subscription for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Ensure a user has at least a free tier subscription
 */
export async function ensureUserHasSubscription(userId: string): Promise<void> {
  try {
    const status = await getUserSubscriptionStatus(userId);

    if (status.allSubscriptions.length === 0) {
      // Create free tier subscription
      await createOrUpdateSubscription(userId, STRIPE_PRICE_IDS.FREE);
      console.log(`Created free tier subscription for user ${userId}`);
    }
  } catch (error) {
    console.error(`Error ensuring subscription for user ${userId}:`, error);
    throw error;
  }
}
