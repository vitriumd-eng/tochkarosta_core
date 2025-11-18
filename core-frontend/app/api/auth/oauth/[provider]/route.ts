/**
 * OAuth Gateway API Route
 * Forwards OAuth requests to backend /api/v1/auth/oauth/{provider}
 * Gateway must validate endpoint existence in core OpenAPI before forwarding
 */
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const body = await request.json()
    const provider = body.provider || params.provider
    
    // Normalize payload: external_id as string, signature present
    const payload = {
      provider,
      external_id: String(body.external_id),
      username: body.username || null,
      first_name: body.first_name || null,
      last_name: body.last_name || null,
      signature: body.signature
    }
    
    // Gateway must validate endpoint existence in core OpenAPI before forwarding
    // In production, validate against real openapi.json
    const CORE_URL = process.env.CORE_URL || process.env.BACKEND_URL || 'http://localhost:8000'
    const endpoint = `${CORE_URL}/api/v1/auth/oauth/${provider}`
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    const json = await response.json()
    return NextResponse.json(json, { status: response.status })
  } catch (err) {
    return NextResponse.json({ detail: String(err) }, { status: 500 })
  }
}
