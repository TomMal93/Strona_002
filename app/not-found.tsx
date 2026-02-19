import Button from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <main className="page-shell">
      <div className="page-panel">
        <p className="ui-overline">404</p>
        <h1 className="mt-3 font-bebas text-5xl leading-none sm:text-6xl">Nie znaleziono strony</h1>
        <p className="mt-4 font-inter text-base text-warm-white/85">
          Adres jest niepoprawny albo strona zostala przeniesiona.
        </p>
        <Button as="a" href="/" className="mt-8 inline-block">
          Wroc na strone glowna
        </Button>
      </div>
    </main>
  )
}
