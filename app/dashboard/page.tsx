import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  FileText, Plus, ChevronRight, FileCheck, Mail, Target, BarChart3,
  Activity, Trophy, Map, Send
} from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import PlansSection from '@/components/dashboard/PlansSection'
import SignOutButton from '@/components/dashboard/SignOutButton'
import DownloadResumeButton from '@/components/dashboard/DownloadResumeButton'

const quickLinks = [
  { href: '/builder', icon: Plus, label: 'Build a New CV', color: 'text-brand-400' },
  { href: '/cover-letter', icon: Mail, label: 'Write a Cover Letter', color: 'text-blue-400' },
  { href: '/roadmap', icon: Map, label: 'Career Roadmap', color: 'text-emerald-400' },
  { href: '/analyzer', icon: Target, label: 'Analyze a Job Description', color: 'text-purple-400' },
  { href: '/review', icon: BarChart3, label: 'Review My CV', color: 'text-yellow-400' },
  { href: 'https://t.me/tech_empire', icon: Send, label: 'Learn Digital Skills', color: 'text-[#0088cc]' },
]

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch resumes securely from the server
  const { data: resumes = [] } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch active grant securely from the server
  const { data: activeGrant } = await supabase
    .from('access_grants')
    .select('expires_at')
    .eq('user_id', user.id)
    .gt('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: false })
    .limit(1)
    .single()

  const latestResume = resumes?.[0]?.ai_output
  const calculateStrength = () => {
    if (!latestResume) return 0
    let score = 0
    if (latestResume.professionalSummary) score += 20
    if (latestResume.experience?.length > 0) score += 30
    if (latestResume.education?.length > 0) score += 20
    if (latestResume.skills?.technical?.length > 0 || latestResume.skills?.soft?.length > 0 || latestResume.skills?.tools?.length > 0) score += 30
    return score
  }
  const strength = calculateStrength()

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Paystack script needed by the PlansSection Client Component */}
      <script async src="https://js.paystack.co/v1/inline.js" />

      {/* Header */}
      <header className="border-b border-ink-800/40 bg-ink-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-ink-950" />
            </div>
            <span className="font-display font-bold text-ink-50">
              CV<span className="text-brand-400">Poa</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/builder" className="btn-primary text-sm py-2 px-4">
              <Plus className="w-4 h-4" />
              New CV
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Welcome */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-50">Dashboard</h1>
            <p className="text-ink-400 mt-1">Manage your CVs and access premium career tools.</p>
          </div>
          
          {/* Career Stats Widget */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="card px-4 py-3 flex items-center gap-3 min-w-[160px]">
              <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="text-xs text-ink-500 uppercase font-semibold tracking-wider">Profile Strength</p>
                <p className="text-xl font-bold text-ink-50">{strength}%</p>
              </div>
            </div>
            <div className="card px-4 py-3 flex items-center gap-3 min-w-[160px]">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-ink-500 uppercase font-semibold tracking-wider">CVs Built</p>
                <p className="text-xl font-bold text-ink-50">{resumes?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-ink-400 uppercase tracking-wider mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="card p-5 flex items-center gap-4 hover:border-ink-700 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-5 h-5 ${link.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-100 truncate">{link.label}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-600 group-hover:text-ink-400 transition-colors" />
                </Link>
              )
            })}
          </div>
        </section>

        {/* Access Plans - Extracted to Client Component */}
        <PlansSection userId={user.id} activeGrant={activeGrant} />

        {/* Saved CVs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-ink-400 uppercase tracking-wider">Your CVs</h2>
            {resumes && resumes.length > 0 && (
              <Link href="/builder" className="text-sm text-brand-400 hover:text-brand-300">
                + Create New
              </Link>
            )}
          </div>
          
          {!resumes || resumes.length === 0 ? (
            <div className="card p-10 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-ink-800 rounded-xl flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5 text-ink-600" />
              </div>
              <p className="text-ink-400 text-sm mb-1">No CVs yet</p>
              <p className="text-ink-600 text-xs mb-4">Build your first CV to see it here</p>
              <Link href="/builder" className="btn-primary text-sm py-2 px-5">
                <Plus className="w-4 h-4" />
                Build My First CV
              </Link>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-ink-900/50 border-b border-ink-800/60 text-ink-400 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Target Role</th>
                      <th className="px-6 py-4 font-medium">Created</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-800/40">
                    {resumes.map((r) => (
                      <tr key={r.id} className="hover:bg-ink-800/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-ink-100 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-ink-800 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-ink-300" />
                          </div>
                          {r.target_role || 'General Application'}
                        </td>
                        <td className="px-6 py-4 text-ink-400">
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <DownloadResumeButton data={r.ai_output} />
                            <Link href={`/dashboard/interview/${r.id}`} className="btn-secondary text-xs py-1.5 px-3 border-ink-700">
                              Prep Interview
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
