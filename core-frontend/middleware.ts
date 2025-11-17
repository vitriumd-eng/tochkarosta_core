/**
 * Next.js Middleware - Tenant and module detection
 * Determines tenant from subdomain or token, sets active module
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Extract host and port
  const host = request.headers.get('host') || ''
  const port = host.includes(':') ? host.split(':')[1] : null
  const hostWithoutPort = host.split(':')[0]
  const parts = hostWithoutPort.split('.')
  
  // Platform dashboard should only be accessible on port 7001
  // Port 7000: public platform
  // Port 7001: auth + dashboard (platform-dashboard)
  // Port 7002: super-admin
  
  // Redirect root path on port 7001 to platform-dashboard
  if (pathname === '/' && port === '7001') {
    const protocol = request.nextUrl.protocol
    const redirectUrl = new URL('/platform-dashboard' + request.nextUrl.search, `${protocol}//${hostWithoutPort}:${port}`)
    return NextResponse.redirect(redirectUrl)
  }
  
  // Redirect root path on port 7002 to super-admin
  if (pathname === '/' && port === '7002') {
    const protocol = request.nextUrl.protocol
    const redirectUrl = new URL('/super-admin' + request.nextUrl.search, `${protocol}//${hostWithoutPort}:${port}`)
    return NextResponse.redirect(redirectUrl)
  }
  
  // Redirect /register to port 7001 (auth port)
  if (pathname.startsWith('/register')) {
    const expectedPort = '7001'
    if (port && port !== expectedPort) {
      const protocol = request.nextUrl.protocol
      const redirectUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, `${protocol}//${hostWithoutPort}:${expectedPort}`)
      return NextResponse.redirect(redirectUrl)
    }
  }
  
  if (pathname.startsWith('/platform-dashboard')) {
    const expectedPort = '7001'
    if (port && port !== expectedPort) {
      // Redirect to correct port if accessed from wrong port
      // Build URL with correct port
      const protocol = request.nextUrl.protocol
      const redirectUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, `${protocol}//${hostWithoutPort}:${expectedPort}`)
      return NextResponse.redirect(redirectUrl)
    }
  }
  
  if (pathname.startsWith('/super-admin')) {
    const expectedPort = '7002'
    if (port && port !== expectedPort) {
      // Redirect to correct port if accessed from wrong port
      // Build URL with correct port
      const protocol = request.nextUrl.protocol
      const redirectUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, `${protocol}//${hostWithoutPort}:${expectedPort}`)
      return NextResponse.redirect(redirectUrl)
    }
  }
  
  // Extract subdomain (handle localhost:port format like shop.localhost:7000)
  let subdomain: string | null = null
  if (parts.length > 1) {
    // Handle cases like "shop.localhost" or "shop.example.com"
    if (!['www', 'api', 'admin'].includes(parts[0])) {
      subdomain = parts[0]
    }
  } else if (parts.length === 1 && parts[0] !== 'localhost') {
    // Handle case like single subdomain (if configured)
    subdomain = parts[0]
  }
  
  // Extract correlation ID or generate new
  const correlationId = request.headers.get('X-Request-ID') || 
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  // Create response with correlation ID
  const response = NextResponse.next()
  response.headers.set('X-Request-ID', correlationId)
  
  // Store tenant info in request headers (accessible in server components)
  // Actual tenant/module data will be fetched in the page component
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
    response.headers.set('X-Tenant-Subdomain', subdomain)
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

