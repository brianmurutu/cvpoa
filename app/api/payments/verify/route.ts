import { NextResponse } from 'next/server'
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase'

const PLAN_DURATIONS: Record<string, number> = {
  quick: 1,        // 1 hour
  standard: 3,     // 3 hours
  business: 24,    // 24 hours
}

export async function POST(request: Request) {
  try {
    const { reference, plan_id } = await request.json()

    if (!reference || !plan_id) {
      return NextResponse.json({ error: 'Missing reference or plan_id' }, { status: 400 })
    }

    // 1. Get authenticated user
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Verify payment with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const verifyData = await verifyRes.json()

    if (!verifyData.status || verifyData.data?.status !== 'success') {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // 3. Grant access using admin client (bypasses RLS)
    const admin = createAdminClient()
    const hours = PLAN_DURATIONS[plan_id] ?? 1
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()

    const { error } = await admin.from('access_grants').insert({
      user_id: user.id,
      plan_id,
      reference,
      expires_at: expiresAt,
    })

    if (error) {
      // Handle duplicate reference (already verified)
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already verified' })
      }
      throw error
    }

    return NextResponse.json({ success: true, expires_at: expiresAt })
  } catch (err) {
    console.error('Payment verification error:', err)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}
