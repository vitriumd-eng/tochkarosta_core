/**
 * API Route - List available modules
 */
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Try to get token from Authorization header first, then from cookie
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '') || (await cookies()).get('platform_token')?.value

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    
    // Build headers - include token if available, but don't require it
    // Module list is public information and should work even without valid token
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Request-ID': request.headers.get('X-Request-ID') || '',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${backendUrl}/api/v1/modules/list`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to list modules' }))
      return NextResponse.json(
        { error: errorData.detail || errorData.error || 'Failed to list modules' },
        { status: response.status }
      )
    }

    const data = await response.json()
    // Backend returns {modules: [...]}, return it as is
    return NextResponse.json(data)
  } catch (error) {
    console.error('List modules error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

