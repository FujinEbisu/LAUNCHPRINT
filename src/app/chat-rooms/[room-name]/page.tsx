/**
 * Dynamic Chat Room Page
 *
 * This page handles individual chat rooms based on the user's tier access.
 * Route: /chat-rooms/[room-name]
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { useRouter, useParams } from 'next/navigation';
import FreeTierChat from '@/sections/strategy-rooms/free-tier';
import CustomerChat from '@/sections/strategy-rooms/starter-tier';

interface TierInfo {
  name: string;
  chatRooms: string[];
  features: string[];
  monthlyStrategies: number;
  canSaveData: boolean;
  hasTeamCollaboration: boolean;
  supportLevel: string;
}

interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  hasPaidSubscription: boolean;
  hasFreeTier: boolean;
  currentTier: string;
  tierInfo: TierInfo | null;
  availableChatRooms: string[];
}

export default function ChatRoomPage() {
  const user = useUser();
  const router = useRouter();
  const params = useParams();
  const roomName = params['room-name'] as string;

  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      if (!user || !user.id) {
        router.push('/');
        return;
      }

      try {
        const res = await fetch(`/api/subscription-status?userId=${user.id}`);
        const data = await res.json();

        if (res.ok && data.subscriptionStatus) {
          setSubscriptionStatus(data.subscriptionStatus);

          // Check if user has access to this specific chat room
          const hasRoomAccess = data.subscriptionStatus.availableChatRooms.includes(roomName);
          setHasAccess(hasRoomAccess);

          if (!hasRoomAccess) {
            setError(`You don't have access to this chat room. Please upgrade your plan to access "${roomName}".`);
          }
        } else {
          setError(data.error || 'Failed to load subscription status');
        }
      } catch (err) {
        setError('Failed to load subscription status');
        console.error('Error fetching subscription status:', err);
      } finally {
        setLoading(false);
      }
    }

    if (roomName) {
      checkAccess();
    }
  }, [user, router, roomName]);

  const getChatRoomDisplayName = (chatRoom: string): string => {
    const displayNames: Record<string, string> = {
      'general-help': 'Strategy Room',
      'marketing-strategies': 'Marketing Strategies',
      'email-templates': 'Email Templates',
      'beginner-tips': 'Beginner Tips',
      'advanced-strategies': 'Advanced Strategies',
      'ab-testing': 'A/B Testing',
      'team-collaboration': 'Team Collaboration',
      'priority-support': 'Priority Support',
    };
    return displayNames[chatRoom] || chatRoom;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="flex gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-4 h-4 bg-black animate-pulse shadow-hard"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
          <p className="text-black font-medium">Loading chat room...</p>
        </div>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="card-square p-8">
            <h1 className="text-2xl font-bold text-black mb-4">Access Denied</h1>
            <p className="text-black mb-6">{error || 'You don\'t have access to this chat room.'}</p>
            <div className="flex gap-4">
              <button
                className="btn-square flex-1"
                onClick={() => router.push('/user-profiles')}
              >
                Back to Dashboard
              </button>
              <button
                className="btn-square-accent flex-1"
                onClick={() => router.push('/pricing')}
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine which chat component to render based on tier
  const renderChatComponent = () => {
    const currentTier = subscriptionStatus?.currentTier;

    // Get strategy data from localStorage
    const generatedStrategy = localStorage.getItem('generatedStrategy') || '';
    const storedFormData = localStorage.getItem('strategyFormData');

    let formData = {
      problem: `I'm in the ${getChatRoomDisplayName(roomName)} and need assistance.`
    };

    // If we have stored form data, use it
    if (storedFormData) {
      try {
        formData = JSON.parse(storedFormData);
      } catch (error) {
        console.error('Error parsing stored form data:', error);
      }
    }

    // Add plan tier display to the top
    const PlanTierBadge = () => (
      <div className="flex justify-between items-center mb-6">
        <button
          className="btn-square"
          onClick={() => router.push('/user-profiles')}
        >
          ← Back to Dashboard
        </button>
        <div className="inline-flex items-center gap-2">
          <span className="text-black font-medium">Your Plan:</span>
          <div className="px-4 py-2 bg-black text-white font-bold text-lg shadow-hard">
            {subscriptionStatus?.tierInfo?.name?.toUpperCase()}
          </div>
        </div>
      </div>
    );

    if (currentTier === 'free') {
      return (
        <div className="min-h-screen bg-white">
          <div className="w-full max-w-6xl mx-auto p-6">
            <PlanTierBadge />
            <FreeTierChat formData={formData} initialStrategy={generatedStrategy} />
          </div>
        </div>
      );
    } else {
      // For starter and pro tiers, use the CustomerChat component
      return (
        <div className="min-h-screen bg-white">
          <div className="w-full max-w-6xl mx-auto p-6">
            <PlanTierBadge />
            <CustomerChat formData={formData} initialStrategy={generatedStrategy} />
          </div>
        </div>
      );
    }
  };

  return renderChatComponent();
}
