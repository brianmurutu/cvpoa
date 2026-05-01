import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24">
        <Link href="/" className="inline-flex items-center text-ink-400 hover:text-ink-200 transition-colors mb-8 text-sm">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink-50 mb-6">Terms of Service</h1>
        <p className="text-ink-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-invert prose-brand max-w-none text-ink-300">
          <p>
            Welcome to CVPoa, a service provided by Starlet Technologies. By accessing or using our website and services, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-2xl font-semibold text-ink-100 mt-8 mb-4">1. Description of Service</h2>
          <p>
            CVPoa provides AI-powered tools for generating resumes, cover letters, and analyzing job descriptions. The service is provided on a paid, time-based access model or subscription basis.
          </p>

          <h2 className="text-2xl font-semibold text-ink-100 mt-8 mb-4">2. User Accounts</h2>
          <p>
            You must provide accurate and complete information when creating an account. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>

          <h2 className="text-2xl font-semibold text-ink-100 mt-8 mb-4">3. Payments and Refunds</h2>
          <p>
            Access to certain features requires payment. Payments are processed securely via third-party providers (e.g., Paystack). Due to the digital and immediate nature of the service, all payments are final and non-refundable unless otherwise required by law.
          </p>

          <h2 className="text-2xl font-semibold text-ink-100 mt-8 mb-4">4. Intellectual Property</h2>
          <p>
            The service, including its original content, features, and functionality, are and will remain the exclusive property of Starlet Technologies and its licensors. You retain ownership of the personal data you provide, and the generated resumes/cover letters are licensed to you for your personal career advancement.
          </p>

          <h2 className="text-2xl font-semibold text-ink-100 mt-8 mb-4">5. Limitation of Liability</h2>
          <p>
            In no event shall Starlet Technologies, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.
          </p>

          <h2 className="text-2xl font-semibold text-ink-100 mt-8 mb-4">6. Changes</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
