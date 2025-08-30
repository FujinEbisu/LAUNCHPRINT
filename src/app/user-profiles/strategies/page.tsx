'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Strategy {
  id: number;
  problem: string;
  strategy: string;
  createdAt: string;
}

export default function UserStrategiesPage() {
  const user = useUser();
  const router = useRouter();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserStrategies = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/user-strategies?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setStrategies(data.strategies);
      } else {
        setError(data.error || 'Failed to fetch strategies');
      }
    } catch (err) {
      setError('Failed to load strategies');
      console.error('Error fetching strategies:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    fetchUserStrategies();
  }, [user, router, fetchUserStrategies]);

  const handleViewStrategy = (strategyId: number) => {
    router.push(`/user-profiles/strategies/${strategyId}`);
  };

  const copyToClipboard = async (strategy: string) => {
    try {
      await navigator.clipboard.writeText(strategy);
    } catch (err) {
      console.error('Failed to copy strategy:', err);
    }
  };

  const downloadStrategy = (strategy: Strategy) => {
    const blob = new Blob([strategy.strategy], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketing-strategy-${strategy.id}-${new Date(strategy.createdAt).toLocaleDateString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-[var(--primary)]">Loading your strategies...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary)]">Your Marketing Strategies</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              All your saved marketing strategies in one place
            </p>
          </div>
          <Link href="/user-profiles" className="btn-square w-full sm:w-auto">
            Back to Profile
          </Link>
        </div>

        {error && (
          <div className="card-square p-6 mb-8 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {strategies.length === 0 && !error ? (
          <div className="card-square p-6 sm:p-12 text-center">
            <h3 className="text-xl font-bold text-[var(--secondary)] mb-4">No strategies yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven&apos;t created any marketing strategies yet. Start by generating your first strategy!
            </p>
            <Link
              href="/user-profiles"
              className="btn-square-accent"
            >
              Create Your First Strategy
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {strategies.map((strategy) => (
              <div key={strategy.id} className="card-square p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[var(--primary)] mb-2">
                      Strategy #{strategy.id}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Created: {formatDate(strategy.createdAt)}
                    </p>
                    <div className="bg-gray-50 p-4 rounded border-2 border-black mb-4">
                      <p className="text-sm font-semibold text-[var(--primary)] mb-1">Problem:</p>
                      <p className="text-sm text-gray-700">
                        {truncateText(strategy.problem, 200)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-[var(--primary)] mb-2">Strategy Preview:</p>
                  <div className="bg-muted p-4 border-2 border-black rounded">
                    <pre className="text-xs font-mono whitespace-pre-wrap text-[var(--primary)]">
                      {truncateText(strategy.strategy, 300)}
                    </pre>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                  <Link
                    href={`/user-profiles/strategies/${strategy.id}`}
                    className="btn-square text-sm w-full sm:w-auto"
                  >
                    View Full Strategy
                  </Link>
                  <button
                    onClick={() => copyToClipboard(strategy.strategy)}
                    className="btn-square text-sm w-full sm:w-auto"
                    data-umami-event="copy-strategy-button"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => downloadStrategy(strategy)}
                    className="btn-square text-sm w-full sm:w-auto"
                    data-umami-event="download-strategy-button"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {strategies.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/user-profiles"
              className="btn-square-accent"
            >
              Create New Strategy
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
