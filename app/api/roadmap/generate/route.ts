import { NextResponse } from 'next/server'
import { generateRoadmap } from '@/lib/ai'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { resumeId, dreamRole } = await request.json()
    if (!resumeId || !dreamRole) return NextResponse.json({ error: 'Resume ID and Dream Role are required' }, { status: 400 })

    const { data: resume, error } = await supabase
      .from('resumes')
      .select('ai_output')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (error || !resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 })

    const roadmap = await generateRoadmap(resume.ai_output, dreamRole)
    return NextResponse.json({ roadmap })
  } catch (err) {
    console.error('Roadmap error:', err)
    return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 })
  }
}
