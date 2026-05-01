import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import Footer from '@/components/Footer'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24">
        <Link href="/" className="inline-flex items-center text-ink-400 hover:text-ink-200 transition-colors mb-8 text-sm">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink-50 mb-6">Privacy Policy</h1>
        <p className="text-ink-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-invert prose-brand max-w-none text-ink-300">
          <p>
            At CVPoa, a project by Starlet Technologies, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or use our services.
          </p>

          <h2 className="text-2xl font-semibold text-ink-100 mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you create an account, build a CV, or contact us for support. This may include your name, email address, phone number, employment history, education details, and any other information you choose to provide in your resume or cover letter.
          </p>

          <h2 className="text-2xl font-semibold text-ink-100 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Provide, maintain, and improve our services (including generating AI-powered CVs and cover letters).</li>
            <li>Process your transactions and send you related information.</li>
            <li>Send you technical notices, updates, security alerts, and support messages.</li>
            <li>Respond to your comments, questions, and requests.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-ink-100 mt-8 mb-4">3. Data Security & Third Parties</h2>
          <p>
            We implement reasonable security measures to protect the security of your personal information. We do not sell your personal data. We only share data with trusted third-party services (like our payment processors and AI providers) strictly to provide the core functionality of CVPoa.
          </p>

          <h2 className="text-2xl font-semibold text-ink-100 mt-8 mb-4">4. Contact Us</h2>
          <p>
            For more information about our privacy practices, or if you have questions, please contact us by email at support@starlettechnologies.com.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
