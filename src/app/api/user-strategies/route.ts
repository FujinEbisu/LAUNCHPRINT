/**
 * User Strategies API
 *
 * GET: Returns all saved strategies for a specific user (Starter/Pro tiers only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/neon';
import { marketingStrategies } from '@/lib/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const strategyId = searchParams.get('strategyId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Build query conditions
    const conditions = [eq(marketingStrategies.userId, userId)];

    // Add strategy ID filter if provided
    if (strategyId) {
      conditions.push(eq(marketingStrategies.id, parseInt(strategyId)));
    }

    // Fetch strategies for the user, with optional strategy ID filter
    const userStrategies = await db
      .select({
        id: marketingStrategies.id,
        problem: marketingStrategies.problem,
        strategy: marketingStrategies.strategy,
        createdAt: marketingStrategies.createdAt,
        userId: marketingStrategies.userId
      })
      .from(marketingStrategies)
      .where(and(...conditions))
      .orderBy(desc(marketingStrategies.createdAt));

    return NextResponse.json({
      success: true,
      strategies: userStrategies,
      count: userStrategies.length
    });

  } catch (error) {
    console.error('Error fetching user strategies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
