'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Map, Crosshair, GraduationCap, CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RoadmapPage() {
  const supabase = createClient()
  const [resumes, setResumes] = useState<any[]>([])
  const [selectedResume, setSelectedResume] = useState('')
  const [dreamRole, setDreamRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState<any | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('resumes')
          .select('id, target_role, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        if (data) {
          setResumes(data)
          if (data.length > 0) setSelectedResume(data[0].id)
        }
      }
    }
    load()
  }, [])

  const handleGenerate = async () => {
    if (!selectedResume || !dreamRole.trim()) return
    setLoading(true)
    setError('')
    setRoadmap(null)
    
    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: selectedResume, dreamRole }),
      })
      const data = await res.json()
      if (res.ok) setRoadmap(data.roadmap)
      else setError(data.error)
    } catch (e) {
      setError('Network error')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-ink-950 px-4 py-8 sm:px-6 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center text-ink-400 hover:text-ink-200 transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Map className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink-50">Career Roadmap</h1>
        </div>
        <p className="text-ink-400 mb-10 max-w-xl">
          Select your current CV, tell us your dream role, and we'll map out the exact 6-month plan to get you there.
        </p>

        {!roadmap && (
          <div className="card p-6 sm:p-8 max-w-2xl">
            <div className="space-y-6">
              <div>
                <label className="label">Select Base CV</label>
                {resumes.length === 0 ? (
                  <div className="text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                    You haven't built any CVs yet. <Link href="/builder" className="underline font-medium">Build one first.</Link>
                  </div>
                ) : (
                  <select 
                    value={selectedResume} 
                    onChange={(e) => setSelectedResume(e.target.value)}
                    className="input w-full appearance-none"
                  >
                    {resumes.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.target_role || 'General CV'} ({new Date(r.created_at).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="label">Your Dream Role</label>
                <input 
                  type="text" 
                  value={dreamRole} 
                  onChange={(e) => setDreamRole(e.target.value)}
                  className="input" 
                  placeholder="e.g., Senior Data Scientist at Microsoft" 
                />
              </div>
              {error && <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
              <button 
                onClick={handleGenerate} 
                disabled={loading || resumes.length === 0 || !dreamRole}
                className="btn-primary w-full py-3"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Roadmap...</> : <><Map className="w-4 h-4" /> Generate 6-Month Plan</>}
              </button>
            </div>
          </div>
        )}

        {roadmap && (
          <div className="animate-in space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="card p-6 border-ink-800/60">
                <div className="flex items-center gap-2 mb-4 text-brand-400">
                  <Crosshair className="w-5 h-5" />
                  <h3 className="font-semibold">Missing Skills to Learn</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {roadmap.missingSkills.map((s: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-ink-900 border border-ink-800 rounded-full text-xs text-ink-300">{s}</span>
                  ))}
                </div>
              </div>
              <div className="card p-6 border-ink-800/60">
                <div className="flex items-center gap-2 mb-4 text-blue-400">
                  <GraduationCap className="w-5 h-5" />
                  <h3 className="font-semibold">Recommended Certs</h3>
                </div>
                <ul className="space-y-2">
                  {roadmap.recommendedCertifications.map((c: string, i: number) => (
                    <li key={i} className="text-sm text-ink-300 flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-8">
                <CalendarDays className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold text-ink-100">6-Month Action Plan</h3>
              </div>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-ink-800 before:to-transparent">
                
                {/* Months 1-2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-ink-950 bg-emerald-500 text-ink-950 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold text-sm z-10">
                    M1
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-ink-900 border border-ink-800 shadow-md">
                    <h4 className="font-bold text-emerald-400 mb-2">Months 1-2: Foundation</h4>
                    <ul className="space-y-2 text-sm text-ink-300">
                      {roadmap.month1to2.map((a: string, i: number) => <li key={i} className="flex gap-2"><span className="text-emerald-500/50">•</span>{a}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Months 3-4 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-ink-950 bg-brand-500 text-ink-950 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold text-sm z-10">
                    M3
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-ink-900 border border-ink-800 shadow-md">
                    <h4 className="font-bold text-brand-400 mb-2">Months 3-4: Build & Apply</h4>
                    <ul className="space-y-2 text-sm text-ink-300">
                      {roadmap.month3to4.map((a: string, i: number) => <li key={i} className="flex gap-2"><span className="text-brand-500/50">•</span>{a}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Months 5-6 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-ink-950 bg-blue-500 text-ink-950 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold text-sm z-10">
                    M5
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-ink-900 border border-ink-800 shadow-md">
                    <h4 className="font-bold text-blue-400 mb-2">Months 5-6: Master & Interview</h4>
                    <ul className="space-y-2 text-sm text-ink-300">
                      {roadmap.month5to6.map((a: string, i: number) => <li key={i} className="flex gap-2"><span className="text-blue-500/50">•</span>{a}</li>)}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <button onClick={() => setRoadmap(null)} className="btn-secondary">Generate Another</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
