import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Security headers
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

// Rate limiting storage
const rateLimit = new Map<string, { count: number; resetTime: number }>()

function applyRateLimit(request: NextRequest): boolean {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 1000 // requests per window

  // Clean up old entries
  for (const [key, value] of rateLimit.entries()) {
    if (value.resetTime < now) {
      rateLimit.delete(key)
    }
  }

  const current = rateLimit.get(ip)

  if (!current) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (current.resetTime < now) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (current.count >= maxRequests) {
    return false
  }

  current.count++
  return true
}

export default withAuth(
  function middleware(request) {
    // Apply rate limiting
    if (!applyRateLimit(request)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        { 
          status: 429, 
          headers: { 'Content-Type': 'application/json', ...securityHeaders } 
        }
      )
    }

    // Apply security headers
    const response = NextResponse.next()
    
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Log access attempts for audit
    if (request.nextUrl.pathname.startsWith('/api/')) {
      console.log(`API Access: ${request.method} ${request.nextUrl.pathname} from ${request.ip || 'unknown'}`)
    }

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page and API auth routes
        if (req.nextUrl.pathname.startsWith('/api/auth/') || req.nextUrl.pathname === '/login') {
          return true
        }
        
        // Require token for protected routes
        return !!token
      }
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/students/:path*',
    '/teachers/:path*',
    '/attendance/:path*',
    '/classes/:path*',
    '/api/((?!auth).)*',
  ]
}