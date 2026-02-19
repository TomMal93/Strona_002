'use client'

import Button from '@/components/ui/Button'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="page-shell">
      <div className="page-panel">
        <p className="ui-overline">500</p>
        <h1 className="mt-3 font-bebas text-5xl leading-none sm:text-6xl">Wystapil blad</h1>
        <p className="mt-4 font-inter text-base text-warm-white/85">
          Nie udalo sie poprawnie zaladowac tej strony. Sprobuj ponownie.
        </p>
        <p className="mt-2 font-inter text-sm text-warm-white/60 break-all">
          {error.message || 'Nieznany blad aplikacji.'}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={reset}
          >
            Sprobuj ponownie
          </Button>
          <Button
            as="a"
            href="/"
            variant="outline"
          >
            Wroc na start
          </Button>
        </div>
      </div>
    </main>
  )
}
