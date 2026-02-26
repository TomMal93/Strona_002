const isDev = process.env.NODE_ENV === 'development'

const contentSecurityPolicy = `
  default-src 'self';
  base-uri 'self';
  frame-ancestors 'none';
  form-action 'self';
  object-src 'none';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data: https:;
  connect-src 'self' https:${isDev ? ' ws: wss:' : ''};
  media-src 'self' data: blob: https:;
`
  .replace(/\s{2,}/g, ' ')
  .trim()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ukryj nagłówek "X-Powered-By: Next.js"
  poweredByHeader: false,
  // Włącz kompresję odpowiedzi (gzip/brotli zależnie od środowiska serwera)
  compress: true,

  // Konfiguracja Next.js Image
  images: {
    // Serwuj AVIF (priority) i WebP — znacząco mniejsze pliki niż PNG/JPEG
    formats: ['image/avif', 'image/webp'],
    // Cache'uj zoptymalizowane obrazy przez 30 dni (domyślnie: 60 s)
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      // Odkomentuj i uzupełnij gdy będziesz używać Cloudinary lub innego CDN:
      // {
      //   protocol: 'https',
      //   hostname: 'res.cloudinary.com',
      //   pathname: '/twoj-cloud-name/**',
      // },
    ],
  },

  // Nagłówki HTTP — cache dla statycznych zasobów + bezpieczeństwo
  async headers() {
    return [
      // Statyczne pliki Next.js (JS/CSS bundles) — immutable, 1 rok
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Fonty z next/font (self-hosted w _next/static/media) — immutable, 1 rok
      {
        source: '/_next/static/media/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Zoptymalizowane obrazy Next Image — cache 30 dni + SWR
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      // Publiczne obrazy — 30 dni, rewalidacja w tle
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
        ],
      },
    ]
  },
}

export default nextConfig
