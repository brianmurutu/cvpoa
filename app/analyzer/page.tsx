'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, ArrowLeft, Loader2, Target, ChevronDown, ChevronUp } from 'lucide-react'

interface JDAnalysis {
  jobTitle: string
  hardSkills: string[]
  softSkills: string[]
  responsibilities: string[]
  qualifications: string[]
  keywords: string[]
  experienceLevel: string
  companyCulture: string
}

export default function AnalyzerPage() {
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<JDAnalysis | null>(null)
  const [error, setError] = useState('')
  const [showFull, setShowFull] = useState(false)

  const handleAnalyze = async () => {
    if (!jd.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Something went wrong')
      else setResult(data.analysis)
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <header className="border-b border-ink-800/40 bg-ink-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-ink-400 hover:text-ink-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-500 rounded-lg flex items-center justify-center">
              <FileText className="w-3 h-3 text-ink-950" />
            </div>
            <span className="font-display font-bold text-ink-50">CV<span className="text-brand-400">Poa</span></span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <span className="section-tag"><Target className="w-3 h-3" /> Analyzer</span>
          <h1 className="font-display text-3xl font-bold text-ink-50 mt-3">Job Description Analyzer</h1>
          <p className="mt-2 text-ink-400 max-w-xl">
            Paste a job description and instantly extract key skills, keywords, and requirements to tailor your CV.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <label className="label">Job Description *</label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                className="input min-h-[300px] resize-y"
                placeholder="Paste the full job description here..."
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !jd.trim()}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Target className="w-4 h-4" /> Analyze Job Description</>}
            </button>
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
            )}
          </div>

          <div>
            {!result && !loading && (
              <div className="card h-full flex flex-col items-center justify-center text-center p-10 min-h-[300px]">
                <Target className="w-10 h-10 text-ink-700 mb-4" />
                <p className="text-ink-500 text-sm">Analysis results will appear here.</p>
              </div>
            )}
            {loading && (
              <div className="card h-full flex flex-col items-center justify-center p-10 min-h-[300px]">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-3" />
                <p className="text-ink-400 text-sm">Analyzing job description...</p>
              </div>
            )}
            {result && (
              <div className="space-y-4 animate-in">
                <div className="card p-5">
                  <p className="text-xs text-ink-500 mb-1">Detected Role</p>
                  <p className="font-semibold text-ink-100">{result.jobTitle}</p>
                  <div className="flex gap-3 mt-2 flex-wrap">
                    <span className="section-tag">{result.experienceLevel}</span>
                    <span className="text-xs text-ink-400 italic">{result.companyCulture}</span>
                  </div>
                </div>

                <div className="card p-5">
                  <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">Top ATS Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((kw) => (
                      <span key={kw} className="text-xs px-2.5 py-1 rounded-md bg-brand-500/10 border border-brand-500/20 text-brand-300">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card p-5">
                  <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Hard Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {result.hardSkills.map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-ink-800 text-ink-300">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="card p-5">
                  <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Soft Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {result.softSkills.map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-ink-800 text-ink-300">{s}</span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowFull(!showFull)}
                  className="btn-ghost text-sm w-full justify-center"
                >
                  {showFull ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showFull ? 'Hide' : 'Show'} Responsibilities & Qualifications
                </button>

                {showFull && (
                  <div className="space-y-4 animate-in">
                    <div className="card p-5">
                      <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Responsibilities</p>
                      <ul className="space-y-2">
                        {result.responsibilities.map((r, i) => (
                          <li key={i} className="text-sm text-ink-300 flex gap-2">
                            <span className="text-ink-600 flex-shrink-0">•</span>{r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="card p-5">
                      <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Qualifications</p>
                      <ul className="space-y-2">
                        {result.qualifications.map((q, i) => (
                          <li key={i} className="text-sm text-ink-300 flex gap-2">
                            <span className="text-ink-600 flex-shrink-0">•</span>{q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
