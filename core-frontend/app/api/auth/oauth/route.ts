/**
 * OAuth Gateway API Route
 * Forwards OAuth requests to backend /api/v1/auth/oauth/{provider}
 * Gateway must validate endpoint existence in core OpenAPI before forwarding
 */
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { provider?: string } }
) {
  const requestId = request.headers.get('X-Request-ID') || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const startTime = Date.now()
  
  console.log('[API] /api/auth/oauth - Request received', {
    requestId,
    method: 'POST',
    url: request.url,
    timestamp: new Date().toISOString(),
  })
  
  try {
    const body = await request.json()
    console.log('[API] /api/auth/oauth - Request body', {
      requestId,
      body,
      provider: body.provider,
      external_id: body.external_id,
    })
    
    // Validate required fields
    if (!body.provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      )
    }
    
    if (!body.external_id) {
      return NextResponse.json(
        { error: 'external_id is required' },
        { status: 400 }
      )
    }
    
    if (!body.signature) {
      return NextResponse.json(
        { error: 'signature is required' },
        { status: 400 }
      )
    }
    
    // Validate provider
    if (!['telegram', 'max'].includes(body.provider)) {
      return NextResponse.json(
        { error: 'Provider must be telegram or max' },
        { status: 400 }
      )
    }
    
    // Normalize payload: external_id as string, signature present
    const normalizedPayload = {
      provider: body.provider,
      external_id: String(body.external_id), // Ensure string
      username: body.username || null,
      first_name: body.first_name || null,
      last_name: body.last_name || null,
      signature: body.signature
    }
    
    // Gateway must validate endpoint existence in core OpenAPI before forwarding
    // In production, validate against real openapi.json
    // For now, we assume endpoint exists if provider is valid
    const provider = normalizedPayload.provider
    const backendUrl = `${BACKEND_URL}/api/v1/auth/oauth/${provider}`
    
    console.log('[API] /api/auth/oauth - Forwarding to backend', {
      requestId,
      backendUrl,
      method: 'POST',
      provider,
    })
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
      },
      credentials: 'include',
      body: JSON.stringify(normalizedPayload),
    })

    const duration = Date.now() - startTime
    console.log('[API] /api/auth/oauth - Backend response', {
      requestId,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      duration: `${duration}ms`,
      headers: Object.fromEntries(response.headers.entries()),
    })

    if (!response.ok) {
      let errorMessage = 'OAuth authentication failed'
      let errorData: any = null
      
      try {
        errorData = await response.json()
        errorMessage = errorData.detail || errorData.error || errorMessage
        console.error('[API] /api/auth/oauth - Backend error response', {
          requestId,
          status: response.status,
          errorData,
          errorMessage,
        })
      } catch (parseError) {
        errorMessage = response.statusText || errorMessage
        console.error('[API] /api/auth/oauth - Failed to parse error response', {
          requestId,
          status: response.status,
          statusText: response.statusText,
          parseError: parseError instanceof Error ? parseError.message : String(parseError),
        })
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[API] /api/auth/oauth - Success', {
      requestId,
      data: {
        ...data,
        access_token: data.access_token ? `${data.access_token.substring(0, 20)}...` : undefined,
        refresh_token: data.refresh_token ? `${data.refresh_token.substring(0, 20)}...` : undefined,
      },
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
    
    return NextResponse.json(data)
  } catch (error: unknown) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    console.error('[API] /api/auth/oauth - Exception', {
      requestId,
      error: error,
      errorMessage,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

