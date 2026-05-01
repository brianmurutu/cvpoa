'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Mail, Loader2, ArrowLeft, Copy, Check, Download } from 'lucide-react'

export default function CoverLetterPage() {
  const [form, setForm] = useState({
    candidateName: '',
    candidateEmail: '',
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    keyExperience: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleGenerate = async () => {
    if (!form.jobTitle || !form.candidateName) return
    setLoading(true)
    setError('')
    setResult('')
    try {
      const res = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          resumeSummary: form.keyExperience,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setResult(data.cover_letter)
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadTxt = () => {
    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.companyName || 'Cover_Letter'}_${form.jobTitle}.txt`.replace(/\s+/g, '_')
    a.click()
    URL.revokeObjectURL(url)
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
          <span className="section-tag"><Mail className="w-3 h-3" /> Cover Letter</span>
          <h1 className="font-display text-3xl font-bold text-ink-50 mt-3">
            Cover Letter Generator
          </h1>
          <p className="mt-2 text-ink-400 max-w-xl">
            Fill in a few details and get a professional, tailored cover letter in seconds.
            No more staring at a blank page.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Your Full Name *</label>
                <input
                  type="text"
                  value={form.candidateName}
                  onChange={(e) => update('candidateName', e.target.value)}
                  className="input"
                  placeholder="Brian Murutu"
                />
              </div>
              <div>
                <label className="label">Your Email</label>
                <input
                  type="email"
                  value={form.candidateEmail}
                  onChange={(e) => update('candidateEmail', e.target.value)}
                  className="input"
                  placeholder="brian@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Job Title *</label>
                <input
                  type="text"
                  value={form.jobTitle}
                  onChange={(e) => update('jobTitle', e.target.value)}
                  className="input"
                  placeholder="Marketing Manager"
                />
              </div>
              <div>
                <label className="label">Company Name</label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
                  className="input"
                  placeholder="Safaricom"
                />
              </div>
            </div>

            <div>
              <label className="label">
                Job Description
                <span className="ml-1 text-xs text-ink-600">(paste for best results)</span>
              </label>
              <textarea
                value={form.jobDescription}
                onChange={(e) => update('jobDescription', e.target.value)}
                className="input min-h-[120px] resize-y"
                placeholder="Paste the job description here..."
              />
            </div>

            <div>
              <label className="label">
                Your Key Experience / Highlights *
              </label>
              <textarea
                value={form.keyExperience}
                onChange={(e) => update('keyExperience', e.target.value)}
                className="input min-h-[120px] resize-y"
                placeholder="Briefly describe your most relevant experience and achievements for this role. E.g: 4 years in digital marketing, grew social media following by 200%, managed KES 5M ad budgets..."
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !form.jobTitle || !form.candidateName || !form.keyExperience}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Writing your cover letter...</>
              ) : (
                <><Mail className="w-4 h-4" /> Generate Cover Letter</>
              )}
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

          {/* Output */}
          <div>
            {!result && !loading && (
              <div className="card h-full flex flex-col items-center justify-center text-center p-10 min-h-[400px]">
                <div className="w-12 h-12 bg-ink-800 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-ink-600" />
                </div>
                <p className="text-ink-500 text-sm">Your cover letter will appear here.</p>
              </div>
            )}

            {loading && (
              <div className="card h-full flex flex-col items-center justify-center p-10 min-h-[400px]">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
                <p className="text-ink-400 text-sm">Writing a tailored cover letter...</p>
              </div>
            )}

            {result && (
              <div className="space-y-3">
                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="btn-secondary flex-1 text-sm py-2">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Text'}
                  </button>
                  <button onClick={handleDownloadTxt} className="btn-secondary flex-1 text-sm py-2">
                    <Download className="w-4 h-4" /> Download .txt
                  </button>
                </div>

                {/* Letter */}
                <div className="bg-white text-gray-900 rounded-xl shadow-xl p-8 font-body">
                  <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
                    {result}
                  </div>
                </div>

                {/* Regenerate */}
                <button
                  onClick={handleGenerate}
                  className="btn-ghost text-sm w-full justify-center"
                >
                  ↺ Generate another version
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
