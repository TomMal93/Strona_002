import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createContentSecurityPolicy } from '@/lib/content-security-policy'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const contentSecurityPolicy = createContentSecurityPolicy({
    isDevelopment: process.env.NODE_ENV === 'development',
    nonce,
  })
  const requestHeaders = new Headers(request.headers)

  // Next.js odczytuje nonce z CSP żądania i dodaje go do własnych skryptów.
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicy)
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set('Content-Security-Policy', contentSecurityPolicy)

  return response
}

export const config = {
  matcher: [
    {
      source:
        '/((?!api|_next/static|_next/image|images/|videos/|favicon.ico|apple-touch-icon.png|og-image.jpg).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
