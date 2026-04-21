import type { Metadata } from 'next'
import { siteContent } from '@/lib/site-content'
import OfertaHero from '@/components/pages/oferta/OfertaHero'
import OfertaServices from '@/components/pages/oferta/OfertaServices'
import OfertaCta from '@/components/pages/oferta/OfertaCta'

export const metadata: Metadata = {
  title: siteContent.offerPage.meta.title,
  description: siteContent.offerPage.meta.description,
}

export default function OfertaPage() {
  return (
    <main>
      <OfertaHero />
      <OfertaServices />
      <OfertaCta />
    </main>
  )
}
