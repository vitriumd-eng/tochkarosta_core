import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', detail: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', detail: 'Token is required' },
        { status: 401 }
      )
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/tenants/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return NextResponse.json(
          { error: data.detail || data.error || 'Failed to fetch tenant', status: response.status },
          { status: response.status }
        )
      }
      
      return NextResponse.json(data, { status: response.status })
    } catch (fetchError: any) {
      // Network error or backend not available
      if (fetchError.message?.includes('fetch') || fetchError.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { error: 'Backend service unavailable', detail: 'Не удалось подключиться к серверу. Убедитесь, что backend запущен на порту 8000.' },
          { status: 503 }
        )
      }
      throw fetchError
    }
  } catch (error: any) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error', detail: error.message },
      { status: 500 }
    )
  }
}

