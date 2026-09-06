const isDev = process.env.NODE_ENV === 'development'

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
    // Next.js 16 wymaga jawnej listy wszystkich wartości przekazywanych przez `quality`.
    qualities: [68, 75, 85, 88],
    // Cache'uj zoptymalizowane obrazy przez 30 dni (domyślnie: 60 s)
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
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
    const securityHeaders = {
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
        ...(!isDev
          ? [
              {
                key: 'Strict-Transport-Security',
                value: 'max-age=63072000; includeSubDomains; preload',
              },
            ]
          : []),
      ],
    }

    // Dev: bez agresywnego cache, żeby uniknąć konfliktów chunków po rebuildach.
    if (isDev) return [securityHeaders]

    return [
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
      // Publiczne wideo — 30 dni, rewalidacja w tle
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      // Zasoby identyfikacji i podglądów społecznościowych — 30 dni.
      {
        source: '/:asset(og-image.jpg|favicon.ico|apple-touch-icon.png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      securityHeaders,
    ]
  },
}

export default nextConfig
