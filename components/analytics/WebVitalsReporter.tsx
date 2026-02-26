'use client'

import { useReportWebVitals } from 'next/web-vitals'

const TRACKED_METRICS = new Set(['CLS', 'FCP', 'INP', 'LCP', 'TTFB'])

/**
 * Logs core web vitals in the browser and optionally forwards them via sendBeacon.
 * Configure endpoint with NEXT_PUBLIC_WEB_VITALS_ENDPOINT (e.g. /api/web-vitals).
 */
export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (!TRACKED_METRICS.has(metric.name)) return

    console.info('[WebVitals]', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      delta: metric.delta,
      navigationType: metric.navigationType,
    })

    const endpoint = process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT
    if (!endpoint || typeof navigator === 'undefined') return

    const payload = JSON.stringify({
      ...metric,
      pathname: window.location.pathname,
      timestamp: Date.now(),
    })

    navigator.sendBeacon(endpoint, payload)
  })

  return null
}
