'use client'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="min-h-screen bg-black-deep text-warm-white px-6 py-16 flex items-center justify-center">
      <div className="w-full max-w-2xl border border-khaki/30 bg-black-deep/70 p-8 sm:p-10">
        <p className="font-inter text-xs uppercase tracking-[0.2em] text-khaki">500</p>
        <h1 className="mt-3 font-bebas text-5xl leading-none sm:text-6xl">Wystapil blad</h1>
        <p className="mt-4 font-inter text-base text-warm-white/85">
          Nie udalo sie poprawnie zaladowac tej strony. Sprobuj ponownie.
        </p>
        <p className="mt-2 font-inter text-sm text-warm-white/60 break-all">
          {error.message || 'Nieznany blad aplikacji.'}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="font-inter font-semibold text-sm uppercase tracking-widest px-6 py-3 bg-khaki text-black-deep transition-colors duration-300 hover:bg-military-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-khaki focus-visible:outline-offset-2"
          >
            Sprobuj ponownie
          </button>
          <a
            href="/"
            className="font-inter font-semibold text-sm uppercase tracking-widest px-6 py-3 border border-khaki text-khaki transition-colors duration-300 hover:bg-khaki hover:text-black-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-khaki focus-visible:outline-offset-2"
          >
            Wroc na start
          </a>
        </div>
      </div>
    </main>
  )
}
