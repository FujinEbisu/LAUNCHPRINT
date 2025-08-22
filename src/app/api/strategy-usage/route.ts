/**
 * Strategy Usage API
 *
 * GET: Returns current usage and limits for a user
 * POST: Records a successful strategy generation (called after API success)
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/neon';
import { marketingStrategies } from '@/lib/schema';
import { eq, and, gte, count, asc } from 'drizzle-orm';
import { getUserSubscriptionStatus, ensureUserHasSubscription } from '@/lib/subscription-manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Ensure user has at least a free subscription
    await ensureUserHasSubscription(userId);

    // Get current month start date
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Count strategies created this month
    const currentUsageResult = await db
      .select({ count: count() })
      .from(marketingStrategies)
      .where(
        and(
          eq(marketingStrategies.userId, userId),
          gte(marketingStrategies.createdAt, monthStart)
        )
      );

    const usedCount = currentUsageResult[0]?.count || 0;

    // Get earliest strategy date for this user (first strategy ever)
    const firstStrategyRow = await db
      .select({ createdAt: marketingStrategies.createdAt })
      .from(marketingStrategies)
      .where(eq(marketingStrategies.userId, userId))
      .orderBy(asc(marketingStrategies.createdAt))
      .limit(1);

    const firstStrategyAt = firstStrategyRow[0]?.createdAt
      ? new Date(firstStrategyRow[0].createdAt)
      : null;

    let isFollowupDue = false;
    if (firstStrategyAt) {
      const followupThreshold = new Date(firstStrategyAt.getTime());
      followupThreshold.setMonth(followupThreshold.getMonth() + 1);
      isFollowupDue = new Date() >= followupThreshold;
    }

    // Get comprehensive subscription status
    const subscriptionStatus = await getUserSubscriptionStatus(userId);

    return NextResponse.json({
      used: usedCount,
      limit: subscriptionStatus.limits.monthlyStrategies,
      tier: subscriptionStatus.tier,
      monthStart: monthStart.toISOString(),
      subscription: subscriptionStatus.currentSubscription,
      isActive: subscriptionStatus.isActive,
      isPaid: subscriptionStatus.isPaid,
      firstStrategyAt: firstStrategyAt ? firstStrategyAt.toISOString() : null,
      isFollowupDue,
    });

  } catch (error) {
    console.error('Error fetching strategy usage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}export async function POST(request: NextRequest) {
  try {
    const { userId, problem, strategy, tier } = await request.json();

    if (!userId || !problem || !strategy) {
      return NextResponse.json({
        error: 'Missing required fields: userId, problem, strategy'
      }, { status: 400 });
    }

    // Only save to database for Starter and Pro tiers (not Free or Test tier)
    if (tier && tier !== 'free' && tier !== 'test') {
      await db
        .insert(marketingStrategies)
        .values({
          userId,
          problem,
          strategy,
          createdAt: new Date()
        });
    }

    // Get updated usage count for ALL tiers (including free, but not test)
    // Free tier needs count tracking for monthly limit enforcement
    let usedCount = 0;
    if (tier && tier !== 'test') {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const currentUsageResult = await db
        .select({ count: count() })
        .from(marketingStrategies)
        .where(
          and(
            eq(marketingStrategies.userId, userId),
            gte(marketingStrategies.createdAt, monthStart)
          )
        );

      usedCount = currentUsageResult[0]?.count || 0;
    }

    return NextResponse.json({
      success: true,
      used: usedCount,
      recorded: tier && tier !== 'free' && tier !== 'test',
      tier: tier || 'unknown'
    });

  } catch (error) {
    console.error('Error recording strategy usage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
