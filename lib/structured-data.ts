import { siteContent } from './site-content.ts'

export type PageSchemaType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage'

type PageStructuredDataInput = {
  path: string
  name: string
  description: string
  breadcrumbName: string
  type?: PageSchemaType
}

const siteUrl = (process.env.SITE_URL ?? 'https://maleszyk.media').replace(/\/$/, '')
const organizationName = process.env.AUTHOR_NAME ?? 'Maleszyk Media'
const personName = process.env.PERSON_NAME ?? 'Przemysław Maleszyk'
const personAlternateName = process.env.NEXT_PUBLIC_ABOUTME_HERO_NAME ?? 'Przemek Maleszyk'
const phone = process.env.NEXT_PUBLIC_ABOUTME_PHONE ?? '+48 791 705 230'
const email = process.env.NEXT_PUBLIC_ABOUTME_EMAIL ?? 'kontakt@maleszyk.media'

const socialProfiles = [
  process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK
    ?? 'https://www.facebook.com/profile.php?id=61557050460965',
  process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM
    ?? 'https://www.instagram.com/maleszyk.media/',
  process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE
    ?? 'https://www.youtube.com/@Maleszyk.V-log',
].filter((url) => url.startsWith('https://'))

const absoluteUrl = (path: string) => `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`

export const structuredDataIds = {
  organization: `${siteUrl}/#organization`,
  person: `${siteUrl}/#person`,
  website: `${siteUrl}/#website`,
  primaryImage: `${siteUrl}/#primaryimage`,
} as const

const areaServed = {
  '@type': 'Country',
  name: 'Polska',
  identifier: 'PL',
}

export function createSiteStructuredData() {
  const primaryImageUrl = absoluteUrl('/images/Hero.webp')

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': structuredDataIds.website,
        url: `${siteUrl}/`,
        name: organizationName,
        alternateName: ['Maleszyk.Media', 'maleszyk.media'],
        description: siteContent.seoDescription,
        inLanguage: 'pl-PL',
        publisher: { '@id': structuredDataIds.organization },
      },
      {
        '@type': 'Organization',
        '@id': structuredDataIds.organization,
        name: organizationName,
        alternateName: 'Maleszyk.Media',
        url: `${siteUrl}/`,
        description: siteContent.structuredDataDescription,
        email,
        telephone: phone,
        image: { '@id': structuredDataIds.primaryImage },
        sameAs: socialProfiles,
        founder: { '@id': structuredDataIds.person },
        areaServed,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'zapytania ofertowe',
          telephone: phone,
          email,
          areaServed: 'PL',
          availableLanguage: 'pl',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Usługi fotograficzne i filmowe',
          itemListElement: siteContent.services.items.map((service) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: service.title,
              description: service.description,
              url: absoluteUrl('/oferta'),
              provider: { '@id': structuredDataIds.organization },
              areaServed,
            },
          })),
        },
      },
      {
        '@type': 'Person',
        '@id': structuredDataIds.person,
        name: personName,
        alternateName: personAlternateName,
        url: absoluteUrl('/o-mnie'),
        image: absoluteUrl('/images/contact/contact.webp'),
        jobTitle: 'Fotograf i filmowiec',
        worksFor: { '@id': structuredDataIds.organization },
        knowsAbout: ['Fotografia', 'Produkcja filmowa', 'Montaż filmowy', 'Ujęcia z drona'],
      },
      {
        '@type': 'ImageObject',
        '@id': structuredDataIds.primaryImage,
        url: primaryImageUrl,
        contentUrl: primaryImageUrl,
        width: 1024,
        height: 1024,
        caption: `${organizationName} — fotografia i film`,
      },
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: `${siteUrl}/`,
        name: `Portfolio Fotograficzno-Wideo | ${organizationName}`,
        description: siteContent.seoDescription,
        isPartOf: { '@id': structuredDataIds.website },
        about: { '@id': structuredDataIds.organization },
        primaryImageOfPage: { '@id': structuredDataIds.primaryImage },
        inLanguage: 'pl-PL',
      },
    ],
  }
}

export function createPageStructuredData({
  path,
  name,
  description,
  breadcrumbName,
  type = 'WebPage',
}: PageStructuredDataInput) {
  const url = absoluteUrl(path)
  const breadcrumbId = `${url}#breadcrumb`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': type,
        '@id': `${url}#webpage`,
        url,
        name,
        description,
        isPartOf: { '@id': structuredDataIds.website },
        about: { '@id': structuredDataIds.organization },
        breadcrumb: { '@id': breadcrumbId },
        inLanguage: 'pl-PL',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Strona główna',
            item: `${siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: breadcrumbName,
            item: url,
          },
        ],
      },
    ],
  }
}
