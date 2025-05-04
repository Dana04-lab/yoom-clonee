// app/api/token/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { StreamClient } from '@stream-io/node-sdk'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!
const apiSecret = process.env.STREAM_SECRET_KEY!

const client = new StreamClient(apiKey, apiSecret)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  try {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60
    const iat = Math.floor(Date.now() / 1000) - 60

    const token = client.createToken(userId, exp, iat)
    return NextResponse.json({ token })
  } catch (err) {
    console.error('Token generation error:', err)
    return NextResponse.json({ error: 'Token generation failed' }, { status: 500 })
  }
}
