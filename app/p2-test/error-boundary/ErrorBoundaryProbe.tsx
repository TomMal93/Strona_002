'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'p2:error-boundary'

export default function ErrorBoundaryProbe() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => setHydrated(true), [])

  if (hydrated && sessionStorage.getItem(STORAGE_KEY) === 'throw') {
    throw new Error('Kontrolowany błąd testowy P2')
  }

  return (
    <main id="main-content" className="page-shell">
      <div className="page-panel">
        <p className="ui-overline">TEST P2</p>
        <h1 className="mt-3 font-bebas text-5xl leading-none sm:text-6xl">
          Boundary 500 zresetowane
        </h1>
      </div>
    </main>
  )
}
