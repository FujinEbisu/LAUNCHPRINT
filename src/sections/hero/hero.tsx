'use client';

import React, { useState, useEffect } from 'react';
import FreeTierChat from '../strategy-rooms/free-tier';
import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';

const COMPANY_NAME = 'LaunchPrint';

const questions = [
  // The Basics About Your Business
  { label: "What problem does your product solve for customers?", name: "problem" },
];

export default function Hero() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(() => Object.fromEntries(questions.map(q => [q.name, ''])));
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [strategyData, setStrategyData] = useState<{strategy: string; error?: string} | null>(null);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    async function checkAndRedirect() {
      if (user && user.id) {
        try {
          // Call your API to check subscription status
          const res = await fetch(`/api/subscription-status?userId=${user.id}`);
          const data = await res.json();

          // Check if user has any active subscription (including free tier)
          if (data.subscriptionStatus?.hasActiveSubscription) {
            const tier = data.subscriptionStatus.currentTier;
            console.log(`User has ${tier} tier subscription, redirecting to user profile`);
            router.replace('/user-profiles'); // Redirect to user profile dashboard
          }
        } catch (error) {
          console.error('Error checking subscription status:', error);
        }
      }
    }
    checkAndRedirect();
  }, [user, router]);

  function handleFormChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitted(true);
    generateStrategy();
  }

  const generateStrategy = async () => {
    setIsGeneratingStrategy(true);
    try {
      const response = await fetch('/api/perplex-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (data.success) {
        setStrategyData({ strategy: data.strategy });
      } else {
        setStrategyData({ strategy: '', error: data.error || 'Failed to generate strategy. Please try again.' });
      }
    } catch {
      setStrategyData({ strategy: '', error: 'Something went wrong. Please try again.' });
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

  const handleAuthSuccess = () => {
    // Refresh user session or redirect
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-2xl mx-auto p-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-black">{COMPANY_NAME}</h1>
        <h2 className="text-xl text-center text-black mb-8">Quick Test - Start for Free to begin.</h2>
        {!showForm && !formSubmitted && (
          <div className="flex flex-col items-center gap-4">
            <button
              className="btn-square w-full max-w-xs text-lg py-3"
              onClick={() => setShowForm(true)}
            >
              Start for Free
            </button>
            <div className="flex gap-4 w-full max-w-xs">
               <a
                href="/handler/sign-in"
                className="btn-square flex-1 text-center"
                >
                Sign In
                </a>
                <div className="flex items-center justify-center">
                <span className="text-gray-400 text-sm mx-2">or</span>
                </div>
                <a
                href="/pricing"
                className="btn-square flex-1 text-center"
                >
                Sign Up
                </a>
            </div>
          </div>
        )}
        {showForm && !formSubmitted && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="card-square max-w-lg w-full p-8 overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-semibold mb-4 text-center text-[var(--secondary)]">
                Don&apos;t let the marketing overwhelm you!
                </h3>
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {questions.map(q => (
                    <div key={q.name}>
                      <label className="block font-medium mb-1 text-[var(--secondary)]" htmlFor={q.name}>{q.label}</label>
                      <textarea
                        id={q.name}
                        name={q.name}
                        value={form[q.name]}
                        onChange={handleFormChange}
                        className="input-square w-full mb-2"
                        rows={2}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <button type="submit" className="btn-square">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {formSubmitted && isGeneratingStrategy && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="mb-6">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-4 h-4 bg-[var(--primary)] animate-pulse shadow-hard"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-500 text-sm font-light">
              {/* Add a random sentence generated that changes every 2 seconds */}
              Your marketing strategy is being generated, this will take a couple of minutes.
            </p>
          </div>
        )}

        {formSubmitted && !isGeneratingStrategy && strategyData && (
          <FreeTierChat
            formData={form}
            initialStrategy={strategyData.strategy}
            initialError={strategyData.error}
          />
        )}
      </div>
    </div>
  );
}
