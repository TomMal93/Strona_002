import Image from 'next/image'
import { siteContent } from '@/lib/site-content'
import styles from './About.module.css'

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-dark-bg px-6 py-20 sm:py-24 lg:px-20 lg:py-28"
    >
      <div className="relative z-10 mx-auto max-w-content">
        <header className="mx-auto max-w-3xl text-center">
          <h2
            id="about-heading"
            className="mt-3 font-bebas text-[38px] uppercase leading-[0.9] md:text-[64px]"
          >
            <span className={styles.heroHeadingText}>{siteContent.about.title}</span>
          </h2>
          <span aria-hidden="true" className={styles.titleAccent} />
        </header>

        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          <article className={styles.textColumn}>
            <h3 className="font-bebas text-[30px] uppercase leading-[1.0] tracking-wide text-warm-white">
              Działam w dynamice
            </h3>
            <p className="mt-4 font-inter text-[15px] leading-relaxed text-warm-gray">
              Pracuję tam, gdzie plan wydarzenia zmienia się z minuty na minutę. Szybko reaguję i łapię kadry wtedy,
              kiedy naprawdę się dzieją.
            </p>
            <p className="mt-3 font-inter text-[15px] leading-relaxed text-white/80">
              To podejście sprawdza się zarówno w terenie, jak i podczas rodzinnych uroczystości.
            </p>
          </article>

          <div className={styles.imageFrame}>
            <Image
              src="/images/about_me_001.webp"
              alt={siteContent.about.imageAlt}
              width={720}
              height={1080}
              className={styles.imageMedia}
              sizes="(min-width: 1024px) 26vw, (min-width: 640px) 55vw, 92vw"
            />
          </div>

          <article className={styles.textColumn}>
            <h3 className="font-bebas text-[30px] uppercase leading-[1.0] tracking-wide text-warm-white">
              Emocje i detale
            </h3>
            <p className="mt-4 font-inter text-[15px] leading-relaxed text-warm-gray">
              Zależy mi, żeby materiał oddawał atmosferę, a nie tylko poprawną technikę. Pokazuję relacje, gesty,
              energię i klimat miejsca.
            </p>
            <p className="mt-3 font-inter text-[15px] leading-relaxed text-white/80">
              Dostajesz gotowe zdjęcia i ujęcia, które możesz od razu wykorzystać na stronie i w social media.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
