/**
 * API Route - Activate module (new flow with internal registration)
 */
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    
    // Build headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Request-ID': request.headers.get('X-Request-ID') || '',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${backendUrl}/api/v1/modules/activate`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.detail || 'Failed to activate module' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Activate module error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


