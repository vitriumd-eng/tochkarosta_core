/**
 * Platform Dashboard - Content API Route
 * Proxies content requests to backend
 */
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    // Always use public endpoint for hero_banner (public content, no auth required)
    // This ensures video is always available regardless of token status
    let response: Response
    try {
      const endpoint = `${BACKEND_URL}/api/v1/platform/content/public`
      
      response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })
    } catch (fetchError: unknown) {
      // If backend is not available, return empty content instead of 500
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error'
      console.error('Backend connection error:', errorMessage)
      return NextResponse.json({}, { status: 200 })
    }

    // Read response as text first, then try to parse as JSON
    const text = await response.text()
    const contentType = response.headers.get('content-type')
    let data: unknown
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = JSON.parse(text)
      } catch (jsonError) {
        // If JSON parsing fails, return empty content instead of error
        console.error('JSON parse error:', jsonError)
        return NextResponse.json({}, { status: 200 })
      }
    } else {
      // Response is not JSON, return empty content
      console.error('Unexpected response format:', contentType)
      return NextResponse.json({}, { status: 200 })
    }

    if (!response.ok) {
      // For public access, return empty content instead of error
      console.error('Backend error:', response.status, data)
      return NextResponse.json({}, { status: 200 })
    }

    return NextResponse.json(data)
  } catch (error: unknown) {
    // For public access, return empty content instead of 500
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('API route error:', errorMessage)
    return NextResponse.json({}, { status: 200 })
  }
}

