/**
 * Super Admin Logout API Route
 */
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  
  // Delete super admin cookies
  cookieStore.delete('super_admin_token')
  cookieStore.delete('super_admin_role')
  
  return NextResponse.json({ success: true })
}




