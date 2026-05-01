import { NextResponse } from 'next/server'
import { analyzeJobDescription } from '@/lib/ai'
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

    const { jd } = await request.json()

    if (!jd) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 })
    }

    const analysis = await analyzeJobDescription(jd)
    return NextResponse.json({ analysis })
  } catch (err) {
    console.error('Analyzer error:', err)
    return NextResponse.json({ error: 'Failed to analyze job description' }, { status: 500 })
  }
}
