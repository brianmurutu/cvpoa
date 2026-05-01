import Link from 'next/link'
import { Mail, MapPin, Phone, ChevronLeft } from 'lucide-react'
import Footer from '@/components/Footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-24">
        <Link href="/" className="inline-flex items-center text-ink-400 hover:text-ink-200 transition-colors mb-8 text-sm">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink-50 mb-4">Contact Us</h1>
        <p className="text-ink-400 text-lg mb-12">
          Have a question about CVPoa or need support with your account? We're here to help.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-semibold text-ink-100 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="font-medium text-ink-200">Email</p>
                  <a href="mailto:support@starlettechnologies.com" className="text-brand-400 hover:underline">
                    support@starlettechnologies.com
                  </a>
                  <p className="text-sm text-ink-500 mt-1">We aim to reply within 24 hours.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="font-medium text-ink-200">Office</p>
                  <p className="text-ink-400">Nairobi, Kenya</p>
                  <p className="text-sm text-ink-500 mt-1">A Starlet Technologies Project</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form placeholder */}
          <div className="card p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-ink-100 mb-6">Send a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="label">Your Name</label>
                <input type="text" className="input" placeholder="John Doe" required />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="input min-h-[120px] py-3" placeholder="How can we help?" required></textarea>
              </div>
              <button type="submit" className="btn-primary w-full justify-center">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
