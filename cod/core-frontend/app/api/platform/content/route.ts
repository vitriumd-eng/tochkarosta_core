/**
 * Platform Dashboard - Content API Route
 * Proxies content requests to backend
 */
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    // Try to get token from cookie first, then from Authorization header
    const tokenFromCookie = request.cookies.get('platform_token')?.value
    const authHeader = request.headers.get('Authorization')
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    
    const token = tokenFromCookie || tokenFromHeader
    
    if (!token) {
      return NextResponse.json(
        { detail: 'Authentication required. Token not found in cookies or Authorization header.' },
        { status: 401 }
      )
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/platform/content`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    // Read response as text first, then try to parse as JSON
    const text = await response.text()
    const contentType = response.headers.get('content-type')
    let data: any
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = JSON.parse(text)
      } catch (jsonError) {
        // If JSON parsing fails, return text as error
        return NextResponse.json(
          { detail: text || 'Failed to parse response' },
          { status: response.status || 500 }
        )
      }
    } else {
      // Response is not JSON, return text as error
      return NextResponse.json(
        { detail: text || 'Unexpected response format' },
        { status: response.status || 500 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || data.message || 'Request failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

