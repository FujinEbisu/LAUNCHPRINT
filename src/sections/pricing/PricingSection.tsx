// components/pricing/PricingSection.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { Check, Zap } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { useUser } from '@stackframe/stack'

interface PricingSectionProps {
  customerId?: string
  userId?: string
}

interface StripeProduct {
  id: string;
  name: string;
  description: string;
  metadata: {
    [key: string]: string | undefined;
  };
  marketing_features?: Array<string | { name: string }>;
}

interface StripePrice {
  id: string;
  unit_amount: number;
  recurring?: {
    interval: string;
  };
  product: StripeProduct;
}

export function PricingSection({ userId }: PricingSectionProps) {
  const user = useUser()
  const [isAnnual, setIsAnnual] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [pricingPlans, setPricingPlans] = useState([
    {
      key: 'free',
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      monthlyPriceId: undefined,
      yearlyPriceId: undefined,
      description: 'Perfect for getting started',
      features: [
        '1 marketing strategy per month',
        'Basic templates',
        'Email support',
        'Community access'
      ] as Array<string | { name: string }>,
      popular: false,
      buttonText: 'Current Plan',
      disabled: true
    }
  ])

  useEffect(() => {
    fetch('/api/prices')
      .then(res => res.json())
      .then((data: any[]) => {
        const plans = [
          {
            key: 'free',
            name: 'Free',
            monthlyPrice: 0,
            yearlyPrice: 0,
            monthlyPriceId: undefined,
            yearlyPriceId: undefined,
            description: 'Perfect for getting started',
            features: [
              '1 marketing strategy per month',
              'Basic templates',
              'Email support',
              'Community access'
            ] as Array<string | { name: string }>,
            popular: false,
            buttonText: 'Current Plan',
            disabled: true
          },
          ...data.map((item) => ({
            key: item.product.metadata.key || item.product.id,
            name: item.product.name,
            monthlyPrice: item.monthlyPrice ? item.monthlyPrice.unit_amount / 100 : 0,
            yearlyPrice: item.yearlyPrice ? item.yearlyPrice.unit_amount / 100 : 0,
            monthlyPriceId: item.monthlyPrice ? item.monthlyPrice.id : undefined,
            yearlyPriceId: item.yearlyPrice ? item.yearlyPrice.id : undefined,
            description: item.product.description,
            features: Array.isArray(item.product.marketing_features)
              ? item.product.marketing_features.map((f: string | { name: string }) => typeof f === 'string' ? f : f.name)
              : [],
            popular: item.product.metadata.popular === 'true',
            buttonText: item.product.metadata.buttonText || 'Choose Plan',
            disabled: false
          }))
        ]
        setPricingPlans(plans)
      })
  }, [])

  const handleSubscriptionCheckout = async (planKey: string, priceId?: string) => {
    try {
      setLoadingPlan(planKey)
      let tier: string
      if (planKey === 'starter' || planKey.includes('starter')) {
        tier = 'starter'
      } else if (planKey === 'pro' || planKey.includes('pro')) {
        tier = 'pro'
      } else {
        throw new Error('Invalid plan selected')
      }
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          userId,
          priceId,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }
      const { sessionId, url } = await response.json()
      if (url) {
        window.location.href = url
      } else {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        if (!stripe) {
          throw new Error('Failed to load Stripe')
        }
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          throw new Error(error.message)
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(error instanceof Error ? error.message : 'An error occurred during checkout')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => window.location.href = '/'}
            className="btn-square w-full max-w-xs text-lg py-3"
          >
            ← Back to Home
          </button>
        </div>

        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 bg-[var(--primary)] text-white px-4 py-2 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-5xl">
            Choose the right plan for you
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Start with our flexible plans. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center bg-gray-100 p-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-3 py-2 text-sm font-medium transition-all border-2 ${
                !isAnnual
                  ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-gray-700 hover:text-black border-transparent'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-3 py-2 text-sm font-medium transition-all border-2 ${
                isAnnual
                  ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-gray-700 hover:text-black border-transparent'
              }`}
            >
              Annual
              <span className="ml-1 text-xs text-green-600 font-semibold">
                Save up to 20%
              </span>
            </button>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan) => {
            const isPopular = plan.popular
            const price = isAnnual ? plan.yearlyPrice : plan.monthlyPrice
            const priceId = isAnnual ? plan.yearlyPriceId : plan.monthlyPriceId
            const originalPrice = isAnnual ? Math.round((plan.monthlyPrice || 0) * 12) : undefined
            const savings = isAnnual && plan.monthlyPrice && plan.yearlyPrice ? Math.round(plan.monthlyPrice * 12 - plan.yearlyPrice) : 0
            const actualUserId = userId || user?.id

            return (
              <div
                key={plan.key}
                className={`relative p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] xl:p-10 ${
                  isPopular
                    ? 'bg-black text-white'
                    : 'bg-white'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center bg-[var(--accent2)] text-white  px-4 py-1 text-sm font-medium border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <Zap className="mr-1 h-4 w-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    className={`text-lg font-semibold leading-8 ${
                      isPopular ? 'text-[var(--secondary)]' : 'text-[var(--primary)]'
                    }`}
                  >
                    {plan.name}
                  </h3>
                </div>

                <p
                  className={`mt-4 text-sm leading-6 ${
                    isPopular ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {plan.description}
                </p>

                <p className="mt-6 flex items-baseline gap-x-1">
                  <span
                    className={`text-4xl font-bold tracking-tight ${
                      isPopular ? 'text-white' : 'text-black'
                    }`}
                  >
                    {price === 0 ? 'Free' : `$${price}`}
                  </span>
                  {price > 0 && (
                    <span
                      className={`text-sm font-semibold leading-6 ${
                        isPopular ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  )}
                </p>

                {isAnnual && savings > 0 && (
                  <div className="mt-2 flex items-center gap-x-2">
                    <span className={`text-sm line-through ${
                      isPopular ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      ${originalPrice}/year
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      Save ${savings}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => {
                    if ((plan.monthlyPrice || plan.yearlyPrice) === 0) {
                      window.location.href = '/handler/sign-up'
                    } else if (actualUserId) {
                      handleSubscriptionCheckout(plan.key, priceId)
                    } else {
                      window.location.href = '/handler/sign-up'
                    }
                  }}
                  disabled={loadingPlan === plan.key || plan.disabled}
                  className={`btn-square w-full max-w-xs ${
                    isPopular ? 'btn-square-accent' : ''}`}
                >
                  {loadingPlan === plan.key ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    plan.buttonText
                  )}
                </button>

                <ul
                  role="list"
                  className={`mt-8 space-y-3 text-sm leading-6 ${
                    isPopular ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {plan.features.map((feature, idx) => (
                    <li key={typeof feature === 'string' ? feature + idx : (feature.name ? feature.name + idx : idx)} className="flex gap-x-3">
                      <Check
                        className={`h-6 w-5 flex-none ${
                          isPopular ? 'text-white' : 'text-black'
                        }`}
                        aria-hidden="true"
                      />
                      {typeof feature === 'string' ? feature : feature.name || JSON.stringify(feature)}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
