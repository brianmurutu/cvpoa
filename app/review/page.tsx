'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, ArrowLeft, Loader2, BarChart3, Upload } from 'lucide-react'

interface CVFeedback {
  overallScore: number
  atsScore: number
  strengths: string[]
  improvements: string[]
  missingKeywords: string[]
  suggestion: string
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-4xl font-display font-bold ${color}`}>{score}</div>
      <div className="text-xs text-ink-500 mt-1">{label}</div>
      <div className="mt-2 h-1.5 rounded-full bg-ink-800 overflow-hidden">
        <div className={`h-full rounded-full ${color.replace('text-', 'bg-')} transition-all duration-700`}
          style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

export default function ReviewPage() {
  const [cvText, setCvText] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CVFeedback | null>(null)
  const [error, setError] = useState('')
  const [extracting, setExtracting] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setExtracting(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.text) {
        setCvText(data.text)
      } else {
        setError(data.error || 'Failed to extract text from PDF')
      }
    } catch (err) {
      console.error(err)
      setError('Network error during file upload')
    }
    setExtracting(false)
    e.target.value = '' 
  }

  const handleReview = async () => {
    if (!cvText.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, targetRole }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Something went wrong')
      else setResult(data.feedback)
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
          <span className="section-tag"><BarChart3 className="w-3 h-3" /> CV Review</span>
          <h1 className="font-display text-3xl font-bold text-ink-50 mt-3">AI CV Review & Scoring</h1>
          <p className="mt-2 text-ink-400 max-w-xl">
            Paste your CV text and get instant HR-level feedback, an ATS score, and actionable improvements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <label className="label">Target Role (optional)</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="input"
                placeholder="e.g. Software Engineer"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-ink-300">Paste Your CV Text *</label>
                <label className="text-xs font-medium text-brand-400 hover:text-brand-300 cursor-pointer flex items-center gap-1 transition-colors">
                  {extracting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                  {extracting ? 'Extracting...' : 'Upload PDF'}
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={extracting}
                  />
                </label>
              </div>
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                className="input min-h-[300px] resize-y"
                placeholder="Paste your CV content here or upload a PDF..."
                disabled={extracting}
              />
            </div>
            <button
              onClick={handleReview}
              disabled={loading || !cvText.trim()}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Reviewing...</> : <><BarChart3 className="w-4 h-4" /> Review My CV</>}
            </button>
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
                {error.toLowerCase().includes('access') && (
                  <Link href="/#pricing" className="ml-2 text-brand-400 underline">Buy access →</Link>
                )}
              </div>
            )}
          </div>

          <div>
            {!result && !loading && (
              <div className="card h-full flex flex-col items-center justify-center text-center p-10 min-h-[300px]">
                <BarChart3 className="w-10 h-10 text-ink-700 mb-4" />
                <p className="text-ink-500 text-sm">Your review will appear here.</p>
              </div>
            )}
            {loading && (
              <div className="card h-full flex flex-col items-center justify-center p-10 min-h-[300px]">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-3" />
                <p className="text-ink-400 text-sm">Reviewing your CV...</p>
              </div>
            )}
            {result && (
              <div className="space-y-5 animate-in">
                {/* Scores */}
                <div className="card p-6 grid grid-cols-2 gap-6">
                  <ScoreRing score={result.overallScore} label="Overall Score" color="text-brand-400" />
                  <ScoreRing score={result.atsScore} label="ATS Score" color="text-blue-400" />
                </div>

                {/* Key suggestion */}
                <div className="card p-5 border-brand-500/20 bg-brand-500/5">
                  <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-2">⚡ Top Recommendation</p>
                  <p className="text-sm text-ink-200 leading-relaxed">{result.suggestion}</p>
                </div>

                {/* Strengths */}
                <div className="card p-5">
                  <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3">✓ Strengths</p>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-ink-300 flex gap-2">
                        <span className="text-green-500 flex-shrink-0">✓</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="card p-5">
                  <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-3">↑ Improvements</p>
                  <ul className="space-y-2">
                    {result.improvements.map((s, i) => (
                      <li key={i} className="text-sm text-ink-300 flex gap-2">
                        <span className="text-yellow-500 flex-shrink-0">↑</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Keywords */}
                {result.missingKeywords.length > 0 && (
                  <div className="card p-5">
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">Missing Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((kw) => (
                        <span key={kw} className="text-xs px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-300">
                          {kw}
                        </span>
                      ))}
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
