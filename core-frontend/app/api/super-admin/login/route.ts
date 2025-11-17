/**
 * Super Admin Login API Route
 * Proxies login request to backend super-admin endpoint
 */
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${BACKEND_URL}/api/v1/super-admin/login`, {
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
        return NextResponse.json(
          { detail: text || 'Failed to parse response' },
          { status: response.status || 500 }
        )
      }
    } else {
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
    const role = data.role || 'super_admin'
    
    const nextResponse = NextResponse.json({ success: true, role })
    
    // Set secure, httpOnly cookie
    const isProduction = process.env.NODE_ENV === 'production'
    
    nextResponse.cookies.set('super_admin_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    
    nextResponse.cookies.set('super_admin_role', role, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    
    return nextResponse
  } catch (error: any) {
    console.error('Super admin login error:', error)
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

