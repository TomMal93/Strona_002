import type { MetadataRoute } from 'next'

const siteUrl = (process.env.SITE_URL ?? 'https://maleszyk.media').replace(/\/$/, '')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteUrl}/oferta`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/o-mnie`,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/polityka-prywatnosci`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]
}
