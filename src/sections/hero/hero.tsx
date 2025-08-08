'use client';

import React, { useState, useEffect, useRef } from 'react';
import FreeTierChat from '../strategy-rooms/free-tier';
import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type CopywritingItem = {
  name: string;
  callout?: string;
  description?: string;
};

const COMPANY_NAME = 'LaunchPrint';

const copywriting: CopywritingItem[] = [
  { callout: "Built for Beginner entrepreneurs", name: "for-beginners" },
  { callout: "Zero marketing Experience? Tight Budget? That’s Exactly Who This Tool Is For", name: "zero-marketing-exp" },
  { callout: "For First-Time Founders Only. No Budget? No Problem. This Is Your Starting Line", name: "first-time-founders" },
  { callout: "New to Marketing? You’re Exactly Who I Built This For", name: "new-to-marketing" },
  { callout: "Tired of Theory? Built for First-Timers Who Want Real Outcomes", name: "tired-of-theory" },
  { description: "You’re going to find rough edges. LaunchPrint is in early days, which means some things might be clunky, a few templates are basic, and—yes—sometimes you’ll be the one spotting a bug before we do.", name: "rough-edges" },
  { description: "Because we’re new, we don’t have a thousand case studies yet. You might be taking a leap with us—but that means your feedback shapes the product more than with any “big name.”", name: "we-don-t-have-a-thousand" },
  { description: "Finally, a Marketing Strategy You’ll Understand and Use --an Action Plan That Won’t Waste Your Time or Money", name: "strategy-you-ll-understand" },
  { description: "Because your Product Deserves Attention. Here’s How REAL Founders Get Their First Customers.", name: "your-Product-Deserves" },

];

const questions = [
  // The Basics About Your Business
  { label: "What problem does your product solve for customers?", name: "problem" },
];

export default function Hero() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, string>>(() => Object.fromEntries(questions.map(q => [q.name, ''])));
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [strategyData, setStrategyData] = useState<{strategy: string; error?: string} | null>(null);
  const user = useUser();
  const router = useRouter();
  const firstFieldRef = useRef<HTMLTextAreaElement | null>(null);
  const [selectedCallout, setSelectedCallout] = useState<CopywritingItem | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<CopywritingItem | null>(null);

  // ...

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

  // Modal: lock body scroll and focus first field on open; ESC to close
  useEffect(() => {
    if (showForm && !formSubmitted) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // Focus first textarea if available
      setTimeout(() => firstFieldRef.current?.focus(), 0);
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setShowForm(false);
      };
      document.addEventListener('keydown', onKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        document.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [showForm, formSubmitted]);

  // Randomize exactly one callout (H1) and one description (H2) once per session
  useEffect(() => {
    const KEY = 'lp-hero-copy-v2-single';
    const callouts = copywriting.filter(c => c.callout);
    const descriptions = copywriting.filter(c => c.description);
    try {
      const stored = sessionStorage.getItem(KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { calloutName: string; descriptionName: string };
        const c = callouts.find(i => i.name === parsed.calloutName) ?? callouts[0] ?? null;
        const d = descriptions.find(i => i.name === parsed.descriptionName) ?? descriptions[0] ?? null;
        setSelectedCallout(c);
        setSelectedDescription(d);
      } else {
        const c = callouts.length ? callouts[Math.floor(Math.random() * callouts.length)] : null;
        const d = descriptions.length ? descriptions[Math.floor(Math.random() * descriptions.length)] : null;
        if (c && d) {
          sessionStorage.setItem(KEY, JSON.stringify({ calloutName: c.name, descriptionName: d.name }));
        }
        setSelectedCallout(c ?? null);
        setSelectedDescription(d ?? null);
      }
    } catch {
      setSelectedCallout(callouts[0] ?? null);
      setSelectedDescription(descriptions[0] ?? null);
    }
  }, []);

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

  // ...

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--secondary)] py-24 px-8 sm:px-12">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div className="w-full max-w-2xl mx-auto p-4 ">
        {/* Company badge */}
        <div
          className="inline-block px-3 py-1 bg-[var(--primary)] text-[var(--secondary)] font-bold text-xs sm:text-sm shadow-hard border-2 border-[var(--primary)] uppercase tracking-wide mb-4"
          aria-label="Company badge"
        >
          {COMPANY_NAME}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-start mb-4 text-[var(--primary)]">
          {selectedCallout?.callout || copywriting.find(c => c.callout)?.callout || ''}
        </h1>
        <h2 className="text-xl text-start text-[var(--muted)] mb-8">
          {selectedDescription?.description || copywriting.find(c => c.description)?.description || ''}
        </h2>
        </div>

        <div className='w-full max-w-2xl content-center p-4'>
          <h2 className='text-sm font-medium text-center mb-4 text-[var(--muted)]'>
            You can Start Here
          </h2>
          {/* Right column content area: CTA, loader, or chat */}
          {!formSubmitted && !showForm && (
            <div className="flex flex-col items-center gap-4">
              <button
                className="btn-square w-full max-w-xs text-lg py-3"
                onClick={() => setShowForm(true)}
              >
                Give it a try for FREE
              </button>
              <div className="flex gap-4 w-full max-w-xs">
                <Link
                  href="/handler/sign-in"
                  className="btn-square flex-1 text-center text-sm"
                  passHref
                >
                  Sign In
                </Link>
                <div className="flex items-center justify-center">
                  <span className="text-gray-400 text-sm mx-2">or</span>
                </div>
                <Link
                  href="/pricing"
                  className="btn-square flex-1 text-center text-sm md:tex"
                >
                  Sign Up
                </Link>
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
              <p className="text-[var(--primary)] text-sm font-light">
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

        {showForm && !formSubmitted && (
          <div
            className="fixed inset-0 bg-[var(--primary)]/80 flex items-center justify-center z-50"
            role="presentation"
            onClick={() => setShowForm(false)}
          >
            <div
              className="card-square max-w-lg w-full p-8 overflow-y-auto max-h-[90vh] relative"
              role="dialog"
              aria-modal="true"
              aria-labelledby="hero-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-[var(--primary)] hover:bg-gray-100 rounded-full p-2 font-bold text-xl z-10"
                aria-label="Close modal"
              >
                ✕
              </button>
              <h3 id="hero-modal-title" className="text-2xl font-semibold mb-4 text-start text-[var(--primary)]">
                Don&apos;t let the marketing overwhelm you!
              </h3>
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {questions.map((q, idx) => (
                    <div key={q.name}>
                      <label className="block font-medium mb-1 text-[var(--primary)]" htmlFor={q.name}>{q.label}</label>
                      <textarea
                        id={q.name}
                        name={q.name}
                        value={form[q.name]}
                        onChange={handleFormChange}
                        className="input-square w-full mb-2"
                        rows={2}
                        required
                        ref={idx === 0 ? firstFieldRef : undefined}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <button type="submit" className="btn-square" aria-busy={isGeneratingStrategy}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
