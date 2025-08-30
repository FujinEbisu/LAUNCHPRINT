/**
 * User Synchronization Utilities
 *
 * Functions to sync users between Stack Auth and our custom Neon database.
 */

import { db } from '@/lib/neon';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { stackServerApp } from '@/stack';
import { ensureUserHasSubscription } from '@/lib/subscription-manager';

/**
 * Sync a single user from Stack Auth to Neon DB
 */
export async function syncUserToNeonDB(stackUserId: string): Promise<void> {
  try {
    // Get user from Stack Auth
    const stackUser = await stackServerApp.getUser(stackUserId);

    if (!stackUser) {
      throw new Error(`Stack Auth user ${stackUserId} not found`);
    }

    // Ensure we have a valid email
    const userEmail = stackUser.primaryEmail;
    if (!userEmail) {
      throw new Error(`User ${stackUserId} has no primary email`);
    }

    // Check if user already exists in Neon DB
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, stackUser.id))
      .limit(1);

    const userData = {
      id: stackUser.id,
      name: stackUser.displayName || userEmail.split('@')[0] || 'Unknown',
      email: userEmail,
      emailVerified: stackUser.primaryEmailVerified || false,
      image: stackUser.profileImageUrl || null,
      updatedAt: new Date(),
    };

    if (existingUser.length > 0) {
      // Update existing user
      await db
        .update(users)
        .set(userData)
        .where(eq(users.id, stackUser.id));

      console.log(`Updated user ${stackUser.id} in Neon DB`);
    } else {
      // Create new user
      await db.insert(users).values({
        ...userData,
        createdAt: new Date(),
      });

      console.log(`Created user ${stackUser.id} in Neon DB`);

      // Ensure user has a free tier subscription using centralized manager
      await ensureUserHasSubscription(stackUser.id);

        // Trigger welcome email and drip sequence
        const { sendTemplate, createDripSchedule } = await import('@/lib/mailer');
        try {
          await sendTemplate(
            userEmail,
            'welcome',
            { plan: 'free', priceMap: { starterMonthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID, proMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID } },
            stackUser.id,
            { key: `welcome_${userEmail}` }
          );
          // Trigger indoctrination1 email
          await sendTemplate(
            userEmail,
            'indoctrination1',
            { name: stackUser.displayName || userEmail.split('@')[0] || 'Unknown' },
            stackUser.id,
            { key: `indoctrination1_${userEmail}` }
          );
          // Trigger subscriptionActive email (handles free tier)
          await sendTemplate(
            userEmail,
            'subscriptionActive',
            { plan: 'free', previous: undefined, priceMap: { starterMonthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID, proMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID } },
            stackUser.id,
            { key: `subscriptionActive_${userEmail}` }
          );
          await createDripSchedule(stackUser.id, new Date());
          // Future: Add more sequential email triggers here as needed
        } catch (e) {
          console.error('Error sending welcome/drip emails:', e);
        }
    }
  } catch (error) {
    console.error(`Error syncing user ${stackUserId}:`, error);
    throw error;
  }
}

/**
 * Sync all Stack Auth users to Neon DB (useful for initial setup)
 */
export async function syncAllUsersToNeonDB(): Promise<void> {
  try {
    console.log('Starting full user synchronization...');

    // Note: Stack Auth may not have a listUsers function in the current version
    // This is a placeholder - you may need to manually sync users or use a different approach
    console.log('Full sync not available - sync users individually as needed');

  } catch (error) {
    console.error('Error during full user synchronization:', error);
    throw error;
  }
}

/**
 * Get user from Neon DB by Stack Auth ID
 */
export async function getUserFromNeonDB(stackUserId: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, stackUserId))
      .limit(1);

    return user[0] || null;
  } catch (error) {
    console.error(`Error getting user ${stackUserId} from Neon DB:`, error);
    throw error;
  }
}
