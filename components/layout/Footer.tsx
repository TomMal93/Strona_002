import Link from 'next/link'
import { siteContent } from '@/lib/site-content'

type SocialPlatform = 'youtube' | 'facebook' | 'instagram' | 'whatsapp' | 'messenger'

const socialIcons: Record<SocialPlatform, React.ReactElement> = {
  youtube: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  ),
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  whatsapp: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.76.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.35.19 1.86.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35zM12 2a10 10 0 0 0-8.54 15.18L2 22l4.94-1.42A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-2.93.84.86-2.85-.2-.31A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  ),
  messenger: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.36 2 2 6.26 2 11.7c0 2.84 1.2 5.31 3.16 7.01V22l2.89-1.59c.77.21 1.58.33 2.45.38h.08l.11.01c.43.02.87.02 1.31 0 .77 0 1.51-.07 2.22-.2A10.32 10.32 0 0 0 22 11.7C22 6.26 17.64 2 12 2zm.9 13.08-2.62-2.79-5.1 2.79 5.61-5.96 2.68 2.79 5.04-2.79-5.61 5.96z" />
    </svg>
  ),
}

const platformLabels: Record<SocialPlatform, string> = {
  youtube: 'YouTube',
  facebook: 'Facebook',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  messenger: 'Messenger',
}

const socialLinkClassName = [
  'inline-flex h-9 w-9 items-center justify-center rounded-micro',
  'text-warm-gray transition-[color,transform] duration-200 md:duration-300',
  'hover:text-khaki md:hover:-translate-y-0.5',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-khaki',
].join(' ')

export default function Footer() {
  const year = new Date().getFullYear()
  const socials = siteContent.hero.social as ReadonlyArray<{ platform: SocialPlatform; href: string }>

  return (
    <footer className="section-dark-bg border-t border-warm-gray/10 px-6 py-8 lg:px-20">
      <div className="mx-auto flex max-w-content flex-col items-center gap-4 text-center md:grid md:grid-cols-3 md:gap-6">
        <Link
          href="/#hero"
          className="font-bebas text-lg sm:text-xl uppercase tracking-heading text-warm-white transition-colors duration-200 hover:text-khaki focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-khaki md:justify-self-start"
        >
          MALESZYK
          <span className="text-[#c8503c]">.</span>
          <span className="bg-[linear-gradient(130deg,rgb(var(--c-warm))_0%,rgb(255_238_175)_45%,rgb(var(--c-gold))_100%)] bg-clip-text text-transparent">
            MEDIA
          </span>
        </Link>

        <div className="flex flex-col items-center gap-1.5 md:justify-self-center">
          <ul className="flex items-center gap-1">
            {socials.map(({ platform, href }) => (
              <li key={platform}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platformLabels[platform]}
                  className={socialLinkClassName}
                >
                  <span className="h-4 w-4 [&>svg]:h-full [&>svg]:w-full">
                    {socialIcons[platform]}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="whitespace-nowrap font-inter text-[10px] text-warm-gray sm:text-xs">
            © {year} Maleszyk.Media · Wszelkie prawa zastrzeżone
          </p>
        </div>

        <div className="flex flex-col items-center gap-1 font-inter text-[10px] text-warm-gray sm:text-xs md:items-end md:justify-self-end -translate-y-1 md:-translate-y-2">
          <Link
            href="/polityka-prywatnosci"
            className="text-warm-gray/70 underline underline-offset-2 transition-colors hover:text-khaki"
          >
            Polityka prywatności i RODO
          </Link>
        </div>
      </div>
    </footer>
  )
}
