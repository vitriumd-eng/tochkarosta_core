/**
 * Platform Dashboard - Image Upload API Route
 * Handles image uploads for platform content sections
 */
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'
const UPLOAD_DIR = join(process.cwd(), 'public', 'platform', 'uploads')

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
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

    // Check authentication with backend
    const authCheck = await fetch(`${BACKEND_URL}/api/v1/platform/content`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!authCheck.ok) {
      return NextResponse.json(
        { detail: 'Authentication failed' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { detail: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type (images and videos)
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return NextResponse.json(
        { detail: 'File must be an image or video' },
        { status: 400 }
      )
    }

    // Validate file size (max 50MB for videos, 10MB for images)
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024)
      return NextResponse.json(
        { detail: `File size must be less than ${maxSizeMB}MB` },
        { status: 400 }
      )
    }

    await ensureUploadDir()

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomStr}.${extension}`
    const filepath = join(UPLOAD_DIR, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return URL path (relative to public folder)
    const url = `/platform/uploads/${filename}`

    return NextResponse.json({
      url,
      filename,
      size: file.size,
      type: file.type
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { detail: error.message || 'Failed to upload image' },
      { status: 500 }
    )
  }
}

