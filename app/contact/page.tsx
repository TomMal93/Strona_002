import type { Metadata } from 'next'
import ContactHero from '@/components/pages/contact/ContactHero'
import { siteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: siteContent.contactPage.meta.title,
  description: siteContent.contactPage.meta.description,
}

export default function ContactPage() {
  return (
    <main data-responsive-sections>
      <ContactHero />
    </main>
  )
}
