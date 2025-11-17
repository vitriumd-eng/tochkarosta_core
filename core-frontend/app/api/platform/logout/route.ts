/**
 * Platform Dashboard - Logout API Route
 * Clears authentication cookies
 */
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out' })
  
  // Clear authentication cookies
  response.cookies.set('platform_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Immediately expire
    path: '/',
  })
  
  response.cookies.set('platform_role', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Immediately expire
    path: '/',
  })
  
  return response
}

