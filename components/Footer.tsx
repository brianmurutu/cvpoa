import Link from 'next/link'
import { FileText } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-ink-800/40 py-12 px-4 sm:px-6 bg-ink-950">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
                <FileText className="w-3 h-3 text-ink-950" />
              </div>
              <span className="font-display font-bold text-ink-300">
                CV<span className="text-brand-400">Poa</span>
              </span>
            </Link>
            <p className="text-sm text-ink-400 max-w-sm leading-relaxed mb-4">
              Land your dream job with an AI-powered CV and tailored cover letters. Built for the modern job seeker.
            </p>
            <p className="text-sm text-ink-500">
              A <a href="https://starlettechnologies.com" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">Starlet Technologies</a> Project.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-ink-100 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-ink-400">
              <li><Link href="/#features" className="hover:text-brand-400 transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-brand-400 transition-colors">Pricing</Link></li>
              <li><Link href="/login" className="hover:text-brand-400 transition-colors">Login</Link></li>
              <li><Link href="/signup" className="hover:text-brand-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink-100 mb-4">Legal & Support</h4>
            <ul className="space-y-2 text-sm text-ink-400">
              <li><Link href="/contact" className="hover:text-brand-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-ink-800/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-600">
            © {new Date().getFullYear()} CVPoa. Made in Nairobi 🇰🇪
          </p>
        </div>
      </div>
    </footer>
  )
}
