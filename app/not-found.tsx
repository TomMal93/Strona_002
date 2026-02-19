import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-black-deep text-warm-white px-6 py-16 flex items-center justify-center">
      <div className="w-full max-w-2xl border border-khaki/30 bg-black-deep/70 p-8 sm:p-10">
        <p className="font-inter text-xs uppercase tracking-[0.2em] text-khaki">404</p>
        <h1 className="mt-3 font-bebas text-5xl leading-none sm:text-6xl">Nie znaleziono strony</h1>
        <p className="mt-4 font-inter text-base text-warm-white/85">
          Adres jest niepoprawny albo strona zostala przeniesiona.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block font-inter font-semibold text-sm uppercase tracking-widest px-6 py-3 bg-khaki text-black-deep transition-colors duration-300 hover:bg-military-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-khaki focus-visible:outline-offset-2"
        >
          Wroc na strone glowna
        </Link>
      </div>
    </main>
  )
}
