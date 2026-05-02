import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/server'

const PLAN_DURATIONS: Record<string, number> = {
  quick: 1,        // 1 hour
  standard: 3,     // 3 hours
  business: 24,    // 24 hours
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const secret = process.env.PAYSTACK_SECRET_KEY
    if (!secret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Verify Paystack Signature
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex')
    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)

    // Process Successful Charge
    if (event.event === 'charge.success') {
      const data = event.data
      const reference = data.reference
      const metadata = data.metadata || {}
      const plan_id = metadata.plan_id
      const user_id = metadata.user_id

      if (!reference || !plan_id || !user_id) {
        // Return 200 so Paystack stops retrying, but log the error
        console.error('Paystack webhook: Missing reference, plan_id or user_id in payload', metadata)
        return NextResponse.json({ received: true })
      }

      const admin = createAdminClient()
      const hours = PLAN_DURATIONS[plan_id] ?? 1
      const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()

      const { error } = await admin.from('access_grants').insert({
        user_id,
        plan_id,
        reference,
        expires_at: expiresAt,
      })

      if (error) {
        if (error.code === '23505') {
          // Already verified by the frontend verify endpoint, perfectly fine.
          return NextResponse.json({ received: true, note: 'Already processed' })
        }
        console.error('Paystack webhook: Error inserting access grant', error)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Paystack webhook error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
