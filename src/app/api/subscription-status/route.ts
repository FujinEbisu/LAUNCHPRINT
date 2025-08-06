/**
 * Subscription Status API Route
 *
 * Check user subscription status from our Neon database.
 * Returns user data and subscription information.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/neon';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { syncUserToNeonDB } from '@/lib/user-sync';
import { getUserSubscriptionStatus, ensureUserHasSubscription } from '@/lib/subscription-manager';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    // First, try to get user from our Neon DB
    let user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // If user doesn't exist in our DB, try to sync from Stack Auth
    if (user.length === 0) {
      try {
        console.log(`User ${userId} not found in Neon DB, attempting to sync from Stack Auth...`);
        await syncUserToNeonDB(userId);

        // Try to get user again after sync
        user = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);
      } catch (syncError) {
        console.error('Failed to sync user from Stack Auth:', syncError);
        return NextResponse.json({
          error: 'User not found in database and sync failed',
          details: syncError instanceof Error ? syncError.message : 'Unknown sync error'
        }, { status: 404 });
      }
    }

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure user has at least a free subscription
    await ensureUserHasSubscription(userId);

    // Get comprehensive subscription status using centralized manager
    const subscriptionStatus = await getUserSubscriptionStatus(userId);

    // Format response to match expected interface
    const responseData = {
      hasActiveSubscription: subscriptionStatus.isActive,
      hasPaidSubscription: subscriptionStatus.isPaid,
      hasFreeTier: subscriptionStatus.tier === 'free',
      currentTier: subscriptionStatus.tier,
      subscription: subscriptionStatus.currentSubscription,
      allSubscriptions: subscriptionStatus.allSubscriptions,
      plan: subscriptionStatus.isPaid ? 'paid' : 'free',

      // Tier-specific information
      tierInfo: {
        name: subscriptionStatus.tierConfig.name,
        chatRooms: subscriptionStatus.tierConfig.chatRooms,
        features: subscriptionStatus.tierConfig.features,
        monthlyStrategies: subscriptionStatus.tierConfig.monthlyStrategies,
        canSaveData: subscriptionStatus.tierConfig.canSaveData,
        hasTeamCollaboration: subscriptionStatus.tierConfig.hasTeamCollaboration,
        supportLevel: subscriptionStatus.tierConfig.supportLevel,
      },

      // Quick access to chat rooms
      availableChatRooms: subscriptionStatus.limits.availableChatRooms,
    };

    return NextResponse.json({
      user: user[0],
      subscriptionStatus: responseData,
      totalSubscriptions: subscriptionStatus.allSubscriptions.length,
    });

  } catch (error) {
    console.error('Subscription status API error:', error);
    return NextResponse.json({
      error: 'Failed to get subscription status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
