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
        ],
      },
    ]
  },
}

export default nextConfig
