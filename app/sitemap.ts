import type { MetadataRoute } from 'next'

const siteUrl = (process.env.SITE_URL ?? 'https://maleszyk.media').replace(/\/$/, '')
const lastModified = process.env.SITE_LAST_MODIFIED ?? '2026-09-06'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteUrl}/oferta`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/o-mnie`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/polityka-prywatnosci`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]
}
