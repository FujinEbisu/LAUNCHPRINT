/**
 * User Profile Dashboard
 *
 * This page shows the user's subscription tier, available features, and access levels.
 * It serves as the main dashboard after login showing what the user can access.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';

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

export default function UserProfilePage() {
  type Question = { label: string; name: string; bullets?: string[] };
  interface FollowupForm {
    outcomesSummary: string;
    bestChannel: string;
    worstChannel: string;
    obstacles: string;
    newGoals: string;
    timePerDay: string;
    budget: string;
    businessMode: string;
    hasPhysicalStore: string;
    geography: string;
    notes: string;
  core_who?: string;
  core_what?: string;
  core_when?: string;
  core_how?: string;
  core_budget?: string;
  annotatedStrategy?: string;
  }
  const user = useUser();
  const router = useRouter();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [isGeneratingFollowup, setIsGeneratingFollowup] = useState(false);
  const [isCancellingSubscription, setIsCancellingSubscription] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  interface StrategyUsage { used: number; limit: number; isFollowupDue?: boolean; firstStrategyAt?: string | null }
  const [strategyUsage, setStrategyUsage] = useState<StrategyUsage>({ used: 0, limit: 0 });
  const [openHintIndex, setOpenHintIndex] = useState<number | null>(null);
  const [showHeadlinesModal, setShowHeadlinesModal] = useState(false);
  const [isGeneratingHeadlines, setIsGeneratingHeadlines] = useState(false);
  const [generatedHeadlines, setGeneratedHeadlines] = useState<string | null>(null);
  const [openCoreHint, setOpenCoreHint] = useState<string | null>(null);
  const [headlinesForm, setHeadlinesForm] = useState({
    product: '',
    targetAudience: '',
    uniqueValue: '',
    tone: 'professional', // professional, casual, urgent, friendly
    purpose: 'sales', // sales, awareness, engagement, conversion
  });
  const [strategyForm, setStrategyForm] = useState({
    // Core Four Qs
    who: '',
    what: '',
    when: '',
    how: '',
    // Legacy fields kept for backend compatibility (unused in UI but posted as part of payload)
    problem: '',
    productSimple: '',
    b2bOrB2c: '',
    launchOrExisting: '',
    revenueRange: '',
    customerCount: '',
    idealCustomer: '',
    customerIndustry: '',
    companySize: '',
    customerChallenge: '',
    currentSolution: '',
    goal6mo: '',
    goalType: '',
    successCriteria: '',
    marketingBudget: '',
    marketingTime: '',
    marketingMaterials: '',
    competitors: '',
    differentiation: '',
    discovery: '',
  });

  const [followupForm, setFollowupForm] = useState<FollowupForm>({
    outcomesSummary: '', // What happened since last plan
    bestChannel: '',     // What worked best and why
    worstChannel: '',    // What didn’t work and why
    obstacles: '',       // Biggest blockers you faced
    newGoals: '',        // What you want next month
    timePerDay: '',      // Minutes/day you can commit
    budget: '',          // Monthly budget update
    businessMode: '',    // product | service | mixed
    hasPhysicalStore: '',// yes | no
    geography: '',       // local | regional | national | global
    notes: '',           // anything else worth knowing
  });

  // Four Core Questions with guidance bullets for info bubble
const coreQuestions: Question[] = [
{
label: 'Who are you trying to help (and who should you ignore)?',
name: 'who',
bullets: [
'What keeps them up at 3 AM',
'Where they hang out and how they decide (online + offline)',
'If local: city/area and how far you can travel (miles/km)',
'What makes them buy right now',
'Top objections stopping them',
'Who is NOT a fit (exclude on purpose)',
],
},
{
label: 'What problem do you solve that nobody else can?',
name: 'what',
bullets: [
'Clear transformation in 30 days or less',
'Your unfair advantage vs. alternatives',
'Simple proof it works (wins, screenshots, cases)',
'Tangible results they’ll feel after buying (product or service)',
'Risk reversal (guarantee, trial, easy refund)',
],
},
{
label: 'What is your monthly advertising budget (be honest)?',
name: 'budget',
bullets: [
'Monthly ad spend range (EUR/USD)',
'Preferred channels for spend (Meta, Google, TikTok, LinkedIn)',
'Target CPA/CAC and AOV/LTV (ballpark is fine)',
'Attribution setup (pixels, conversions, CRM)',
'Local/Offline budget (print, flyers, booths, events)',
'Runway: how many months can you fund testing?',
],
},
{
label: 'When do they need you most?',
name: 'when',
bullets: [
'Buying stage (just looking, comparing, ready)',
'Best timing (season, month, moments)',
'Trigger events that create urgency',
'Follow-up cadence that gets replies',
'How often to show up to stay top-of-mind',
],
},
{
label: 'How do you get them from “maybe” to “yes”?',
name: 'how',
bullets: [
'Step-by-step path from discover → buy → stay',
'Content/touchpoints for each step',
'Conversion tools (LP, email, DMs, retargeting)',
'Remove friction (speed, clarity, trust, in-person flow if store)',
'Measure and improve (one metric per step)',
],
},
];

  // Follow-up questions (monthly double-down)
  const followupQuestions: Question[] = [
    {
      label: 'What happened since your last plan? (wins, replies, sales, foot traffic, calls)',
      name: 'outcomesSummary',
      bullets: [
        'How many conversations, trials, or sales?',
        'Any standout stories or objections?',
        'What surprised you most?'
      ],
    },
    {
      label: 'What worked BEST and why?',
      name: 'bestChannel',
      bullets: [
        'Which channel had the clearest signal?',
        'What message/script resonated?',
        'Any local/offline tactic that clicked?'
      ],
    },
    {
      label: 'What didn’t work? (cut or reframe)',
      name: 'worstChannel',
      bullets: [
        'Which channel underperformed after 2–3 tries?',
        'What part felt unnatural or too slow?'
      ],
    },
    {
      label: 'Biggest blockers to progress',
      name: 'obstacles',
      bullets: [
        'Time, confidence, tools, access, seasonality',
        'What kept you from executing consistently?'
      ],
    },
    {
      label: 'New goals for the next 30 days',
      name: 'newGoals',
      bullets: [
        'Quantify: conversations, meetings, sales, visits',
        'Which audience to prioritize now?'
      ],
    },
    {
      label: 'Time per day you can commit (realistically)',
      name: 'timePerDay',
    },
    {
      label: 'Monthly budget (updated)',
      name: 'budget',
    },
    {
      label: 'Your business mode',
      name: 'businessMode',
      bullets: [
        'product | service | mixed',
      ],
    },
    {
      label: 'Do you have a physical store?',
      name: 'hasPhysicalStore',
      bullets: ['yes | no'],
    },
    {
      label: 'Geography focus',
      name: 'geography',
      bullets: ['local | regional | national | global'],
    },
    {
      label: 'Anything else we should know?',
      name: 'notes',
    },
  ];

  // Use the same Four Core Questions across tiers for a focused, high-signal brief
  const freeQuestions: Question[] = coreQuestions;
  const starterQuestions: Question[] = coreQuestions;
  const proQuestions: Question[] = coreQuestions;

  const getCurrentQuestions = () => {
    if (!subscriptionStatus) return freeQuestions;

    switch (subscriptionStatus.currentTier) {
      case 'free':
        return freeQuestions;
      case 'starter':
        return starterQuestions;
      case 'pro':
        return proQuestions;
      default:
        return freeQuestions;
    }
  };

  const getModalTitle = () => {
    if (!subscriptionStatus) return 'Create Your Marketing Strategy';

    switch (subscriptionStatus.currentTier) {
      case 'free':
        return 'Create Your Basic Marketing Strategy';
      case 'starter':
        return 'Create Your Enhanced Marketing Strategy';
      case 'pro':
        return 'Create Your Comprehensive Marketing Strategy';
      default:
        return 'Create Your Marketing Strategy';
    }
  };

  const getFollowupModalTitle = () => 'Create Your Monthly Follow-up Strategy';
  const getFollowupModalSubtitle = () => 'Tell us what happened this month so we can double down on what works';

  const getModalSubtitle = () => {
    return 'Answer the Four Core Questions to generate your strategy';
  };

  const getTierLabel = () => {
    if (!subscriptionStatus) return 'TEST TIER';
    return `${subscriptionStatus.currentTier?.toUpperCase()} TIER`;
  };

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      // Show loader, then redirect to sign out handler
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay for UX
      window.location.href = '/handler/sign-out';
      // If sign out handler returns, fallback to home
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (error) {
      setIsSigningOut(false);
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  const handleCancelSubscription = async () => {
    if (!user?.id || !subscriptionStatus?.hasPaidSubscription) return;

    const confirmCancel = window.confirm(
      'Are you sure you want to cancel your subscription? You will be downgraded to the free tier immediately.'
    );

    if (!confirmCancel) return;

    setIsCancellingSubscription(true);

    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Subscription cancelled successfully. You have been downgraded to the free tier.');
        // Refresh the page to show updated subscription status
        window.location.reload();
      } else {
        alert(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setIsCancellingSubscription(false);
    }
  };

  const handleStrategyFormChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStrategyForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleHeadlinesFormChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    setHeadlinesForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFollowupFormChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFollowupForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Helper to safely read follow-up values
  const getFollowupValue = (name: string) => {
    const key = name as keyof FollowupForm;
    return (followupForm[key] as string) ?? '';
  };

  /* THIS IS THE LOGIC IN CHARGE TO REDIRECT THE FORM TO EACH CORRESPONDING API/PERPLEX-"TIER" */
  const getPerplexApiEndpoint = () => {
    if (subscriptionStatus?.currentTier === 'starter') {
      return '/api/perplex-starter';
    } else if (subscriptionStatus?.currentTier === 'pro') {
      return '/api/perplex-pro';
    } else {
      return '/api/perplex-free';
    }
  };

  const handleStrategyFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowStrategyModal(false);
    setIsGeneratingStrategy(true);

    try {
      // uncomment when you have the endpoint logic down
      const endpoint = getPerplexApiEndpoint();

      // un comment when you have the endpoint logic down
      const response = await fetch(endpoint, {
        // THIS IS IN CHARGE OF SENDING THE STRATEGY TO THE API/PERPLEX-TEST
        // remove when you have the endpoint logic down
        //const response = await fetch('/api/perplex-test', {
        // THIS IS IN CHARGE OF SENDING THE STRATEGY TO THE API/PERPLEX-TEST

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(strategyForm)
      });

      const data = await response.json();

      if (data.success) {
        // Record the successful strategy generation
        try {
          await fetch('/api/strategy-usage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user?.id,
              problem: strategyForm.problem || 'Strategy generated',
              strategy: data.strategy,
              tier: subscriptionStatus?.currentTier // <-- Added tier
            })
          });

          // Refresh usage data
          const usageRes = await fetch(`/api/strategy-usage?userId=${user?.id}`);
          const usageData = await usageRes.json();
          if (usageRes.ok) {
            setStrategyUsage(usageData);
          }
        } catch (usageError) {
          console.error('Error recording strategy usage:', usageError);
          // Continue anyway - don't block the user
        }

        // Strategy generated successfully - store data in localStorage and redirect
        localStorage.setItem('generatedStrategy', data.strategy);
        localStorage.setItem('strategyFormData', JSON.stringify(strategyForm));

        router.push('/chat-rooms/general-help');
      } else {
        // Handle error - don't count usage
        setIsGeneratingStrategy(false);
        alert(data.error || 'Failed to generate strategy. Please try again.');
      }
    } catch {
      // Handle error - don't count usage
      setIsGeneratingStrategy(false);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleFollowupFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowFollowupModal(false);
    setIsGeneratingFollowup(true);

    try {
      // Extract annotated + core fields out of followupForm for API contract
      const f: FollowupForm = followupForm;
      const annotatedStrategy = f.annotatedStrategy;
      const core_who = f.core_who;
      const core_what = f.core_what;
      const core_when = f.core_when;
      const core_how = f.core_how;
      const core_budget = f.core_budget;
      const rawFeedback = {
        outcomesSummary: f.outcomesSummary,
        bestChannel: f.bestChannel,
        worstChannel: f.worstChannel,
        obstacles: f.obstacles,
        newGoals: f.newGoals,
        timePerDay: f.timePerDay,
        budget: f.budget,
        businessMode: f.businessMode,
        hasPhysicalStore: f.hasPhysicalStore,
        geography: f.geography,
        notes: f.notes,
      };
      const corePayload = {
        who: core_who || '',
        what: core_what || '',
        when: core_when || '',
        how: core_how || '',
        budget: core_budget || ''
      };
      const response = await fetch('/api/perplex-starter-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          annotatedStrategy: annotatedStrategy || '',
            core: corePayload,
          feedback: rawFeedback,
        }),
      });

      const data = await response.json();

      if (data.success) {
        try {
          await fetch('/api/strategy-usage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user?.id,
              problem: 'Follow-up strategy',
              strategy: data.strategy,
              tier: subscriptionStatus?.currentTier,
            }),
          });
          const usageRes = await fetch(`/api/strategy-usage?userId=${user?.id}`);
          const usageData = await usageRes.json();
          if (usageRes.ok) setStrategyUsage(usageData);
        } catch (usageError) {
          console.error('Error recording follow-up usage:', usageError);
        }

        localStorage.setItem('generatedStrategy', data.strategy);
        localStorage.setItem('followupFormData', JSON.stringify(followupForm));
        router.push('/chat-rooms/general-help');
      } else {
        setIsGeneratingFollowup(false);
        alert(data.error || 'Failed to generate follow-up strategy. Please try again.');
      }
    } catch (err) {
      console.error('Follow-up generation error:', err);
      setIsGeneratingFollowup(false);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleHeadlinesFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingHeadlines(true);

    try {
      const response = await fetch('/api/perplex-headline-gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(headlinesForm)
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedHeadlines(data.headlines);
      } else {
        alert(data.error || 'Failed to generate headlines. Please try again.');
      }
    } catch (error) {
      console.error('Headlines generation error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsGeneratingHeadlines(false);
    }
  };

  const handleCloseHeadlinesModal = () => {
    setShowHeadlinesModal(false);
    setGeneratedHeadlines(null);
    setHeadlinesForm({
      product: '',
      targetAudience: '',
      uniqueValue: '',
      tone: 'professional',
      purpose: 'sales',
    });
  };

  const copyHeadlinesToClipboard = () => {
    if (generatedHeadlines) {
      navigator.clipboard.writeText(generatedHeadlines).then(() => {
        alert('Headlines copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy headlines. Please select and copy manually.');
      });
    }
  };

  const canCreateStrategy = () => {
    return strategyUsage.used < strategyUsage.limit;
  };

  const getButtonText = () => {
    const followup = strategyUsage?.isFollowupDue === true;
    const limitReached = strategyUsage.used >= strategyUsage.limit;
    if (limitReached) return 'Monthly Limit Reached';
    if (subscriptionStatus?.currentTier === 'free') {
      return followup ? `Generate Follow-up Strategy (${strategyUsage.used}/${strategyUsage.limit})` : 'Create New Strategy';
    }
    return followup ? `Generate Follow-up Strategy (${strategyUsage.used}/${strategyUsage.limit})` : `Create New Strategy (${strategyUsage.used}/${strategyUsage.limit} used)`;
  };


  const handleMainStrategyClick = () => {
    const followup = strategyUsage?.isFollowupDue === true;
    if (followup) setShowFollowupModal(true); else setShowStrategyModal(true);
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!user || !user.id) {
        router.push('/');
        return;
      }

      try {
        // Fetch both subscription status and strategy usage in parallel
        const [subscriptionRes, strategyUsageRes] = await Promise.all([
          fetch(`/api/subscription-status?userId=${user.id}`),
          fetch(`/api/strategy-usage?userId=${user.id}`)
        ]);

        if (!mounted) return; // Component unmounted, don't update state

        const [subscriptionData, strategyData] = await Promise.all([
          subscriptionRes.json(),
          strategyUsageRes.json()
        ]);

        if (subscriptionRes.ok && subscriptionData.subscriptionStatus) {
          setSubscriptionStatus(subscriptionData.subscriptionStatus);
        } else {
          setError(subscriptionData.error || 'Failed to load subscription status');
        }

        if (strategyUsageRes.ok) {
          setStrategyUsage(strategyData);
        }

      } catch (err) {
        if (mounted) {
          setError('Failed to load data');
          console.error('Error fetching data:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

  fetchData();

    return () => {
      mounted = false;
    };
  }, [user, router]);

  // Follow-up is determined by server via strategy-usage.isFollowupDue

  if (loading || isSigningOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-center">
          <div className="flex gap-2 mb-6 justify-center">
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
          <p className="text-[var(--primary)] font-medium">
            {isSigningOut ? 'Signing you out...' : 'Loading your profile...'}
          </p>
        </div>
      </div>
    );
  }

  if (error || !subscriptionStatus) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-black mb-4 font-medium">{error || 'Failed to load profile'}</p>
          <button
            className="btn-square"
            onClick={() => router.push('/')}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-4">
          {/* Welcome Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-3">
              Welcome Back!
            </h1>
            <p className="text-base text-[var(--primary)] mb-6">
              {user?.displayName || user?.primaryEmail}
            </p>
          </div>
        </div>

        {/* Access Areas */}
        <div className="text-center max-w-4xl justify-self-center">
          {/* Buttons Container */}
          <div className="mb-8">
      {subscriptionStatus.currentTier !== 'free' ? (
              /* Paid Users: Three buttons in a row */
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {/* Create New Strategy Button */}
                <div className="text-center">
                  <button
        className={`btn-square-accent text-lg px-8 py-4 ${!canCreateStrategy() ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleMainStrategyClick}
        disabled={!canCreateStrategy()}
        data-umami-event="main-strategy-button"
                  >
        {getButtonText()}
                  </button>
                  <p className="text-black mt-2 text-sm">
        Resets monthly • All strategies saved to your account
                  </p>
                </div>

                {/* Headlines Generator Button */}
                <div className="text-center">
                  <button
                    className="btn-square text-xl px-8 py-4"
                    onClick={() => setShowHeadlinesModal(true)}
                    data-umami-event="generate-headlines-button"
                  >
                    Generate Headlines
                  </button>
                  <p className="text-black mt-2 text-sm">
                    Create compelling headlines for your campaigns
                  </p>
                </div>

                {/* View All Strategies Button */}
                <div className="text-center">
                  <button
                    className="btn-square text-xl px-8 py-4"
                    onClick={() => router.push('/user-profiles/strategies')}
                    data-umami-event="view-all-strategies-button"
                  >
                    View All My Strategies
                  </button>
                  <p className="text-black mt-2 text-sm">
                    Access your complete strategy library
                  </p>
                </div>
              </div>
            ) : (
              /* Free Users: Two buttons side by side */
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="text-center">
                  <button
                    className={`btn-square-accent text-xl px-8 py-4 ${
                      !canCreateStrategy() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleMainStrategyClick}
                    disabled={!canCreateStrategy()}
                    data-umami-event="main-strategy-button-free-tier"
                  >
                    {getButtonText()}
                  </button>
                  <p className="text-black mt-2 text-sm">
                    Monthly limit applies
                  </p>
                </div>

                <div className="text-center">
                  <button
                    className="btn-square text-xl px-8 py-4"
                    onClick={() => setShowHeadlinesModal(true)}
                    data-umami-event="generate-headlines-button-free-tier"
                  >
                    Generate Headlines
                  </button>
                  <p className="text-black mt-2 text-sm">
                    Create compelling headlines
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tier Features Card */}
        {subscriptionStatus.tierInfo && (
          <div className="card-square p-8 mb-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-text-[var(--primary)] mb-6 text-center">Your Plan Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-text-[var(--primary)] font-medium mb-2">Monthly Strategies</p>
                <div className="text-4xl font-bold text-text-[var(--primary)] mb-2">
                  {subscriptionStatus.tierInfo.monthlyStrategies === 75 ? '75' : subscriptionStatus.tierInfo.monthlyStrategies}
                </div>
                <div className="w-full h-2 bg-text-[var(--primary)]"></div>
              </div>
              <div className="text-center">
                <p className="text-text-[var(--primary)] font-medium mb-2">Data Storage</p>
                <div className="text-4xl font-bold text-text-[var(--primary)] mb-2">
                  {subscriptionStatus.tierInfo.canSaveData ? 'UNLIMITED' : 'NONE'}
                </div>
                <div className="w-full h-2 bg-text-[var(--primary)]"></div>
              </div>
              <div className="text-center">
                <p className="text-text-[var(--primary)] font-medium mb-2">Support Level</p>
                <div className="text-4xl font-bold text-text-[var(--primary)] mb-2 uppercase">
                  {subscriptionStatus.tierInfo.supportLevel}
                </div>
                <div className="w-full h-2 bg-text-[var(--primary)]"></div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Prompt for Free/Starter Users */}
        {subscriptionStatus.currentTier !== 'pro' && (
          <div className="card-square p-8 mt-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-text-[var(--primary)] mb-4">
                Unlock More Features
              </h3>
              <p className="text-text-[var(--primary)] mb-6">
                Upgrade to access more areas, advanced strategies, and priority support.
              </p>
              <button
                className="btn-square text-xl px-8 py-4"
                onClick={() => router.push('/pricing')}
                data-umami-event="view-pricing-plans-button"
              >
                View Pricing Plans
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Strategy Creation Modal */}
      {showStrategyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`bg-[var(--secondary)] border-4 border-[var(--primary)] shadow-hard w-full max-h-[90vh] overflow-y-auto ${
            subscriptionStatus?.currentTier === 'pro' ? 'max-w-6xl' :
            subscriptionStatus?.currentTier === 'starter' ? 'max-w-5xl' : 'max-w-3xl'
          }`}>
            <div className="p-6">
              {/* Header with tier-specific styling */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className={`font-bold text-[var(--primary)] mb-2 ${
                    subscriptionStatus?.currentTier === 'pro' ? 'text-3xl' :
                    subscriptionStatus?.currentTier === 'starter' ? 'text-2xl' : 'text-xl'
                  }`}>
                    {getModalTitle()}
                  </h2>
                  <p className={`text-[var(--muted)] ${
                    subscriptionStatus?.currentTier === 'pro' ? 'text-lg' : 'text-sm'
                  }`}>
                    {getModalSubtitle()}
                  </p>
                  {/* Tier badge - B&W only */}
                  <div className="inline-block px-3 py-1 mt-2 bg-[var(--primary)] text-white font-bold text-sm shadow-hard">
                    {getTierLabel()}
                  </div>
                </div>
                <button
                  onClick={() => setShowStrategyModal(false)}
                  className="text-[var(--primary)] hover:bg-[var(--secondary)] hover:shadow-hard p-2 font-bold text-xl border-2 border-transparent hover:border-[var(--primary)]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleStrategyFormSubmit}>
                <div className={`gap-4 mb-6 ${
                  subscriptionStatus?.currentTier === 'pro' ? 'grid grid-cols-1 md:grid-cols-3' :
                  subscriptionStatus?.currentTier === 'starter' ? 'grid grid-cols-1 md:grid-cols-2' :
                  'grid grid-cols-1'
                }`}>
                  {getCurrentQuestions().map((question: Question, index) => (
                    <div key={index} className={`mb-4 ${
                      subscriptionStatus?.currentTier === 'free' ? 'col-span-1' : ''
                    }`}>
                      <label className="block text-[var(--primary)] font-medium mb-2">
                        <span className="text-sm text-[var(--muted)] mr-2">
                          {index + 1}.
                        </span>
                        {question.label}
                        {question.bullets && (
                          <span className="relative inline-block ml-2 align-middle group">
                            <button
                              type="button"
                              className="inline-flex items-center justify-center w-7 h-7 border-2 border-[var(--primary)] text-[var(--primary)] font-bold text-xs cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[var(--accent2)]"
                              aria-label="More info"
                              aria-expanded={openHintIndex === index}
                              aria-controls={`qtip-${index}`}
                              onClick={() => setOpenHintIndex(openHintIndex === index ? null : index)}
                            >
                              ?
                            </button>
                            <span
                              id={`qtip-${index}`}
                              role="tooltip"
                              className={`absolute z-50 ${openHintIndex === index ? 'block' : 'hidden'} md:group-hover:block bg-[var(--secondary)] border-2 border-[var(--primary)] p-3 shadow-hard w-72 max-w-[90vw] left-1/2 -translate-x-1/2 mt-2`}
                            >
                              <ul className="list-disc pl-5 text-sm text-[var(--primary)]">
                                {question.bullets.map((b: string, i: number) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            </span>
                          </span>
                        )}
                      </label>
                      <textarea
                        name={question.name}
                        value={strategyForm[question.name as keyof typeof strategyForm]}
                        onChange={handleStrategyFormChange}
                        className="w-full p-3 border-2 border-[var(--primary)] focus:outline-none focus:border-[var(--accent2)] focus:text-[var(--primary)] resize-none"
                        rows={3}
                        placeholder={'Provide detailed information...'}
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Progress indicator - B&W only */}
                <div className="mb-6">
                  <div className="flex justify-end text-sm text-[var(--primary)] mb-2">
                    <span>{getCurrentQuestions().length} questions</span>
                  </div>
                  <div className="w-full bg-[var(--secondary)] border-2 border-[var(--primary)] h-2">
                    <div
                      className="bg-[var(--primary)] h-full transition-all duration-300"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowStrategyModal(false)}
                    className="btn-square"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-square-accent px-8 py-3"
                    data-umami-event="generate-strategy-button"
                  >
                    Generate Strategy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Headlines Generation Modal */}
      {showHeadlinesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--secondary)] border-4 border-[var(--primary)] shadow-hard w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">
                    Generate Headlines
                  </h2>
                  <p className="text-[var(--muted)] text-sm">
                    Create compelling headlines for your marketing campaigns
                  </p>
                  {/* Warning Message */}
                  <div className="bg-[var(--secondary)] border-2 border-[var(--primary)] p-3 mt-3 shadow-hard">
                    <p className="text-sm text-[var(--primary)] font-medium">
                      ⚠️ Headlines are not stored and will be lost when you close this modal. Copy them before closing!
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseHeadlinesModal}
                  className="text-[var(--primary)] hover:bg-[var(--secondary)] hover:shadow-hard p-2 font-bold text-xl border-2 border-transparent hover:border-[var(--primary)]"
                >
                  ✕
                </button>
              </div>

              {/* Loading State */}
              {isGeneratingHeadlines && (
                <div className="text-center py-8">
                  <div className="flex gap-2 mb-6 justify-center">
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
                  <p className="text-[var(--primary)] font-medium text-lg">
                    Generating compelling headlines...
                  </p>
                </div>
              )}

              {/* Generated Headlines Display */}
              {generatedHeadlines && !isGeneratingHeadlines && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[var(--primary)]">Your Generated Headlines</h3>
                    <button
                      onClick={copyHeadlinesToClipboard}
                      className="btn-square px-4 py-2 text-sm"
                      data-umami-event="copy-headlines"
                    >
                      Copy All Headlines
                    </button>
                  </div>
                  <div className="bg-[var(--secondary)] border-2 border-[var(--primary)] p-4 max-h-96 overflow-y-auto shadow-hard">
                    <pre className="whitespace-pre-wrap text-sm text-[var(--primary)] font-mono">
                      {generatedHeadlines}
                    </pre>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => {
                        setGeneratedHeadlines(null);
                      }}
                      className="btn-square text-sm"
                    >
                      Generate New Headlines
                    </button>
                    <button
                      onClick={handleCloseHeadlinesModal}
                      className="btn-square text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Form - Only show when no headlines are generated */}
              {!generatedHeadlines && !isGeneratingHeadlines && (
                <form onSubmit={handleHeadlinesFormSubmit}>
                  <div className="space-y-4 mb-6">
                    {/* Product/Service */}
                    <div>
                      <label className="block text-[var(--primary)] font-medium mb-2">
                        1. Product or Service
                      </label>
                      <textarea
                        name="product"
                        value={headlinesForm.product}
                        onChange={handleHeadlinesFormChange}
                        className="w-full p-3 border-2 border-[var(--primary)] focus:outline-none focus:border-[var(--accent2)] focus:text-[var(--primary)] resize-none"
                        rows={2}
                        placeholder="Describe what you're selling (e.g., 'AI-powered project management tool for remote teams')"
                        required
                      />
                    </div>

                    {/* Target Audience */}
                    <div>
                      <label className="block text-[var(--primary)] font-medium mb-2">
                        2. Target Audience
                      </label>
                      <textarea
                        name="targetAudience"
                        value={headlinesForm.targetAudience}
                        onChange={handleHeadlinesFormChange}
                        className="w-full p-3 border-2 border-[var(--primary)] focus:outline-none focus:border-[var(--accent2)] focus:text-[var(--primary)] resize-none"
                        rows={2}
                        placeholder="Who are you targeting? (e.g., 'Busy startup founders who struggle with team coordination')"
                        required
                      />
                    </div>

                    {/* Unique Value */}
                    <div>
                      <label className="block text-[var(--primary)] font-medium mb-2">
                        3. Unique Value Proposition
                      </label>
                      <textarea
                        name="uniqueValue"
                        value={headlinesForm.uniqueValue}
                        onChange={handleHeadlinesFormChange}
                        className="w-full p-3 border-2 border-[var(--primary)] focus:outline-none focus:border-[var(--accent2)] focus:text-[var(--primary)] resize-none"
                        rows={2}
                        placeholder="What makes you different? (e.g., 'Only tool that automatically syncs with 50+ apps and learns team patterns')"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Tone */}
                      <div>
                        <label className="block text-[var(--primary)] font-medium mb-2">
                          4. Tone
                        </label>
                        <select
                          name="tone"
                          value={headlinesForm.tone}
                          onChange={handleHeadlinesFormChange}
                          className="w-full p-3 border-2 border-[var(--primary)] focus:outline-none focus:border-[var(--accent2)] focus:text-[var(--primary)]"
                        >
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                          <option value="urgent">Urgent</option>
                          <option value="friendly">Friendly</option>
                          <option value="bold">Bold</option>
                        </select>
                      </div>

                      {/* Purpose */}
                      <div>
                        <label className="block text-[var(--primary)] font-medium mb-2">
                          5. Purpose
                        </label>
                        <select
                          name="purpose"
                          value={headlinesForm.purpose}
                          onChange={handleHeadlinesFormChange}
                          className="w-full p-3 border-2 border-[var(--primary)] focus:outline-none focus:border-[var(--accent2)] focus:text-[var(--primary)]"
                        >
                          <option value="sales">Sales</option>
                          <option value="awareness">Brand Awareness</option>
                          <option value="engagement">Engagement</option>
                          <option value="conversion">Conversion</option>
                          <option value="lead-generation">Lead Generation</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={handleCloseHeadlinesModal}
                      className="btn-square"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-square-accent px-8 py-3"
                      data-umami-event="generate-headlines-submit"
                    >
                      Generate Headlines
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Strategy Modal */}
      {showFollowupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`bg-[var(--secondary)] border-4 border-[var(--primary)] shadow-hard w-full max-h-[90vh] overflow-y-auto ${
            subscriptionStatus?.currentTier === 'pro' ? 'max-w-6xl' :
            subscriptionStatus?.currentTier === 'starter' ? 'max-w-5xl' : 'max-w-3xl'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className={`font-bold text-[var(--primary)] mb-2 ${
                    subscriptionStatus?.currentTier === 'pro' ? 'text-3xl' :
                    subscriptionStatus?.currentTier === 'starter' ? 'text-2xl' : 'text-xl'
                  }`}>
                    {getFollowupModalTitle()}
                  </h2>
                  <p className={`text-[var(--muted)] ${
                    subscriptionStatus?.currentTier === 'pro' ? 'text-lg' : 'text-sm'
                  }`}>
                    {getFollowupModalSubtitle()}
                  </p>
                  <div className="inline-block px-3 py-1 mt-2 bg-[var(--primary)] text-white font-bold text-sm shadow-hard">
                    {getTierLabel()}
                  </div>
                  <div className="mt-4 p-3 border-2 border-[var(--primary)] bg-[var(--secondary)] text-[var(--primary)] text-xs leading-relaxed shadow-hard">
                    <strong>How to prepare:</strong> Copy the strategy you actually worked from (with your own checkmarks) and paste it below. Mark completed tasks with [x] or [X], partial with [-] or [~], untouched leave as [ ]. You can annotate quick results inline.<br/>
                    <span className="font-mono">Example snippet:</span><br/>
                    <span className="font-mono">- [x] Day 1: Publish intro reel (result: 850 views, 12 saves)\n- [-] Day 2: 5 cold emails (sent 3; no replies yet)\n- [ ] Day 3: Local flyer drop (skipped due to rain)</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowFollowupModal(false)}
                  className="text-[var(--primary)] hover:bg-[var(--secondary)] hover:shadow-hard p-2 font-bold text-xl border-2 border-transparent hover:border-[var(--primary)]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFollowupFormSubmit}>
                {/* Core fields re-ask */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* WHO */}
                  <div className="col-span-1 relative">
                    <label className="flex text-[var(--primary)] font-medium mb-2 items-center gap-2">Who
                      <button type="button" aria-label="Who help" className="w-6 h-6 border-2 border-[var(--primary)] text-[var(--primary)] text-xs font-bold flex items-center justify-center" onClick={()=>setOpenCoreHint(openCoreHint==='who'?null:'who')}>?</button>
                    </label>
                    {openCoreHint==='who' && (
                      <div className="absolute z-50 bg-[var(--secondary)] border-2 border-[var(--primary)] p-3 text-xs shadow-hard w-72 max-w-[90vw]">
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Niche: e.g. &quot;first-time Etsy sellers&quot;</li>
                          <li>Primary pain @ 3AM</li>
                          <li>Where they already gather (online + offline)</li>
                          <li>Who is NOT a fit (exclude)</li>
                        </ul>
                        <div className="mt-2 font-mono">Example: &quot;Local vegan bakery owners in Austin launching first wholesale line; not hobby bakers&quot;</div>
                      </div>
                    )}
                    <textarea name="core_who" value={followupForm.core_who || ''} onChange={(e)=>setFollowupForm(p=>({...p, core_who:e.target.value}))} className="w-full p-3 border-2 border-[var(--primary)] focus:outline-none focus:border-[var(--accent2)] focus:text-[var(--primary)] resize-none" rows={2} placeholder="e.g. Solo fitness coaches w/ 0–5 clients (exclude bodybuilders)" required />
                  </div>
                  {/* WHAT */}
                  <div className="col-span-1 relative">
                    <label className="flex text-[var(--primary)] font-medium mb-2 items-center gap-2">What (unique problem solved)
                      <button type="button" aria-label="What help" className="w-6 h-6 border-2 border-[var(--primary)] text-[var(--primary)] text-xs font-bold flex items-center justify-center" onClick={()=>setOpenCoreHint(openCoreHint==='what'?null:'what')}>?</button>
                    </label>
                    {openCoreHint==='what' && (
                      <div className="absolute z-50 bg-[var(--secondary)] border-2 border-[var(--primary)] p-3 text-xs shadow-hard w-72 max-w-[90vw]">
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Clear transformation (30–90d)</li>
                          <li>Why current alternatives fail</li>
                          <li>Your unfair advantage / mechanism</li>
                          <li>Simple social proof (1 line)</li>
                        </ul>
                        <div className="mt-2 font-mono">Example: &quot;Turn unused podcast clips into 15 daily vertical videos automatically&quot;</div>
                      </div>
                    )}
                    <textarea name="core_what" value={followupForm.core_what || ''} onChange={(e)=>setFollowupForm(p=>({...p, core_what:e.target.value}))} className="w-full p-3 border-2 border-[var(--primary)] focus:outline-none focus:border-[var(--accent2)] focus:text-[var(--primary)] resize-none" rows={2} placeholder="e.g. Automates X so they achieve Y without Z" required />
                  </div>
                  {/* WHEN */}
                  <div className="col-span-1 relative">
                    <label className="flex text-[var(--primary)] font-medium mb-2 items-center gap-2">When (urgency / timing)
                      <button type="button" aria-label="When help" className="w-6 h-6 border-2 border-[var(--primary)] text-[var(--primary)] text-xs font-bold flex items-center justify-center" onClick={()=>setOpenCoreHint(openCoreHint==='when'?null:'when')}>?</button>
                    </label>
                    {openCoreHint==='when' && (
                      <div className="absolute z-50 bg-[var(--secondary)] border-2 border-[var(--primary)] p-3 text-xs shadow-hard w-72 max-w-[90vw]">
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Trigger events (launch, season)</li>
                          <li>Deadlines or renewals</li>
                          <li>Why NOW vs later</li>
                        </ul>
                        <div className="mt-2 font-mono">Example: &quot;Need traction before Q4 gifting season&quot;</div>
                      </div>
                    )}
                    <textarea name="core_when" value={followupForm.core_when || ''} onChange={(e)=>setFollowupForm(p=>({...p, core_when:e.target.value}))} className="w-full p-3 border-2 border-[var(--primary)] focus:outline-none focus:border-[var(--accent2)] focus:text-[var(--primary)] resize-none" rows={2} placeholder="e.g. Before demo day / seasonal launch / hitting churn cliff" required />
                  </div>
                  {/* HOW */}
                  <div className="col-span-1 relative">
                    <label className="flex text-[var(--primary)] font-medium mb-2 items-center gap-2">How (conversion mechanism)
                      <button type="button" aria-label="How help" className="w-6 h-6 border-2 border-[var(--primary)] text-[var(--primary)] text-xs font-bold flex items-center justify-center" onClick={()=>setOpenCoreHint(openCoreHint==='how'?null:'how')}>?</button>
                    </label>
                    {openCoreHint==='how' && (
                      <div className="absolute z-50 bg-[var(--secondary)] border-2 border-[var(--primary)] p-3 text-xs shadow-hard w-72 max-w-[90vw]">
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Primary conversion path (call, landing, in-store)</li>
                          <li>Key trust accelerators (trial, guarantee)</li>
                          <li>Follow-up loop (DM, email sequence)</li>
                        </ul>
                        <div className="mt-2 font-mono">Example: &quot;Short Loom &gt; 15-min qualifying call &gt; proposal same day&quot;</div>
                      </div>
                    )}
                    <textarea name="core_how" value={followupForm.core_how || ''} onChange={(e)=>setFollowupForm(p=>({...p, core_how:e.target.value}))} className="w-full p-3 border-2 border-[var(--primary)] focus:outline-none focus:border-[var(--accent2)] focus:text-[var(--primary)] resize-none" rows={2} placeholder="e.g. Free audit -> DM follow-up -> booking link" required />
                  </div>
                  {/* BUDGET */}
                  <div className="col-span-1 relative">
                    <label className="flex text-[var(--primary)] font-medium mb-2 items-center gap-2">Budget (monthly)
                      <button type="button" aria-label="Budget help" className="w-6 h-6 border-2 border-[var(--primary)] text-[var(--primary)] text-xs font-bold flex items-center justify-center" onClick={()=>setOpenCoreHint(openCoreHint==='budget'?null:'budget')}>?</button>
                    </label>
                    {openCoreHint==='budget' && (
                      <div className="absolute z-50 bg-[var(--secondary)] border-2 border-[var(--primary)] p-3 text-xs shadow-hard w-72 max-w-[90vw]">
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Give a range or exact number</li>
                          <li>Breakdown (ads / tools / printing)</li>
                          <li>If $0 say &quot;0 (sweat only)&quot;</li>
                        </ul>
                        <div className="mt-2 font-mono">Example: &quot;$120 (ads 80 / tools 40)&quot;</div>
                      </div>
                    )}
                    <textarea name="core_budget" value={followupForm.core_budget || ''} onChange={(e)=>setFollowupForm(p=>({...p, core_budget:e.target.value}))} className="w-full p-3 border-2 border-[var(--primary)] focus:outline-none focus:border-[var(--accent2)] focus:text-[var(--primary)] resize-none" rows={2} placeholder="e.g. 0 / 75 / 250 (ads vs tools)" />
                  </div>
                </div>

                {/* Annotated previous strategy paste */}
                <div className="mb-8">
                  <label className="text-[var(--primary)] font-bold mb-2 flex items-center gap-2">
                    PASTE YOUR PREVIOUS STRATEGY WITH PROGRESS MARKS
                    <span className="w-6 h-6 text-xs font-bold border-2 border-[var(--primary)] flex items-center justify-center cursor-default" title="Paste the exact strategy you executed. Keep original checklist lines. Mark each task: [x]/[X]/[✔]=done, [-]/[~]=partial, [ ]=not done. Add quick inline result notes e.g. (12 signups) so the follow-up can double-down or cut intelligently.">?</span>
                  </label>
                  <textarea
                    name="annotatedStrategy"
                    value={followupForm.annotatedStrategy || ''}
                    onChange={(e) => setFollowupForm(prev => ({ ...prev, annotatedStrategy: e.target.value }))}
                    className="w-full p-3 border-2 border-[var(--primary)] focus:outline-none focus:border-[var(--accent2)] focus:text-[var(--primary)] resize-y min-h-[240px] font-mono text-xs leading-snug"
                    placeholder={`Example:\n- [x] Day 1: Publish intro reel (850 views / 12 saves)\n- [-] Day 2: Send 5 cold emails (sent 3; no replies)\n- [ ] Day 3: Local flyer drop\n- [x] Day 4: Customer interview (pain: onboarding confusion)\n...`}
                    required
                  />
                </div>
                <div className={`gap-4 mb-6 ${
                  subscriptionStatus?.currentTier === 'pro' ? 'grid grid-cols-1 md:grid-cols-3' :
                  subscriptionStatus?.currentTier === 'starter' ? 'grid grid-cols-1 md:grid-cols-2' :
                  'grid grid-cols-1'
                }`}>
                  {followupQuestions.map((question: Question, index) => (
                    <div key={index} className={`mb-4 ${
                      subscriptionStatus?.currentTier === 'free' ? 'col-span-1' : ''
                    }`}>
                      <label className="block text-[var(--primary)] font-medium mb-2">
                        <span className="text-sm text-[var(--muted)] mr-2">{index + 1}.</span>
                        {question.label}
                        {question.bullets && (
                          <span className="relative inline-block ml-2 align-middle group">
                            <button
                              type="button"
                              className="inline-flex items-center justify-center w-7 h-7 border-2 border-[var(--primary)] text-[var(--primary)] font-bold text-xs cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[var(--accent2)]"
                              aria-label="More info"
                              onClick={() => setOpenHintIndex(openHintIndex === index ? null : index)}
                            >
                              ?
                            </button>
                            <span
                              className={`absolute z-50 ${openHintIndex === index ? 'block' : 'hidden'} md:group-hover:block bg-[var(--secondary)] border-2 border-[var(--primary)] p-3 shadow-hard w-72 max-w-[90vw] left-1/2 -translate-x-1/2 mt-2`}
                            >
                              <ul className="list-disc pl-5 text-sm text-[var(--primary)]">
                                {question.bullets?.map((b: string, i: number) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            </span>
                          </span>
                        )}
                      </label>
                      <textarea
                        name={question.name}
                        value={getFollowupValue(question.name)}
                        onChange={handleFollowupFormChange}
                        className="w-full p-3 border-2 border-[var(--primary)] focus:outline-none focus:border-[var(--accent2)] focus:text-[var(--primary)] resize-none"
                        rows={3}
                        placeholder={'Provide detailed information...'}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <div className="flex justify-end text-sm text-[var(--primary)] mb-2">
                    <span>{followupQuestions.length} questions</span>
                  </div>
                  <div className="w-full bg-[var(--secondary)] border-2 border-[var(--primary)] h-2">
                    <div className="bg-[var(--primary)] h-full transition-all duration-300" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="flex gap-4 justify-end">
                  <button type="button" onClick={() => setShowFollowupModal(false)} className="btn-square">Cancel</button>
                  <button type="submit" className="btn-square-accent px-8 py-3" data-umami-event="generate-followup-strategy-button">
                    Generate Follow-up Strategy ({strategyUsage.used}/{strategyUsage.limit})
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

       {/* Account Actions - Full Width Row Layout */}
          <div className="max-w-4xl mb-2 mx-auto grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
            {/* Plan Badge - Now Full Width Button */}
            <div className="w-full btn-square font-bold text-sm text-center">
              {subscriptionStatus.tierInfo?.name?.toUpperCase()} PLAN
            </div>

            <button
              className="w-full btn-square text-sm"
              onClick={() => router.push('/pricing')}
              data-umami-event="upgrade-plan-button"
            >
              Upgrade Plan
            </button>

            {subscriptionStatus?.hasPaidSubscription && (
              <button
                className="w-full btn-square text-sm"
                onClick={handleCancelSubscription}
                disabled={isCancellingSubscription}
                data-umami-event="cancel-subscription-button"
              >
                {isCancellingSubscription ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            )}

            <button
              className="w-full btn-square text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

      {/* Loading State for Strategy Generation */}
      {isGeneratingStrategy && (
        <div className="fixed inset-0 bg-[var(--primary)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--secondary)] border-4 border-[var(--primary)] shadow-hard p-8 text-center">
            <div className="flex gap-2 mb-6 justify-center">
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
            <p className="text-[var(--primary)] font-medium text-lg">
              Creating your personalized marketing strategy...
            </p>
            <p className="text-[var(--primary)] text-sm mt-2">
              This may take a moment
            </p>
          </div>
        </div>
      )}

      {isGeneratingFollowup && (
        <div className="fixed inset-0 bg-[var(--primary)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--secondary)] border-4 border-[var(--primary)] shadow-hard p-8 text-center">
            <div className="flex gap-2 mb-6 justify-center">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-4 h-4 bg-[var(--primary)] animate-pulse shadow-hard" style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1s' }} />
              ))}
            </div>
            <p className="text-[var(--primary)] font-medium text-lg">Creating your monthly follow-up strategy...</p>
            <p className="text-[var(--primary)] text-sm mt-2">This may take a moment</p>
          </div>
        </div>
      )}
    </div>
  );
}
