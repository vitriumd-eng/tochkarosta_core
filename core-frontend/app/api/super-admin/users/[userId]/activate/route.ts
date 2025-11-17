/**
 * Super Admin Activate User API Route
 */
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('super_admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { detail: 'Unauthorized' },
        { status: 401 }
      )
    }

    const response = await fetch(
      `${BACKEND_URL}/api/v1/super-admin/users/${params.userId}/activate`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || 'Failed to activate user' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Super admin activate user error:', error)
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}




