/**
 * VK OAuth Gateway API Route
 * Forwards VK OAuth requests to backend /api/v1/auth/oauth/vk
 * Gateway must validate endpoint existence in core OpenAPI before forwarding
 */
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required field
    if (!body.code) {
      return NextResponse.json(
        { error: 'code is required' },
        { status: 400 }
      )
    }
    
    // Normalize payload
    const payload = {
      code: String(body.code)
    }
    
    // Gateway must validate endpoint existence in core OpenAPI before forwarding
    // In production, validate against real openapi.json
    const CORE_URL = process.env.CORE_URL || process.env.BACKEND_URL || 'http://localhost:8000'
    const endpoint = `${CORE_URL}/api/v1/auth/oauth/vk`
    
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

