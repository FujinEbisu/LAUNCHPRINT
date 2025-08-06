/**
 * User Strategies API
 *
 * GET: Returns all saved strategies for a specific user (Starter/Pro tiers only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/neon';
import { marketingStrategies } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch all strategies for the user, ordered by creation date (newest first)
    const userStrategies = await db
      .select({
        id: marketingStrategies.id,
        problem: marketingStrategies.problem,
        strategy: marketingStrategies.strategy,
        createdAt: marketingStrategies.createdAt
      })
      .from(marketingStrategies)
      .where(eq(marketingStrategies.userId, userId))
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
