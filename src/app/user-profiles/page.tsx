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
  const user = useUser();
  const router = useRouter();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [isCancellingSubscription, setIsCancellingSubscription] = useState(false);
  const [strategyUsage, setStrategyUsage] = useState({ used: 0, limit: 0 });
  const [strategyForm, setStrategyForm] = useState({
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

  const questions = [
    // The Basics About Your Business
    { label: "What problem does your product solve for customers?", name: "problem" },
    { label: "What's your product/service in simple terms?", name: "productSimple" },
    { label: "Are you B2B (selling to businesses) or B2C (selling to consumers)?", name: "b2bOrB2c" },
    // Where You Stand
    { label: "Is this a new launch or existing product?", name: "launchOrExisting" },
    { label: "What's your monthly revenue range (if any)?", name: "revenueRange" },
    { label: "How many customers do you currently have?", name: "customerCount" },
    // Your Customers
    { label: "Who is your ideal customer?", name: "idealCustomer" },
    { label: "What industry/type of business do they run?", name: "customerIndustry" },
    { label: "How big are these companies (employees/revenue)?", name: "companySize" },
    { label: "What's their biggest challenge that you solve?", name: "customerChallenge" },
    { label: "How do they currently handle this problem without you?", name: "currentSolution" },
    // Your Goals
    { label: "What do you want to achieve in the next 6 months?", name: "goal6mo" },
    { label: "Is it more customers, higher revenue, or brand awareness?", name: "goalType" },
    { label: "What would make you feel this marketing effort was worth it?", name: "successCriteria" },
    // Your Resources
    { label: "What's your monthly marketing budget?", name: "marketingBudget" },
    { label: "How much time can you personally dedicate to marketing?", name: "marketingTime" },
    { label: "Do you have any marketing materials already (logo, website, etc.)?", name: "marketingMaterials" },
    // Competition & Market
    { label: "Who are your main competitors?", name: "competitors" },
    { label: "What makes you different from them?", name: "differentiation" },
    { label: "How do customers currently find solutions like yours?", name: "discovery" },
  ];

  // Free Tier Questions (Minimal - 3 questions)
  const freeQuestions = [
    { label: "What problem does your product solve for customers?", name: "problem" },
    { label: "Who is your ideal customer?", name: "idealCustomer" },
    { label: "What's your monthly marketing budget?", name: "marketingBudget" },
  ];

  // Starter Tier Questions (Essential - 7 questions)
  const starterQuestions = [
    { label: "What problem does your product solve for customers?", name: "problem" },
    { label: "What's your product/service in simple terms?", name: "productSimple" },
    { label: "Who is your ideal customer?", name: "idealCustomer" },
    { label: "What do you want to achieve in the next 6 months?", name: "goal6mo" },
    { label: "What's your monthly marketing budget?", name: "marketingBudget" },
    { label: "Who are your main competitors?", name: "competitors" },
    { label: "What makes you different from them?", name: "differentiation" },
  ];

  // Pro Tier Questions (Full - 20 questions)
  const proQuestions = questions; // Use the full comprehensive set

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
    if (!subscriptionStatus) return 'Answer a few questions to get started';

    switch (subscriptionStatus.currentTier) {
      case 'free':
        return 'Answer 3 essential questions to get your basic strategy';
      case 'starter':
        return 'Answer 7 detailed questions for an enhanced strategy';
      case 'pro':
        return 'Answer 20 comprehensive questions for a complete strategy analysis';
      default:
        return 'Answer a few questions to get started';
    }
  };

  const getTierLabel = () => {
    if (!subscriptionStatus) return 'TEST TIER';
    return `${subscriptionStatus.currentTier?.toUpperCase()} TIER`;
  };

  const handleLogout = async () => {
    try {
      // Stack Auth logout - redirect to sign out handler
      window.location.href = '/handler/sign-out';
    } catch (error) {
      console.error('Logout error:', error);
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
        await fetch('/api/strategy-usage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?.id,
            problem: strategyForm.problem,
            strategy: data.strategy
          })
        });

        // Refresh usage data
        const usageRes = await fetch(`/api/strategy-usage?userId=${user?.id}`);
        const usageData = await usageRes.json();
        if (usageRes.ok) {
          setStrategyUsage(usageData);
        }

        // Strategy generated successfully - redirect to chat room
        const params = new URLSearchParams({
          strategy: data.strategy,
          formData: JSON.stringify(strategyForm)
        });

        router.push(`/chat-rooms/general-help?${params.toString()}`);
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
    const fetchStrategyUsage = async () => {
      try {
        const res = await fetch(`/api/strategy-usage?userId=${user?.id}`);
        const data = await res.json();
        if (res.ok) {
          setStrategyUsage(data);
        }
      } catch (error) {
        console.error('Error fetching strategy usage:', error);
      }
    };

    async function fetchSubscriptionStatus() {
      if (!user || !user.id) {
        router.push('/');
        return;
      }

      try {
        const res = await fetch(`/api/subscription-status?userId=${user.id}`);
        const data = await res.json();

        if (res.ok && data.subscriptionStatus) {
          setSubscriptionStatus(data.subscriptionStatus);
          // Fetch strategy usage once we have subscription status
          await fetchStrategyUsage();
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

    fetchSubscriptionStatus();
  }, [user, router]);



  if (loading) {
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
          <p className="text-[var(--primary)] font-medium">Loading your profile...</p>
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
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4">
            Welcome Back!
          </h1>
          <p className="text-xl text-[var(--primary)] mb-4">
            {user?.displayName || user?.primaryEmail}
          </p>
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="px-4 py-2 bg-[var(--primary)] text-white font-bold text-lg shadow-hard">
              {subscriptionStatus.tierInfo?.name?.toUpperCase()}
            <span className="text-[var(--secondary)] font-bold"> Plan </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="btn-square-accent"
              onClick={() => router.push('/pricing')}
            >
              Upgrade Plan
            </button>
            {subscriptionStatus?.hasPaidSubscription && (
              <button
                className="btn-square bg-[var(--primary)] hover:bg-[var(--primary)] border-[var(--primary)] text-[var(--secondary)] disabled:opacity-50"
                onClick={handleCancelSubscription}
                disabled={isCancellingSubscription}
              >
                {isCancellingSubscription ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            )}
            <button
              className="btn-square text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tier Features Card */}
        {subscriptionStatus.tierInfo && (
          <div className="card-square p-8 mb-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--secondary)] mb-6 text-center">Your Plan Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-[var(--secondary)] font-medium mb-2">Monthly Strategies</p>
                <div className="text-4xl font-bold text-[var(--secondary)] mb-2">
                  {subscriptionStatus.tierInfo.monthlyStrategies === 75 ? '75' : subscriptionStatus.tierInfo.monthlyStrategies}
                </div>
                <div className="w-full h-2 bg-[var(--secondary)]"></div>
              </div>
              <div className="text-center">
                <p className="text-[var(--secondary)] font-medium mb-2">Data Storage</p>
                <div className="text-4xl font-bold text-[var(--secondary)] mb-2">
                  {subscriptionStatus.tierInfo.canSaveData ? 'UNLIMITED' : 'NONE'}
                </div>
                <div className="w-full h-2 bg-[var(--secondary)]"></div>
              </div>
              <div className="text-center">
                <p className="text-[var(--secondary)] font-medium mb-2">Support Level</p>
                <div className="text-4xl font-bold text-[var(--secondary)] mb-2 uppercase">
                  {subscriptionStatus.tierInfo.supportLevel}
                </div>
                <div className="w-full h-2 bg-[var(--secondary)]"></div>
              </div>
            </div>
          </div>
        )}

        {/* Access Areas */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--primary)] mb-6 text-center">New Strategy ?</h2>
            {/* Create New Strategy Button */}
            <div className="mb-8">
              <button
                className={`btn-square-accent text-xl px-8 py-4 ${
                  !canCreateStrategy() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => setShowStrategyModal(true)}
                disabled={!canCreateStrategy()}
              >
                {getButtonText()}
              </button>
              {subscriptionStatus.currentTier !== 'free' && (
                <p className="text-black mt-2 text-sm">
                  Resets monthly • All strategies saved to your account
                </p>
              )}
            </div>

            {/* View All Strategies Button for Paid Users */}
            {subscriptionStatus.currentTier !== 'free' && (
              <div className="mb-8">
                <button
                  className="btn-square text-lg px-6 py-3"
                  onClick={() => router.push('/user-profiles/strategies')}
                >
                  View All My Strategies
                </button>
                <p className="text-black mt-2 text-sm">
                  Access your complete strategy library
                </p>
              </div>
            )}
          </div>

        {/* Upgrade Prompt for Free/Starter Users */}
        {subscriptionStatus.currentTier !== 'pro' && (
          <div className="card-square p-8 mt-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[var(--secondary)] mb-4">
                Unlock More Features
              </h3>
              <p className="text-[var(--secondary)] mb-6">
                Upgrade to access more areas, advanced strategies, and priority support.
              </p>
              <button
                className="btn-square-accent text-xl px-8 py-4"
                onClick={() => router.push('/pricing')}
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
                  {getCurrentQuestions().map((question, index) => (
                    <div key={index} className={`mb-4 ${
                      subscriptionStatus?.currentTier === 'free' ? 'col-span-1' : ''
                    }`}>
                      <label className="block text-[var(--primary)] font-medium mb-2">
                        <span className="text-sm text-[var(--muted)] mr-2">
                          {index + 1}.
                        </span>
                        {question.label}
                      </label>
                      <textarea
                        name={question.name}
                        value={strategyForm[question.name as keyof typeof strategyForm]}
                        onChange={handleStrategyFormChange}
                        className="w-full p-3 border-2 border-[var(--primary)] focus:outline-none focus:border-[var(--accent2)] resize-none"
                        rows={subscriptionStatus?.currentTier === 'pro' ? 3 : 2}
                        placeholder={
                          subscriptionStatus?.currentTier === 'pro' ? 'Provide detailed information...' :
                          subscriptionStatus?.currentTier === 'starter' ? 'Your answer...' : 'Brief answer...'
                        }
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
                  >
                    Generate Strategy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
