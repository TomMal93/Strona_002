import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import ErrorBoundaryProbe from './ErrorBoundaryProbe'

export const dynamic = 'force-dynamic'

export default async function ErrorBoundaryProbePage() {
  const requestHeaders = await headers()
  if (process.env.NODE_ENV === 'production' || requestHeaders.get('x-p2-error-probe') !== '1') {
    notFound()
  }

  return <ErrorBoundaryProbe />
}
