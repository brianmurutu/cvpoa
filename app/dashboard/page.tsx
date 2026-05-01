'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FileText, Plus, Clock, Zap, Star, Building2,
  LogOut, ChevronRight, FileCheck, Mail, Target, BarChart3,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const quickLinks = [
  { href: '/builder', icon: Plus, label: 'Build a New CV', color: 'text-brand-400' },
  { href: '/cover-letter', icon: Mail, label: 'Write a Cover Letter', color: 'text-blue-400' },
  { href: '/analyzer', icon: Target, label: 'Analyze a Job Description', color: 'text-purple-400' },
  { href: '/review', icon: BarChart3, label: 'Review My CV', color: 'text-yellow-400' },
]

const plans = [
  { id: 'quick', icon: Zap, name: 'Quick Access', price: 'KES 30', hours: 1 },
  { id: 'standard', icon: Star, name: 'Standard', price: 'KES 60', hours: 3 },
  { id: 'business', icon: Building2, name: 'Business', price: 'KES 150', hours: 24 },
]

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handlePaystack = (plan: typeof plans[0]) => {
    // @ts-ignore
    const handler = window.PaystackPop?.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: 'user@example.com',
      amount: plan.hours === 1 ? 3000 : plan.hours === 3 ? 6000 : 15000,
      currency: 'KES',
      ref: `cvpoa_${plan.id}_${Date.now()}`,
      metadata: { plan_id: plan.id },
      callback: (response: { reference: string }) => {
        fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: response.reference, plan_id: plan.id }),
        }).then(() => router.refresh())
      },
      onClose: () => {},
    })
    handler?.openIframe()
  }

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Paystack */}
      <script async src="https://js.paystack.co/v1/inline.js" />

      {/* Header */}
      <header className="border-b border-ink-800/40 bg-ink-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-ink-950" />
            </div>
            <span className="font-display font-bold text-ink-50">
              CV<span className="text-brand-400">Poa</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/builder" className="btn-primary text-sm py-2 px-4">
              <Plus className="w-4 h-4" />
              New CV
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="btn-ghost text-sm text-ink-500"
            >
              <LogOut className="w-4 h-4" />
              {loggingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-ink-50">Dashboard</h1>
          <p className="text-ink-400 mt-1">Manage your CVs and access CV tools below.</p>
        </div>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-ink-400 uppercase tracking-wider mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="card p-5 flex items-center gap-4 hover:border-ink-700 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-5 h-5 ${link.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-100 truncate">{link.label}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-600 group-hover:text-ink-400 transition-colors" />
                </Link>
              )
            })}
          </div>
        </section>

        {/* Access Plans */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-ink-400 uppercase tracking-wider mb-4">
            Get Access
          </h2>
          <div className="card p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-8 h-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <p className="font-medium text-ink-100">No active access</p>
                <p className="text-sm text-ink-400 mt-0.5">
                  Purchase a plan to generate CVs, cover letters, and AI reviews.
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
                    <div className="font-display text-2xl font-bold text-ink-50">{plan.price}</div>
                    <div className="text-xs text-ink-500 mt-1">{plan.hours}h access</div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Saved CVs placeholder */}
        <section>
          <h2 className="text-sm font-semibold text-ink-400 uppercase tracking-wider mb-4">Your CVs</h2>
          <div className="card p-10 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-ink-800 rounded-xl flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5 text-ink-600" />
            </div>
            <p className="text-ink-400 text-sm mb-1">No CVs yet</p>
            <p className="text-ink-600 text-xs mb-4">Build your first CV to see it here</p>
            <Link href="/builder" className="btn-primary text-sm py-2 px-5">
              <Plus className="w-4 h-4" />
              Build My First CV
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
