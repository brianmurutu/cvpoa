import { NextResponse } from 'next/server'
import { rewriteBullets } from '@/lib/ai'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { text } = await request.json()
    if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 })

    const rewritten = await rewriteBullets(text)
    return NextResponse.json({ text: rewritten })
  } catch (err) {
    console.error('Rewrite error:', err)
    return NextResponse.json({ error: 'Failed to rewrite text' }, { status: 500 })
  }
}
