'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Star, Loader2, ArrowLeft, TrendingUp, AlertCircle, CheckCircle, Zap } from 'lucide-react'

interface Feedback {
  overallScore: number
  atsScore: number
  strengths: string[]
  improvements: string[]
  missingKeywords: string[]
  suggestion: string
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#1a1209" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold font-mono" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-xs text-ink-500 font-medium">{label}</span>
    </div>
  )
}

export default function ReviewPage() {
  const [cvText, setCvText] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [error, setError] = useState('')

  const handleReview = async () => {
    if (!cvText.trim()) return
    setLoading(true)
    setError('')
    setFeedback(null)

    try {
      const res = await fetch('/api/resume/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, targetRole }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setFeedback(data.feedback)
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  const overallColor = feedback
    ? feedback.overallScore >= 80 ? '#22c55e' : feedback.overallScore >= 60 ? '#f59e0b' : '#ef4444'
    : '#22c55e'

  const atsColor = feedback
    ? feedback.atsScore >= 80 ? '#22c55e' : feedback.atsScore >= 60 ? '#f59e0b' : '#ef4444'
    : '#22c55e'

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
          <span className="section-tag"><Star className="w-3 h-3" /> AI Review</span>
          <h1 className="font-display text-3xl font-bold text-ink-50 mt-3">CV Review & Score</h1>
          <p className="mt-2 text-ink-400 max-w-xl">
            Paste your existing CV and get honest, HR-level feedback with an ATS score and specific improvements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            <div>
              <label className="label">Target Job Role <span className="text-ink-600 text-xs">(optional)</span></label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="input"
                placeholder="e.g. Software Engineer, Sales Manager"
              />
            </div>
            <div>
              <label className="label">Paste Your CV Text *</label>
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                className="input min-h-[380px] resize-y font-mono text-xs"
                placeholder="Paste your full CV content here (plain text)..."
              />
            </div>
            <button
              onClick={handleReview}
              disabled={loading || !cvText.trim()}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Reviewing...</>
              ) : (
                <><Star className="w-4 h-4" /> Get AI Review</>
              )}
            </button>
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Results */}
          <div>
            {!feedback && !loading && (
              <div className="card h-full flex flex-col items-center justify-center text-center p-10 min-h-[380px]">
                <div className="w-12 h-12 bg-ink-800 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5 text-ink-600" />
                </div>
                <p className="text-ink-500 text-sm">Your CV score and feedback will appear here.</p>
              </div>
            )}

            {loading && (
              <div className="card h-full flex flex-col items-center justify-center p-10 min-h-[380px]">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
                <p className="text-ink-400 text-sm">Reviewing your CV like an HR expert...</p>
              </div>
            )}

            {feedback && (
              <div className="space-y-4">
                {/* Scores */}
                <div className="card p-6 flex items-center justify-around">
                  <ScoreRing score={feedback.overallScore} label="Overall Score" color={overallColor} />
                  <div className="w-px h-16 bg-ink-800" />
                  <ScoreRing score={feedback.atsScore} label="ATS Score" color={atsColor} />
                </div>

                {/* Top suggestion */}
                <div className="card p-4 flex gap-3">
                  <Zap className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-brand-400 mb-1">Top Recommendation</p>
                    <p className="text-sm text-ink-300">{feedback.suggestion}</p>
                  </div>
                </div>

                {/* Strengths */}
                {feedback.strengths?.length > 0 && (
                  <div className="card p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-400" />
                      <p className="font-medium text-ink-100 text-sm">Strengths</p>
                    </div>
                    <ul className="space-y-2">
                      {feedback.strengths.map((s, i) => (
                        <li key={i} className="flex gap-2 text-sm text-ink-300">
                          <span className="text-brand-500 flex-shrink-0">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {feedback.improvements?.length > 0 && (
                  <div className="card p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <p className="font-medium text-ink-100 text-sm">What to Improve</p>
                    </div>
                    <ul className="space-y-2">
                      {feedback.improvements.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm text-ink-300">
                          <span className="text-amber-500 flex-shrink-0">!</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Missing keywords */}
                {feedback.missingKeywords?.length > 0 && (
                  <div className="card p-4 space-y-3">
                    <p className="font-medium text-ink-100 text-sm">Missing Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {feedback.missingKeywords.map((kw) => (
                        <span key={kw} className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-300 rounded-full text-xs">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Link href="/builder" className="btn-primary w-full justify-center">
                  <FileText className="w-4 h-4" /> Rebuild CV with AI →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
