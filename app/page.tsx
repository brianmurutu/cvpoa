import Link from 'next/link'
import { FileText, Zap, Target, Star, Shield, Download, ChevronRight, CheckCircle2 } from 'lucide-react'
import Pricing from '@/components/Pricing'

const features = [
  {
    icon: Zap,
    title: '4-Step Resume Builder',
    desc: 'Fill in your details and our AI crafts a professional, ATS-optimized CV in seconds.',
  },
  {
    icon: Target,
    title: 'ATS Keyword Optimizer',
    desc: 'Paste a job description and instantly see which keywords you\'re missing.',
  },
  {
    icon: FileText,
    title: 'Cover Letter Generator',
    desc: 'Get a tailored, compelling cover letter for every application in under 60 seconds.',
  },
  {
    icon: Star,
    title: 'AI CV Review & Scoring',
    desc: 'Get an HR-level review with an ATS score, strengths, and specific improvements.',
  },
  {
    icon: Download,
    title: 'PDF & Word Export',
    desc: 'Download your CV in both PDF and .docx formats, ready to send.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your data is yours. Encrypted, stored securely, and never shared.',
  },
]

const stats = [
  { value: '10k+', label: 'CVs Generated' },
  { value: '94%', label: 'ATS Pass Rate' },
  { value: 'KES 30', label: 'Starting Price' },
  { value: '< 60s', label: 'Generation Time' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-ink-800/40 bg-ink-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/30">
              <FileText className="w-4 h-4 text-ink-950" />
            </div>
            <span className="font-display font-bold text-lg text-ink-50">
              CV<span className="text-brand-400">Poa</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-sm text-ink-400">
            <Link href="#features" className="hover:text-ink-100 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-ink-100 transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4 sm:px-6">
        {/* Background glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-500/5 rounded-full blur-3xl" />
          <div className="absolute top-20 -right-20 w-72 h-72 bg-brand-500/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 section-tag mb-6">
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
            Built for East Africa 🇰🇪
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
            Land your dream job with{' '}
            <span className="gradient-text">an AI-powered CV</span>
          </h1>

          <p className="text-xl text-ink-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create ATS-optimized resumes and cover letters in minutes.
            Pay via M-Pesa, Airtel Money, or card. Starting at just <strong className="text-ink-200">KES 30</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/signup" className="btn-primary text-base py-3.5 px-8 glow">
              Build My CV — Free to Try
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="#features" className="btn-secondary text-base py-3.5 px-8">
              See How It Works
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl font-bold text-brand-400">{s.value}</div>
                <div className="text-xs text-ink-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 border-t border-ink-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="section-tag">Features</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 leading-tight">
              Everything you need to{' '}
              <span className="gradient-text">get hired faster.</span>
            </h2>
            <p className="mt-4 text-ink-400 text-lg">
              From building your CV to tailoring it for each job — we handle it all with AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="card p-6 hover:border-brand-500/30 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <h3 className="font-semibold text-ink-100 mb-2">{f.title}</h3>
                  <p className="text-sm text-ink-400 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 sm:px-6 border-t border-ink-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="section-tag">How It Works</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 leading-tight">
              Your CV in <span className="gradient-text">4 simple steps.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your free account in seconds.' },
              { step: '02', title: 'Fill Your Details', desc: 'Enter your experience, skills, and target role.' },
              { step: '03', title: 'Pay & Generate', desc: 'Pay via M-Pesa for as little as KES 30 and let AI do the work.' },
              { step: '04', title: 'Download & Apply', desc: 'Get your polished CV in PDF or Word format.' },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="font-mono text-5xl font-bold text-ink-800 mb-4">{s.step}</div>
                <h3 className="font-semibold text-ink-100 mb-2">{s.title}</h3>
                <p className="text-sm text-ink-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 px-4 sm:px-6 border-t border-ink-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="card p-8 sm:p-12 bg-gradient-to-br from-brand-500/5 to-transparent border-brand-500/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="section-tag">All Plans Include</span>
                <h2 className="font-display text-3xl font-bold mt-4 mb-6">
                  Everything you need to{' '}
                  <span className="gradient-text">stand out</span>
                </h2>
                <ul className="space-y-3">
                  {[
                    'Unlimited CV & cover letter generation',
                    'ATS keyword optimization',
                    'PDF & Word (.docx) download',
                    'Job description analyzer',
                    'AI HR-level review & scoring',
                    'Save & manage multiple CVs',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-ink-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center lg:text-right">
                <p className="text-ink-400 text-sm mb-2">Starting from</p>
                <div className="font-display text-6xl font-bold text-brand-400">KES 30</div>
                <p className="text-ink-500 text-sm mt-1">for 1 hour of unlimited access</p>
                <Link href="/signup" className="btn-primary mt-6 inline-flex">
                  Get Started Now
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <Pricing />

      {/* Footer */}
      <footer className="border-t border-ink-800/40 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
              <FileText className="w-3 h-3 text-ink-950" />
            </div>
            <span className="font-display font-bold text-ink-300">
              CV<span className="text-brand-400">Poa</span>
            </span>
          </Link>
          <p className="text-xs text-ink-600">
            © {new Date().getFullYear()} CVPoa. Made in Nairobi 🇰🇪
          </p>
          <div className="flex gap-5 text-xs text-ink-600">
            <Link href="/login" className="hover:text-ink-400 transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-ink-400 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
