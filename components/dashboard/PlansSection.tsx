'use client'

import { useState } from 'react'
import { Zap, Star, Building2, Clock } from 'lucide-react'
import CurrencySelector from '@/components/CurrencySelector'
import { convertPrice, getPaystackAmount } from '@/lib/currency'

const plans = [
  { id: 'quick', icon: Zap, name: 'Quick Access', basePrice: 30, hours: 1 },
  { id: 'standard', icon: Star, name: 'Standard', basePrice: 60, hours: 3 },
  { id: 'business', icon: Building2, name: 'Business', basePrice: 150, hours: 24 },
]

interface PlansSectionProps {
  userId: string | null
  activeGrant: { expires_at: string } | null
}

export default function PlansSection({ userId, activeGrant }: PlansSectionProps) {
  const [currency, setCurrency] = useState('KES')

  const handlePaystack = (plan: typeof plans[0]) => {
    // @ts-ignore
    const handler = window.PaystackPop?.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: 'user@example.com',
      amount: getPaystackAmount(plan.basePrice, currency),
      currency: currency,
      ref: `cvpoa_${plan.id}_${Date.now()}`,
      metadata: { plan_id: plan.id, user_id: userId },
      callback: (response: { reference: string }) => {
        fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: response.reference, plan_id: plan.id }),
        }).then(async (res) => {
          if (!res.ok) {
            const err = await res.json()
            alert('Verification failed: ' + (err.error || 'Unknown error'))
          } else {
            window.location.reload()
          }
        })
      },
      onClose: () => {},
    })
    handler?.openIframe()
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-ink-400 uppercase tracking-wider">
          Get Access
        </h2>
        <CurrencySelector selected={currency} onChange={setCurrency} />
      </div>
      <div className="card p-6">
        <div className="flex items-start gap-3 mb-6">
          {activeGrant ? (
            <div className="w-8 h-8 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="w-4 h-4 text-green-400" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-ink-100">
              {activeGrant ? 'Active Access' : 'No active access'}
            </p>
            <p className="text-sm text-ink-400 mt-0.5">
              {activeGrant 
                ? `You have premium access until ${new Date(activeGrant.expires_at).toLocaleString()}`
                : 'Purchase a plan to generate CVs, cover letters, and AI reviews.'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <button
                key={plan.id}
                onClick={() => handlePaystack(plan)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] ${
                  plan.id === 'standard'
                    ? 'border-brand-500/60 bg-brand-500/5 hover:border-brand-500'
                    : 'border-ink-700 hover:border-ink-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-4 h-4 ${plan.id === 'standard' ? 'text-brand-400' : 'text-ink-400'}`} />
                  <span className="text-sm font-medium text-ink-100">{plan.name}</span>
                </div>
                <div className="font-display text-2xl font-bold text-ink-50">{convertPrice(plan.basePrice, currency)}</div>
                <div className="text-xs text-ink-500 mt-1">{plan.hours}h access</div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
