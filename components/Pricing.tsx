'use client'

import { useState } from 'react'
import { Check, Zap, Star, Building2 } from 'lucide-react'
import CurrencySelector from './CurrencySelector'
import { convertPrice, getPaystackAmount } from '@/lib/currency'

const plans = [
  {
    id: 'quick',
    icon: Zap,
    name: 'Quick Access',
    basePrice: 30,
    usd: '~$0.25',
    duration: '1 hour',
    description: 'Perfect for one urgent application closing today.',
    features: [
      'Unlimited CVs & Cover Letters',
      'PDF & Word download',
      'Job description analyzer',
      'ATS keyword optimization',
    ],
    popular: false,
  },
  {
    id: 'standard',
    icon: Star,
    name: 'Standard',
    basePrice: 60,
    usd: '~$0.50',
    duration: '3 hours',
    description: '3x the time. Apply to multiple jobs, get AI review.',
    features: [
      'Everything in Quick Access',
      'AI Review & HR-level feedback',
      '3 hours unlimited access',
      'Priority support via WhatsApp',
    ],
    popular: true,
  },
  {
    id: 'business',
    icon: Building2,
    name: 'Business',
    basePrice: 150,
    usd: '~$1.15',
    duration: '24 hours',
    description: 'For CV writers, agencies, and cyber cafés.',
    features: [
      'Create unlimited CVs for clients',
      'Controlled formatting options',
      'Duplicate & edit resumes fast',
      'ATS-safe flexible output',
    ],
    popular: false,
  },
]

export default function Pricing() {
  const [currency, setCurrency] = useState('KES')

  const handlePaystack = (plan: typeof plans[0]) => {
    // @ts-ignore - Paystack loaded via script tag
    const handler = window.PaystackPop?.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: 'user@example.com', // replace with actual user email from auth
      amount: getPaystackAmount(plan.basePrice, currency),
      currency: currency,
      ref: `cvpoa_${plan.id}_${Date.now()}`,
      metadata: {
        plan_id: plan.id,
        duration: plan.duration,
      },
      callback: (response: { reference: string }) => {
        // Verify payment on backend and grant access
        fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: response.reference,
            plan_id: plan.id,
          }),
        }).then(() => {
          window.location.href = '/dashboard'
        })
      },
      onClose: () => {
        console.log('Payment closed')
      },
    })
    handler?.openIframe()
  }

  return (
    <section id="pricing" className="py-24 border-t border-ink-800/40">
      {/* Paystack JS */}
      <script async src="https://js.paystack.co/v1/inline.js" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="section-tag">Pricing</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 leading-tight">
              Pay only when{' '}
              <span className="gradient-text">you need it.</span>
            </h2>
            <p className="mt-4 text-ink-300 text-lg">
              No monthly subscriptions. Buy access when you need it. Pay via Mobile Money or card.
            </p>
          </div>
          <CurrencySelector selected={currency} onChange={setCurrency} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            const displayPrice = convertPrice(plan.basePrice, currency)
            return (
              <div
                key={plan.id}
                className={`relative card p-6 flex flex-col ${
                  plan.popular
                    ? 'border-brand-500/60 bg-brand-500/5'
                    : 'border-ink-800/60'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-500 text-ink-950 text-xs font-mono font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    plan.popular ? 'bg-brand-500/20 border border-brand-500/40' : 'bg-ink-800 border border-ink-700'
                  }`}>
                    <Icon className={`w-5 h-5 ${plan.popular ? 'text-brand-400' : 'text-ink-400'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-100">{plan.name}</p>
                    <p className="text-xs text-ink-500">{plan.duration}</p>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="font-display text-4xl font-bold text-ink-50">{displayPrice}</span>
                  {currency === 'KES' && <span className="text-ink-500 text-sm ml-2">{plan.usd}</span>}
                </div>
                <p className="text-ink-400 text-sm mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'text-brand-400' : 'text-ink-500'
                      }`} />
                      <span className="text-ink-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePaystack(plan)}
                  className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                    plan.popular
                      ? 'bg-brand-500 hover:bg-brand-400 text-ink-950'
                      : 'border border-ink-700 hover:border-brand-500/60 text-ink-100 hover:text-brand-400'
                  }`}
                >
                  Get Access — {displayPrice}
                </button>
              </div>
            )
          })}
        </div>

        {/* Payment methods */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-ink-500 text-xs">Secure payments via Paystack</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {['M-Pesa', 'Mobile Money', 'Card', 'Bank Transfer'].map((method) => (
              <span
                key={method}
                className="text-xs font-mono text-ink-400 bg-ink-900/60 border border-ink-800 px-3 py-1.5 rounded-md"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
