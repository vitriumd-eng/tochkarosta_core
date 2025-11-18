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
    
    // Gateway must always forward to /send-code endpoint (according to OpenAPI)
    // If request has channel/identifier, we need to convert it to phone
    // For now, we'll forward phone requests directly, and reject channel/identifier
    // TODO: Implement proper conversion: Telegram-ID → phone (requires OAuth or user lookup)
    
    // Helper function to normalize phone to E.164
    function normalizePhone(phone: string): string {
      // Remove all non-digit characters except +
      let normalized = phone.replace(/[^\d+]/g, '')
      // If doesn't start with +, assume Russian format and add +7
      if (!normalized.startsWith('+')) {
        if (normalized.startsWith('8')) {
          normalized = '+7' + normalized.substring(1)
        } else if (normalized.startsWith('7')) {
          normalized = '+' + normalized
        } else {
          normalized = '+7' + normalized
        }
      }
      return normalized
    }
    
    const hasPhone = body.phone !== undefined;
    const hasChannel = body.channel !== undefined && body.identifier !== undefined;
    
    let backendUrl: string;
    let requestBody: any;
    
    // Gateway: normalize payload and validate endpoint exists in OpenAPI
    // Payload normalization: phone to E.164, provider to lower-case
    if (hasPhone) {
      // Phone-based registration: use send-code endpoint
      const provider = body.provider || 'telegram' // Default to telegram
      backendUrl = `${BACKEND_URL}/api/v1/auth/send-code`
      // Normalize: phone to E.164 format, provider to lowercase
      requestBody = { 
        phone: normalizePhone(body.phone),
        provider: provider.toLowerCase()
      }
    } else if (hasChannel) {
      // Legacy channel/identifier format - convert to phone+provider
      // For Telegram/MAX, identifier is phone
      backendUrl = `${BACKEND_URL}/api/v1/auth/send-code`
      requestBody = {
        phone: normalizePhone(body.identifier),
        provider: body.channel.toLowerCase()
      }
    } else {
      // Default to send-code for backward compatibility
      backendUrl = `${BACKEND_URL}/api/v1/auth/send-code`
      requestBody = body
    }
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
      body: JSON.stringify(requestBody),
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
