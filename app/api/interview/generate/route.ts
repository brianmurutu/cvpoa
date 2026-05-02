import { NextResponse } from 'next/server'
import { generateInterview } from '@/lib/ai'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { resumeId } = await request.json()
    if (!resumeId) return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 })

    // Fetch resume
    const { data: resume, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (error || !resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 })

    const jd = resume.raw_input?.targetJobDescription || resume.target_role || 'General Position'
    
    const questions = await generateInterview(resume.ai_output, jd)
    return NextResponse.json({ questions })
  } catch (err) {
    console.error('Interview generation error:', err)
    return NextResponse.json({ error: 'Failed to generate interview' }, { status: 500 })
  }
}
