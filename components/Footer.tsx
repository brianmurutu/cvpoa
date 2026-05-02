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
          <a 
            href="https://wa.me/+254792710951" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 rounded-full text-xs font-medium animate-pulse hover:animate-none border border-[#25D366]/20"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Contact Developer
          </a>
        </div>
      </div>
    </footer>
  )
}
