'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, MessageSquare, Lightbulb, UserRound } from 'lucide-react'

export default function InterviewPage() {
  const { id } = useParams()
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/interview/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeId: id })
        })
        const data = await res.json()
        if (res.ok) setQuestions(data.questions)
        else setError(data.error)
      } catch (e) {
        setError('Network error')
      }
      setLoading(false)
    }
    if (id) load()
  }, [id])

  const toggleReveal = (index: number) => {
    setRevealed(prev => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <div className="min-h-screen bg-ink-950 px-4 py-8 sm:px-6 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center text-ink-400 hover:text-ink-200 transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-brand-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink-50">AI Mock Interview</h1>
        </div>
        <p className="text-ink-400 mb-10">
          We analyzed your CV against the target role and generated the most likely interview questions you'll face.
        </p>

        {loading && (
          <div className="text-center py-20 card border-ink-800 border-dashed">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto mb-4" />
            <p className="text-ink-300">Generating highly-specific questions...</p>
            <p className="text-ink-500 text-sm mt-2">This may take up to 10 seconds.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-400 text-center">
            {error}
          </div>
        )}

        {!loading && !error && questions.length > 0 && (
          <div className="space-y-6">
            {questions.map((q, i) => (
              <div key={i} className="card p-6 border-ink-800/60 hover:border-brand-500/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-ink-900 border border-ink-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <UserRound className="w-4 h-4 text-ink-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-ink-100 mb-2">{q.question}</h3>
                    <p className="text-sm text-ink-500 mb-4 italic">"{q.context}"</p>
                    
                    {!revealed[i] ? (
                      <button 
                        onClick={() => toggleReveal(i)}
                        className="btn-secondary text-sm py-1.5 px-3"
                      >
                        <Lightbulb className="w-4 h-4" />
                        Reveal AI Tips
                      </button>
                    ) : (
                      <div className="bg-brand-500/5 border border-brand-500/20 rounded-lg p-4 mt-4 animate-in">
                        <h4 className="font-medium text-brand-400 mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" /> How to answer:
                        </h4>
                        <ul className="space-y-2">
                          {q.tips.map((tip: string, j: number) => (
                            <li key={j} className="text-sm text-ink-300 flex items-start gap-2">
                              <span className="text-brand-500 mt-0.5">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={() => toggleReveal(i)}
                          className="text-xs text-ink-500 hover:text-ink-300 mt-4 underline"
                        >
                          Hide tips
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
