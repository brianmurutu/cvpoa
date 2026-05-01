import { NextResponse } from 'next/server'
import { reviewCV } from '@/lib/ai'
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

    const { cvText, targetRole } = await request.json()

    if (!cvText) {
      return NextResponse.json({ error: 'CV text is required' }, { status: 400 })
    }

    const feedback = await reviewCV(cvText, targetRole)
    return NextResponse.json({ feedback })
  } catch (err) {
    console.error('CV review error:', err)
    return NextResponse.json({ error: 'Failed to review CV' }, { status: 500 })
  }
}
