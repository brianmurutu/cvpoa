import { NextResponse } from 'next/server'
import { generateCoverLetter } from '@/lib/ai'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Access check
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
    const coverLetter = await generateCoverLetter(body)

    // Save to Supabase
    await supabase.from('cover_letters').insert({
      user_id: user.id,
      job_title: body.jobTitle,
      company_name: body.companyName,
      content: coverLetter,
    })

    return NextResponse.json({ cover_letter: coverLetter })
  } catch (err) {
    console.error('Cover letter error:', err)
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 })
  }
}
