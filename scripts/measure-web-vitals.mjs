import { spawn } from 'node:child_process'
import { chromium } from '@playwright/test'

const PORT = 3006
const BASE_URL = `http://127.0.0.1:${PORT}`

console.log('Starting production Next.js server on port', PORT, '...')
const server = spawn('npx', ['next', 'start', '-p', String(PORT), '-H', '127.0.0.1'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'production' },
})

for (let i = 0; i < 20; i++) {
  try {
    const res = await fetch(BASE_URL)
    if (res.status === 200) break
  } catch {}
  await new Promise((r) => setTimeout(r, 500))
}

const browser = await chromium.launch({ headless: true })

async function measureProfile(name, viewport, throttling) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: 'no-preference',
  })
  const page = await context.newPage()

  if (throttling) {
    const client = await page.context().newCDPSession(page)
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    })
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  }

  // Measure Web Vitals
  await page.goto(BASE_URL, { waitUntil: 'load' })
  await page.waitForTimeout(1500)

  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      let fcp = 0
      let lcp = 0
      let cls = 0

      const perfEntries = performance.getEntriesByType('paint')
      for (const entry of perfEntries) {
        if (entry.name === 'first-contentful-paint') {
          fcp = entry.startTime
        }
      }

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          lcp = entry.startTime
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true })

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += entry.value
          }
        }
      }).observe({ type: 'layout-shift', buffered: true })

      setTimeout(() => {
        const nav = performance.getEntriesByType('navigation')[0]
        resolve({
          ttfb: Math.round(nav?.responseStart - nav?.requestStart || 0),
          domContentLoaded: Math.round(nav?.domContentLoadedEventEnd || 0),
          load: Math.round(nav?.loadEventEnd || 0),
          fcp: Math.round(fcp),
          lcp: Math.round(lcp),
          cls: parseFloat(cls.toFixed(3)),
        })
      }, 500)
    })
  })

  await context.close()
  return { profile: name, ...metrics }
}

const measurements = []
// Desktop measurements (3 runs)
for (let i = 1; i <= 3; i++) {
  const m = await measureProfile(`Desktop Run ${i}`, { width: 1440, height: 900 }, false)
  measurements.push(m)
}

// Mobile measurements (3 runs with Fast 3G + CPU x4 throttling)
for (let i = 1; i <= 3; i++) {
  const m = await measureProfile(`Mobile Run ${i} (Fast 3G + CPUx4)`, { width: 375, height: 667 }, true)
  measurements.push(m)
}

console.log('\nWeb Vitals measurements on Production Build:\n')
console.table(measurements)

await browser.close()
server.kill('SIGTERM')
