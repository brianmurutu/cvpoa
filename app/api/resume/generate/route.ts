import { NextResponse } from 'next/server'
import { generateResume } from '@/lib/ai'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    // Auth check
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Access check — user must have an active (non-expired) grant
    const { data: grant } = await supabase
      .from('access_grants')
      .select('expires_at')
      .eq('user_id', user.id)
      .gt('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: false })
      .limit(1)
      .single()

    if (!grant) {
      return NextResponse.json(
        { error: 'No active access. Please purchase a plan to continue.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const resumeJson = await generateResume(body)
    const parsed = JSON.parse(resumeJson.replace(/```json|```/g, '').trim())

    // Save to Supabase
    const { data: saved, error } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        location: body.location,
        linkedin: body.linkedin,
        target_role: body.targetRole,
        ai_output: parsed,
        raw_input: body,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
    }

    return NextResponse.json({ resume: parsed, id: saved?.id })
  } catch (err) {
    console.error('Resume generation error:', err)
    return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 })
  }
}
