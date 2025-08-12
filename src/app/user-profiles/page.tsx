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
  const user = useUser();
  const router = useRouter();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [isCancellingSubscription, setIsCancellingSubscription] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [strategyUsage, setStrategyUsage] = useState({ used: 0, limit: 0 });
  const [openHintIndex, setOpenHintIndex] = useState<number | null>(null);
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

  // Four Core Questions with guidance bullets for info bubble
const coreQuestions: Question[] = [
{
label: 'Who are you trying to help (and who should you ignore)?',
name: 'who',
bullets: [
'What keeps them up at 3 AM',
'Where they hang out and how they decide',
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
'Tangible results they’ll feel after buying',
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
'Remove friction (speed, clarity, trust)',
'Measure and improve (one metric per step)',
],
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

  const canCreateStrategy = () => {
    return strategyUsage.used < strategyUsage.limit;
  };

  const getButtonText = () => {
    if (subscriptionStatus?.currentTier === 'free') {
      return strategyUsage.used >= strategyUsage.limit ? 'Monthly Limit Reached' : 'Create New Strategy';
    }
    return `Create New Strategy (${strategyUsage.used}/${strategyUsage.limit} used)`;
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
        <div className="text-center">
          {/* Buttons Container */}
          <div className="mb-8">
            {subscriptionStatus.currentTier !== 'free' ? (
              /* Paid Users: Two buttons side by side */
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {/* Create New Strategy Button */}
                <div className="text-center">
                  <button
                    className={`btn-square-accent text-xl px-8 py-4 ${
                      !canCreateStrategy() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => setShowStrategyModal(true)}
                    disabled={!canCreateStrategy()}
                    data-umami-event="create-strategy-button"
                  >
                    {getButtonText()}
                  </button>
                  <p className="text-black mt-2 text-sm">
                    Resets monthly • All strategies saved to your account
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
              /* Free Users: Single button centered */
              <div className="text-center">
                <button
                  className={`btn-square-accent text-xl px-8 py-4 ${
                    !canCreateStrategy() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => setShowStrategyModal(true)}
                  disabled={!canCreateStrategy()}
                  data-umami-event="create-strategy-button-free-tier"
                >
                  {getButtonText()}
                </button>
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
          <div className={`bg-white border-4 border-black shadow-hard w-full max-h-[90vh] overflow-y-auto ${
            subscriptionStatus?.currentTier === 'pro' ? 'max-w-6xl' :
            subscriptionStatus?.currentTier === 'starter' ? 'max-w-5xl' : 'max-w-3xl'
          }`}>
            <div className="p-6">
              {/* Header with tier-specific styling */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className={`font-bold text-black mb-2 ${
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
                  className="text-black hover:bg-gray-100 p-2 font-bold text-xl"
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
                              className={`absolute z-50 ${openHintIndex === index ? 'block' : 'hidden'} md:group-hover:block bg-white border-2 border-black p-3 shadow-hard w-72 max-w-[90vw] left-1/2 -translate-x-1/2 mt-2`}
                            >
                              <ul className="list-disc pl-5 text-sm text-black">
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
                  <div className="flex justify-end text-sm text-gray-600 mb-2">
                    <span>{getCurrentQuestions().length} questions</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 border border-black">
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
          <div className="bg-white border-4 border-[var(--primary)] shadow-hard p-8 text-center">
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
    </div>
  );
}
