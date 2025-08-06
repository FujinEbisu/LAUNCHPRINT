/**
 * User Sync API Route
 *
 * Manually sync a user from Stack Auth to Neon DB.
 * Useful for testing and one-off syncing.
 */

import { NextRequest, NextResponse } from 'next/server';
import { syncUserToNeonDB } from '@/lib/user-sync';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    await syncUserToNeonDB(userId);

    return NextResponse.json({
      success: true,
      message: `User ${userId} synced successfully`
    });
  } catch (error) {
    console.error('User sync API error:', error);
    return NextResponse.json(
      { error: 'Failed to sync user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
