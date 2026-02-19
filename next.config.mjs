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

  // Konfiguracja Next.js Image — domeny zewnętrzne (np. Cloudinary)
  images: {
    remotePatterns: [
      // Odkomentuj i uzupełnij gdy będziesz używać Cloudinary lub innego CDN:
      // {
      //   protocol: 'https',
      //   hostname: 'res.cloudinary.com',
      //   pathname: '/twoj-cloud-name/**',
      // },
    ],
  },

  // Nagłówki bezpieczeństwa — dodawane do każdej odpowiedzi
  async headers() {
    return [
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
