'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Search, Loader2, ArrowLeft, Tag, Briefcase, GraduationCap, Star, Zap, Copy, Check } from 'lucide-react'

interface Analysis {
  jobTitle: string
  hardSkills: string[]
  softSkills: string[]
  responsibilities: string[]
  qualifications: string[]
  keywords: string[]
  experienceLevel: string
  companyCulture: string
}

function TagPill({ label, color = 'default' }: { label: string; color?: 'green' | 'blue' | 'amber' | 'default' }) {
  const colors = {
    green: 'bg-brand-500/10 border-brand-500/30 text-brand-300',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    default: 'bg-ink-800/60 border-ink-700 text-ink-300',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${colors[color]}`}>
      {label}
    </span>
  )
}

export default function AnalyzerPage() {
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleAnalyze = async () => {
    if (!jd.trim()) return
    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      const res = await fetch('/api/analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setAnalysis(data.analysis)
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  const handleCopyKeywords = () => {
    if (!analysis) return
    navigator.clipboard.writeText(analysis.keywords.join(', '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Header */}
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
          <span className="section-tag"><Search className="w-3 h-3" /> JD Analyzer</span>
          <h1 className="font-display text-3xl font-bold text-ink-50 mt-3">
            Job Description Analyzer
          </h1>
          <p className="mt-2 text-ink-400 max-w-xl">
            Paste any job description. We'll extract the exact keywords, skills, and requirements
            you need in your CV to maximize your ATS score.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            <div>
              <label className="label">Paste Job Description</label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                className="input min-h-[340px] resize-y"
                placeholder={`Paste the full job description here...\n\nExample:\nWe are looking for a Marketing Manager based in Nairobi. The ideal candidate will have 3+ years in digital marketing, proficiency in Google Analytics, and strong communication skills...`}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !jd.trim()}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Search className="w-4 h-4" /> Analyze Job Description</>
              )}
            </button>
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Tip */}
            <div className="bg-brand-500/5 border border-brand-500/20 rounded-lg px-4 py-3">
              <p className="text-xs text-brand-400/80">
                💡 <span className="font-medium">Pro tip:</span> After analyzing, copy the keywords list and paste it into your CV builder's job description field for maximum ATS match.
              </p>
            </div>
          </div>

          {/* Results */}
          <div>
            {!analysis && !loading && (
              <div className="card h-full flex flex-col items-center justify-center text-center p-10 min-h-[340px]">
                <div className="w-12 h-12 bg-ink-800 rounded-xl flex items-center justify-center mb-4">
                  <Search className="w-5 h-5 text-ink-600" />
                </div>
                <p className="text-ink-500 text-sm">Paste a job description and click Analyze to see results.</p>
              </div>
            )}

            {loading && (
              <div className="card h-full flex flex-col items-center justify-center p-10 min-h-[340px]">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
                <p className="text-ink-400 text-sm">Extracting keywords and requirements...</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-4">
                {/* Job title + level */}
                <div className="card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-display font-semibold text-ink-100">{analysis.jobTitle}</p>
                    <p className="text-xs text-ink-500 mt-0.5">{analysis.companyCulture}</p>
                  </div>
                  <span className="text-xs font-mono bg-brand-500/10 border border-brand-500/20 text-brand-400 px-3 py-1 rounded-full">
                    {analysis.experienceLevel}
                  </span>
                </div>

                {/* Keywords — most important */}
                <div className="card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-brand-400" />
                      <p className="font-medium text-ink-100 text-sm">Top ATS Keywords</p>
                    </div>
                    <button
                      onClick={handleCopyKeywords}
                      className="flex items-center gap-1.5 text-xs text-ink-400 hover:text-brand-400 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy all'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((kw) => (
                      <TagPill key={kw} label={kw} color="green" />
                    ))}
                  </div>
                </div>

                {/* Hard skills */}
                {analysis.hardSkills?.length > 0 && (
                  <div className="card p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <p className="font-medium text-ink-100 text-sm">Hard Skills Required</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.hardSkills.map((s) => (
                        <TagPill key={s} label={s} color="blue" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Soft skills */}
                {analysis.softSkills?.length > 0 && (
                  <div className="card p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400" />
                      <p className="font-medium text-ink-100 text-sm">Soft Skills</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.softSkills.map((s) => (
                        <TagPill key={s} label={s} color="amber" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Responsibilities */}
                {analysis.responsibilities?.length > 0 && (
                  <div className="card p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-ink-400" />
                      <p className="font-medium text-ink-100 text-sm">Key Responsibilities</p>
                    </div>
                    <ul className="space-y-1.5">
                      {analysis.responsibilities.slice(0, 5).map((r, i) => (
                        <li key={i} className="flex gap-2 text-xs text-ink-400">
                          <span className="text-brand-500 mt-0.5 flex-shrink-0">▸</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Qualifications */}
                {analysis.qualifications?.length > 0 && (
                  <div className="card p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-ink-400" />
                      <p className="font-medium text-ink-100 text-sm">Qualifications</p>
                    </div>
                    <ul className="space-y-1.5">
                      {analysis.qualifications.map((q, i) => (
                        <li key={i} className="flex gap-2 text-xs text-ink-400">
                          <span className="text-brand-500 mt-0.5 flex-shrink-0">▸</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <Link
                  href={`/builder?jd=${encodeURIComponent(jd.slice(0, 500))}`}
                  className="btn-primary w-full justify-center"
                >
                  <FileText className="w-4 h-4" />
                  Build CV Targeting This Role
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
