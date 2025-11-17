/**
 * Platform Dashboard - Login API Route
 * Proxies login request to backend
 */
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    let body: any
    try {
      body = await request.json()
    } catch (jsonError) {
      return NextResponse.json(
        { detail: 'Invalid request body. Expected JSON.' },
        { status: 400 }
      )
    }

    if (!body || !body.login || !body.password) {
      return NextResponse.json(
        { detail: 'Missing login or password' },
        { status: 400 }
      )
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/platform/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
        { detail: data.detail || data.message || 'Login failed' },
        { status: response.status }
      )
    }

    // Set HttpOnly Secure Cookie for token
    const token = data.token
    const role = data.role || 'platform_master'
    
    const nextResponse = NextResponse.json({ success: true, role })
    
    // Set secure, httpOnly cookie
    // In production, set secure: true (requires HTTPS)
    const isProduction = process.env.NODE_ENV === 'production'
    
    nextResponse.cookies.set('platform_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    
    nextResponse.cookies.set('platform_role', role, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    
    return nextResponse
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

