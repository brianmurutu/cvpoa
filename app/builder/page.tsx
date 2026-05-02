'use client'

import { useState } from 'react'
import Link from 'next/link'
import CVRenderer from '@/components/CVRenderer'
import { FileText, ArrowLeft, ArrowRight, Loader2, Check, Download, Sparkles, Upload, MessageSquare } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────

interface ExperienceEntry {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  responsibilities: string
}

interface EducationEntry {
  degree: string
  institution: string
  location: string
  graduationYear: string
  achievements: string
}

interface FormData {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  targetRole: string
  targetJobDescription: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string
  summary: string
}

const STEPS = ['Personal Info', 'Experience', 'Education & Skills', 'Review & Generate']

const emptyExp = (): ExperienceEntry => ({
  title: '', company: '', location: '', startDate: '', endDate: '', responsibilities: '',
})

const emptyEdu = (): EducationEntry => ({
  degree: '', institution: '', location: '', graduationYear: '', achievements: '',
})

// ── Component ──────────────────────────────────────────────────────────────────

export default function BuilderPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [resultId, setResultId] = useState<string | null>(null)
  const [theme, setTheme] = useState('modern')
  const [rewriting, setRewriting] = useState<number | null>(null)
  const [importing, setImporting] = useState(false)

  const [form, setForm] = useState<FormData>({
    fullName: '', email: '', phone: '', location: '',
    linkedin: '', targetRole: '', targetJobDescription: '',
    experience: [emptyExp()],
    education: [emptyEdu()],
    skills: '', summary: '',
  })

  const updateField = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const updateExp = (i: number, field: keyof ExperienceEntry, value: string) =>
    setForm((prev) => {
      const experience = [...prev.experience]
      experience[i] = { ...experience[i], [field]: value }
      return { ...prev, experience }
    })

  const updateEdu = (i: number, field: keyof EducationEntry, value: string) =>
    setForm((prev) => {
      const education = [...prev.education]
      education[i] = { ...education[i], [field]: value }
      return { ...prev, education }
    })

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setResult(data.resume)
        setResultId(data.id)
        setStep(4) // success state
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  const handleImportLinkedIn = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setImporting(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/builder/import-linkedin', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.profile) {
        const p = data.profile
        setForm(prev => ({
          ...prev,
          fullName: p.fullName || prev.fullName,
          email: p.email || prev.email,
          phone: p.phone || prev.phone,
          location: p.location || prev.location,
          linkedin: p.linkedin || prev.linkedin,
          summary: p.summary || prev.summary,
          experience: p.experience?.length ? p.experience : prev.experience,
          education: p.education?.length ? p.education : prev.education,
          skills: p.skills || prev.skills,
        }))
        alert('Profile imported successfully! Please review the details.')
      } else {
        alert(data.error || 'Failed to import profile')
      }
    } catch (err) {
      console.error(err)
      alert('Network error during import')
    }
    setImporting(false)
    e.target.value = '' 
  }

  const handleRewrite = async (i: number, text: string) => {
    if (!text) return
    setRewriting(i)
    try {
      const res = await fetch('/api/builder/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (res.ok && data.text) {
        updateExp(i, 'responsibilities', data.text)
      }
    } catch (err) {
      console.error(err)
    }
    setRewriting(null)
  }

  const handleDownloadJSON = () => {
    if (!result) return
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.fullName.replace(/\s+/g, '_')}_CV.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Header */}
      <header className="border-b border-ink-800/40 bg-ink-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Step indicator */}
        {step < 4 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <span className="section-tag">Resume Builder</span>
              <span className="text-xs text-ink-500 font-mono">Step {step + 1} of {STEPS.length}</span>
            </div>
            <div className="flex gap-1.5">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-brand-500' : 'bg-ink-800'
                  }`}
                />
              ))}
            </div>
            <h1 className="font-display text-2xl font-bold text-ink-50 mt-4">{STEPS[step]}</h1>
          </div>
        )}

        {/* ── Step 0: Personal Info ── */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="card p-5 bg-brand-500/5 border-brand-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-brand-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Save time with LinkedIn Import
                </h3>
                <p className="text-sm text-ink-400 mt-1">Upload your LinkedIn Profile PDF and we'll auto-fill your CV details.</p>
              </div>
              <label className="btn-secondary whitespace-nowrap cursor-pointer relative overflow-hidden">
                {importing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Importing...</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload PDF</>
                )}
                <input 
                  type="file" 
                  accept="application/pdf" 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={handleImportLinkedIn}
                  disabled={importing}
                />
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Full Name *</label>
                <input value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)}
                  className="input" placeholder="Brian Murutu" />
              </div>
              <div>
                <label className="label">Email *</label>
                <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)}
                  className="input" placeholder="brian@email.com" />
              </div>
              <div>
                <label className="label">Phone *</label>
                <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)}
                  className="input" placeholder="+254 712 345 678" />
              </div>
              <div>
                <label className="label">Location *</label>
                <input value={form.location} onChange={(e) => updateField('location', e.target.value)}
                  className="input" placeholder="Nairobi, Kenya" />
              </div>
              <div>
                <label className="label">LinkedIn URL</label>
                <input value={form.linkedin} onChange={(e) => updateField('linkedin', e.target.value)}
                  className="input" placeholder="linkedin.com/in/brian-murutu" />
              </div>
              <div>
                <label className="label">Target Role</label>
                <input value={form.targetRole} onChange={(e) => updateField('targetRole', e.target.value)}
                  className="input" placeholder="Marketing Manager" />
              </div>
            </div>
            <div>
              <label className="label">
                Target Job Description
                <span className="ml-1 text-xs text-ink-600">(paste for best AI tailoring)</span>
              </label>
              <textarea value={form.targetJobDescription}
                onChange={(e) => updateField('targetJobDescription', e.target.value)}
                className="input min-h-[100px] resize-y"
                placeholder="Paste the full job description here..." />
            </div>
          </div>
        )}

        {/* ── Step 1: Experience ── */}
        {step === 1 && (
          <div className="space-y-8">
            {form.experience.map((exp, i) => (
              <div key={i} className="card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-ink-200">Experience {i + 1}</h3>
                  {form.experience.length > 1 && (
                    <button
                      onClick={() => updateField('experience', form.experience.filter((_, j) => j !== i))}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Job Title *</label>
                    <input value={exp.title} onChange={(e) => updateExp(i, 'title', e.target.value)}
                      className="input" placeholder="Marketing Manager" />
                  </div>
                  <div>
                    <label className="label">Company *</label>
                    <input value={exp.company} onChange={(e) => updateExp(i, 'company', e.target.value)}
                      className="input" placeholder="Safaricom" />
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <input value={exp.location} onChange={(e) => updateExp(i, 'location', e.target.value)}
                      className="input" placeholder="Nairobi, Kenya" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Start</label>
                      <input value={exp.startDate} onChange={(e) => updateExp(i, 'startDate', e.target.value)}
                        className="input" placeholder="Jan 2022" />
                    </div>
                    <div>
                      <label className="label">End</label>
                      <input value={exp.endDate} onChange={(e) => updateExp(i, 'endDate', e.target.value)}
                        className="input" placeholder="Present" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label mb-0">
                      Responsibilities & Achievements *
                    </label>
                    <button
                      onClick={() => handleRewrite(i, exp.responsibilities)}
                      disabled={rewriting === i || !exp.responsibilities}
                      className="text-xs font-medium text-brand-400 hover:text-brand-300 disabled:opacity-50 transition-colors flex items-center gap-1"
                    >
                      {rewriting === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Enhance with AI
                    </button>
                  </div>
                  <textarea value={exp.responsibilities}
                    onChange={(e) => updateExp(i, 'responsibilities', e.target.value)}
                    className="input min-h-[100px] resize-y"
                    placeholder="Managed social media campaigns, grew follower base by 40%, coordinated a team of 5..." />
                </div>
              </div>
            ))}

            <button
              onClick={() => updateField('experience', [...form.experience, emptyExp()])}
              className="btn-ghost w-full border border-dashed border-ink-700 py-3"
            >
              + Add Another Role
            </button>
          </div>
        )}

        {/* ── Step 2: Education & Skills ── */}
        {step === 2 && (
          <div className="space-y-8">
            {form.education.map((edu, i) => (
              <div key={i} className="card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-ink-200">Education {i + 1}</h3>
                  {form.education.length > 1 && (
                    <button
                      onClick={() => updateField('education', form.education.filter((_, j) => j !== i))}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Degree / Qualification *</label>
                    <input value={edu.degree} onChange={(e) => updateEdu(i, 'degree', e.target.value)}
                      className="input" placeholder="BSc. Computer Science" />
                  </div>
                  <div>
                    <label className="label">Institution *</label>
                    <input value={edu.institution} onChange={(e) => updateEdu(i, 'institution', e.target.value)}
                      className="input" placeholder="University of Nairobi" />
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <input value={edu.location} onChange={(e) => updateEdu(i, 'location', e.target.value)}
                      className="input" placeholder="Nairobi, Kenya" />
                  </div>
                  <div>
                    <label className="label">Graduation Year</label>
                    <input value={edu.graduationYear} onChange={(e) => updateEdu(i, 'graduationYear', e.target.value)}
                      className="input" placeholder="2020" />
                  </div>
                </div>
                <div>
                  <label className="label">Achievements / Awards</label>
                  <input value={edu.achievements} onChange={(e) => updateEdu(i, 'achievements', e.target.value)}
                    className="input" placeholder="First Class Honours, Dean's List..." />
                </div>
              </div>
            ))}

            <button
              onClick={() => updateField('education', [...form.education, emptyEdu()])}
              className="btn-ghost w-full border border-dashed border-ink-700 py-3"
            >
              + Add Another Qualification
            </button>

            <div className="card p-6 space-y-4">
              <h3 className="font-medium text-ink-200">Skills</h3>
              <div>
                <label className="label">
                  Your Skills *
                  <span className="ml-1 text-xs text-ink-600">(comma-separated or freeform)</span>
                </label>
                <textarea value={form.skills} onChange={(e) => updateField('skills', e.target.value)}
                  className="input min-h-[80px] resize-y"
                  placeholder="Python, Data Analysis, Excel, Project Management, Communication, Swahili, English..." />
              </div>
              <div>
                <label className="label">Current Summary / Bio
                  <span className="ml-1 text-xs text-ink-600">(optional — AI will improve it)</span>
                </label>
                <textarea value={form.summary} onChange={(e) => updateField('summary', e.target.value)}
                  className="input min-h-[80px] resize-y"
                  placeholder="Experienced marketer with 5 years..." />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Review ── */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-medium text-ink-200 mb-4">Summary</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex gap-4">
                  <dt className="text-ink-500 w-28 flex-shrink-0">Name</dt>
                  <dd className="text-ink-200">{form.fullName || '—'}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-ink-500 w-28 flex-shrink-0">Target Role</dt>
                  <dd className="text-ink-200">{form.targetRole || '—'}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-ink-500 w-28 flex-shrink-0">Experience</dt>
                  <dd className="text-ink-200">{form.experience.length} role(s)</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="text-ink-500 w-28 flex-shrink-0">Education</dt>
                  <dd className="text-ink-200">{form.education.length} qualification(s)</dd>
                </div>
              </dl>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
                {error.toLowerCase().includes('access') && (
                  <Link href="/#pricing" className="ml-2 text-brand-400 underline">Buy access →</Link>
                )}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !form.fullName || !form.skills}
              className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed glow"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating your CV...</>
              ) : (
                <><FileText className="w-4 h-4" /> Generate My CV with AI</>
              )}
            </button>
          </div>
        )}

        {/* ── Step 4: Success ── */}
        {step === 4 && result && (
          <div className="animate-in pb-20">
            <div className="text-center py-10 print:hidden">
              <div className="w-16 h-16 bg-brand-500/20 border border-brand-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-brand-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-ink-50 mb-2">Your CV is ready! 🎉</h2>
              <p className="text-ink-400 text-sm mb-8">
                Your AI-generated, ATS-optimized CV is ready. Select a template and export.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="bg-ink-900 border border-ink-800 rounded-lg p-1 inline-flex">
                  {['modern', 'corporate', 'creative'].map(t => (
                    <button 
                      key={t} 
                      onClick={() => setTheme(t)} 
                      className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${theme === t ? 'bg-brand-500 text-ink-950 font-medium' : 'text-ink-400 hover:text-ink-200'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <button onClick={handlePrint} className="btn-primary">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button onClick={handleDownloadJSON} className="btn-secondary">
                  <Download className="w-4 h-4" /> JSON
                </button>
                {resultId && (
                  <Link href={`/dashboard/interview/${resultId}`} className="btn-secondary">
                    <MessageSquare className="w-4 h-4" /> Prepare for Interview
                  </Link>
                )}
                <Link href="/dashboard" className="btn-ghost border border-ink-800">
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Live Preview Container */}
            <div className="w-full overflow-x-auto bg-ink-900/50 rounded-2xl border border-ink-800/60 p-4 sm:p-8 flex justify-center print:border-none print:p-0 print:bg-transparent">
               <div className="print:block" style={{ width: '210mm', minHeight: '297mm' }}>
                  <CVRenderer data={{...form, ...result}} theme={theme} />
               </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-ink-800/40">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="btn-ghost disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="btn-primary"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        )}
      </main>
    </div>
  )
}
