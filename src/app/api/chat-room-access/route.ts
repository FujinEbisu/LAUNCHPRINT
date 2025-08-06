/**
 * Chat Room Access API
 *
 * Check if a user has access to specific chat rooms based on their subscription tier.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/neon';
import { subscriptions } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { hasAccessToChatRoom, getTierFromStripePrice, getChatRoomsForTier } from '@/lib/tier-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const chatRoom = searchParams.get('chatRoom');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    // Get user's subscription
    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));

    if (userSubscriptions.length === 0) {
      return NextResponse.json({
        error: 'No subscription found for user',
        hasAccess: false,
        userTier: 'none',
        availableChatRooms: []
      }, { status: 404 });
    }

    // Get current active subscription
    const activeSubscription = userSubscriptions.find(sub =>
      sub.status === 'active' || sub.status === 'trialing'
    );

    if (!activeSubscription) {
      return NextResponse.json({
        error: 'No active subscription found',
        hasAccess: false,
        userTier: 'none',
        availableChatRooms: []
      }, { status: 404 });
    }

    // Determine user's tier
    const userTier = getTierFromStripePrice(activeSubscription.stripePriceId);
    const availableChatRooms = getChatRoomsForTier(userTier);

    // Check access to specific chat room if provided
    let hasAccess = true;
    if (chatRoom) {
      hasAccess = hasAccessToChatRoom(userTier, chatRoom);
    }

    return NextResponse.json({
      userId,
      userTier,
      requestedChatRoom: chatRoom,
      hasAccess,
      availableChatRooms,
      subscription: {
        tier: userTier,
        status: activeSubscription.status,
        priceId: activeSubscription.stripePriceId,
      }
    });

  } catch (error) {
    console.error('Chat room access check error:', error);
    return NextResponse.json(
      { error: 'Failed to check chat room access', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
