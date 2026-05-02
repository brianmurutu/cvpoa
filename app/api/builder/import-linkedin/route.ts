import { NextResponse } from 'next/server'
import { importLinkedIn } from '@/lib/ai'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'File is required' }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Parse PDF
    const pdfParse = require('pdf-parse')
    const data = await pdfParse(buffer)
    if (!data.text) return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 })

    const profile = await importLinkedIn(data.text)
    return NextResponse.json({ profile })
  } catch (err) {
    console.error('LinkedIn import error:', err)
    return NextResponse.json({ error: 'Failed to import profile' }, { status: 500 })
  }
}
