/**
 * Request Code API Route
 * Forwards request-code requests to backend
 */
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('X-Request-ID') || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const startTime = Date.now()
  
  console.log('[API] /api/auth/request-code - Request received', {
    requestId,
    method: 'POST',
    url: request.url,
    timestamp: new Date().toISOString(),
  })
  
  try {
    const body = await request.json()
    console.log('[API] /api/auth/request-code - Request body', {
      requestId,
      body,
      channel: body.channel,
      identifier: body.identifier,
      identifierLength: body.identifier?.length,
    })
    
    const backendUrl = `${BACKEND_URL}/api/v1/auth/request_code`
    console.log('[API] /api/auth/request-code - Forwarding to backend', {
      requestId,
      backendUrl,
      method: 'POST',
    })
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    })

    const duration = Date.now() - startTime
    console.log('[API] /api/auth/request-code - Backend response', {
      requestId,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      duration: `${duration}ms`,
      headers: Object.fromEntries(response.headers.entries()),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to request code'
      let errorData: any = null
      
      try {
        errorData = await response.json()
        errorMessage = errorData.detail || errorData.error || errorMessage
        console.error('[API] /api/auth/request-code - Backend error response', {
          requestId,
          status: response.status,
          errorData,
          errorMessage,
        })
      } catch (parseError) {
        errorMessage = response.statusText || errorMessage
        console.error('[API] /api/auth/request-code - Failed to parse error response', {
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
    console.log('[API] /api/auth/request-code - Success', {
      requestId,
      data,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
    
    return NextResponse.json(data)
  } catch (error: unknown) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    console.error('[API] /api/auth/request-code - Exception', {
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
