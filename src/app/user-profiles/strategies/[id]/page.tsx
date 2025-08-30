'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Strategy {
  id: number;
  problem: string;
  strategy: string;
  createdAt: string;
  userId: string;
}

export default function ViewStrategyPage() {
  const user = useUser();
  const router = useRouter();
  const params = useParams();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const strategyId = params.id as string;

  const fetchStrategy = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/user-strategies?userId=${user.id}&strategyId=${strategyId}`);
      const data = await response.json();

      if (data.success && data.strategies.length > 0) {
        setStrategy(data.strategies[0]);
      } else {
        setError('Strategy not found or you do not have access to it');
      }
    } catch (err) {
      setError('Failed to load strategy');
      console.error('Error fetching strategy:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, strategyId]);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    if (!strategyId) {
      setError('Strategy ID is required');
      setLoading(false);
      return;
    }

    fetchStrategy();
  }, [user, strategyId, router, fetchStrategy]);

  const copyToClipboard = async () => {
    if (!strategy) return;

    try {
      await navigator.clipboard.writeText(strategy.strategy);
    } catch (err) {
      console.error('Failed to copy strategy:', err);
    }
  };

  const downloadStrategy = () => {
    if (!strategy) return;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-black">Loading strategy...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error || !strategy) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="card-square p-6 sm:p-12 text-center">
            <h3 className="text-xl font-bold text-red-600 mb-4">Error</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/user-profiles/strategies"
                className="btn-square w-full sm:w-auto"
              >
                Back to Strategies
              </Link>
              <Link
                href="/user-profiles"
                className="btn-square-accent w-full sm:w-auto"
              >
                Back to Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="card-square p-6 min-h-[80vh] flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b-2 border-black gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-black">Marketing Strategy #{strategy.id}</h1>
              <p className="text-sm text-muted-foreground">
                Created: {formatDate(strategy.createdAt)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link
                href="/user-profiles/strategies"
                className="btn-square w-full sm:w-auto"
              >
                Back to Library
              </Link>
              <button
                onClick={copyToClipboard}
                className="btn-square w-full sm:w-auto"
              >
                Copy
              </button>
              <button
                onClick={downloadStrategy}
                className="btn-square w-full sm:w-auto"
              >
                Download
              </button>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-black mb-3">Original Problem Statement</h3>
            <div className="bg-gray-50 p-4 border-2 border-black rounded">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{strategy.problem}</p>
            </div>
          </div>

          {/* Strategy Content */}
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[60vh]">
            <div className="bg-muted text-black p-6 shadow-hard-lg border-2 border-black">
              <h3 className="font-bold mb-4 text-lg">Complete Marketing Strategy</h3>
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{strategy.strategy}</pre>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-black text-center">
            <p className="text-xs text-muted-foreground">
              Strategy saved to your account • You can always access this from your profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
