/**
 * Subscription Tier Configuration
 *
 * This file defines the different subscription tiers and their corresponding
 * chat rooms, features, and access levels.
 */

export interface TierConfig {
  name: string;
  chatRooms: string[];
  features: string[];
  monthlyStrategies: number;
  canSaveData: boolean;
  hasTeamCollaboration: boolean;
  supportLevel: 'community' | 'email' | 'priority';
}

export const tierConfigs: Record<string, TierConfig> = {
  free: {
    name: 'Free',
    chatRooms: ['general-help'], // Only basic help chat room
    features: [
      'Create account for free',
      'Generate 1 marketing strategy',
      'Basic strategy templates',
      'Community support'
    ],
    monthlyStrategies: 1,
    canSaveData: false,
    hasTeamCollaboration: false,
    supportLevel: 'community',
  },
  starter: {
    name: 'Starter',
    chatRooms: [
      'general-help',
      'marketing-strategies',
      'email-templates',
      'beginner-tips'
    ],
    features: [
      '25 marketing strategies per month',
      'Save and edit your strategies',
      'Generate email marketing templates',
      'Access to your saved data',
      'Email support'
    ],
    monthlyStrategies: 25,
    canSaveData: true,
    hasTeamCollaboration: false,
    supportLevel: 'email',
  },
  pro: {
    name: 'Pro',
    chatRooms: [
      'general-help',
      'marketing-strategies',
      'email-templates',
      'beginner-tips',
      'advanced-strategies',
      'ab-testing',
      'team-collaboration',
      'priority-support'
    ],
    features: [
      '75 marketing strategies per month',
      'Unlimited data storage',
      'Advanced strategy customization',
      'Generate email marketing templates',
      'A/B testing suggestions',
      'Priority email support',
      'Team collaboration (up to 3 users)'
    ],
    monthlyStrategies: 75,
    canSaveData: true,
    hasTeamCollaboration: true,
    supportLevel: 'priority',
  }
};

/**
 * Get tier configuration by plan name
 */
export function getTierConfig(planName: string): TierConfig | null {
  return tierConfigs[planName.toLowerCase()] || null;
}

/**
 * Get chat rooms available for a specific tier
 */
export function getChatRoomsForTier(planName: string): string[] {
  const config = getTierConfig(planName);
  return config?.chatRooms || [];
}

/**
 * Check if user has access to a specific chat room
 */
export function hasAccessToChatRoom(userPlan: string, chatRoom: string): boolean {
  const chatRooms = getChatRoomsForTier(userPlan);
  return chatRooms.includes(chatRoom);
}

/**
 * Get the tier name from Stripe price ID
 */
export function getTierFromStripePrice(stripePriceId: string | null): string {
  if (!stripePriceId || stripePriceId === 'free_tier') {
    return 'free';
  }

  // Map common Stripe price patterns to tiers
  if (stripePriceId.includes('starter') || stripePriceId.includes('basic')) {
    return 'starter';
  }

  if (stripePriceId.includes('pro') || stripePriceId.includes('premium')) {
    return 'pro';
  }

  // Default to free if we can't determine the tier
  return 'free';
}
