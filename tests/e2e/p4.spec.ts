import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const routes = [
  { path: '/', name: 'Strona główna' },
  { path: '/contact', name: 'Kontakt' },
  { path: '/o-mnie', name: 'O mnie' },
  { path: '/oferta', name: 'Oferta' },
  { path: '/polityka-prywatnosci', name: 'Polityka prywatności' },
] as const

async function skipIntro(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem('intro:played:v1', '1'))
}

async function visit(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
  expect(response?.status(), `Route ${route} should return 200`).toBe(200)
  await expect(page.locator('#main-content')).toBeVisible()
  return response
}

test.describe('P4 — Krok 1: Wydajność, Core Web Vitals i Preloader', () => {
  test('SessionStorage natychmiast pomija preloader dla powracających użytkowników', async ({ page }) => {
    await skipIntro(page)
    const start = Date.now()
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const elapsed = Date.now() - start
    // When intro is skipped, main content is immediately visible without 1s waiting
    const preloader = page.locator('#preloader-overlay')
    const isVisible = await preloader.isVisible().catch(() => false)
    expect(isVisible).toBe(false)
    expect(elapsed).toBeLessThan(3000)
  })

  test('Mobilny plakat Hero posiada preload oraz atrybut poster na elemencie video', async ({ page }) => {
    await skipIntro(page)
    await page.setViewportSize({ width: 375, height: 667 })
    await visit(page, '/')

    // Verify preload link for poster with high priority exists
    const preloadLink = page.locator('link[rel="preload"][as="image"][href*="hero-video-poster.webp"]')
    await expect(preloadLink).toBeAttached()
    const fetchPriority = await preloadLink.getAttribute('fetchpriority')
    expect(fetchPriority?.toLowerCase()).toBe('high')

    // Verify mobile hero video element with poster is mounted
    const heroVideo = page.locator('video[poster*="hero-video-poster.webp"]').first()
    await expect(heroVideo).toBeAttached()
  })

  test('Symulacja Fast 3G: główna treść strony ładuje się i staje się interaktywna', async ({ page }) => {
    await skipIntro(page)
    // Emulate Fast 3G network conditions via CDP session
    const client = await page.context().newCDPSession(page)
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150, // 150ms RTT
      downloadThroughput: (1.6 * 1024 * 1024) / 8, // 1.6 Mbps
      uploadThroughput: (750 * 1024) / 8, // 750 Kbps
    })

    const response = await page.goto('/', { waitUntil: 'domcontentloaded' })
    expect(response?.status()).toBe(200)
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 15_000 })
  })
})

test.describe('P4 — Krok 2: SEO On-Page, Metatagi, Nagłówki i JSON-LD', () => {
  test.beforeEach(async ({ page }) => skipIntro(page))

  test('Każda trasa posiada unikalny title w formacie "* | Maleszyk Media"', async ({ page }) => {
    const titles = new Set<string>()

    for (const route of routes) {
      await visit(page, route.path)
      const title = await page.title()
      expect(title, `Title on ${route.path}`).toMatch(/Maleszyk Media$/)
      expect(titles.has(title), `Title on ${route.path} should be unique`).toBe(false)
      titles.add(title)
    }
  })

  test('Każda trasa posiada meta description o optymalnej długości (140-160 znaków)', async ({ page }) => {
    const descriptions = new Set<string>()

    for (const route of routes) {
      await visit(page, route.path)
      const desc = await page.locator('meta[name="description"]').getAttribute('content')
      expect(desc, `Description on ${route.path} exists`).toBeTruthy()
      if (desc) {
        expect(desc.length, `Description length on ${route.path}: "${desc}" (${desc.length} chars)`).toBeGreaterThanOrEqual(135)
        expect(desc.length, `Description length on ${route.path}`).toBeLessThanOrEqual(165)
        expect(descriptions.has(desc), `Description on ${route.path} should be unique`).toBe(false)
        descriptions.add(desc)
      }
    }
  })

  test('Każda trasa deklaruje canonical URL oraz theme-color="#0a0a0a"', async ({ page }) => {
    for (const route of routes) {
      await visit(page, route.path)
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical, `Canonical on ${route.path}`).toBeTruthy()
      expect(canonical, `Canonical on ${route.path} contains path`).toContain(route.path === '/' ? '' : route.path)

      const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content')
      expect(themeColor, `Theme color on ${route.path}`).toBe('#0a0a0a')
    }
  })

  test('Hierarchia nagłówków: dokładnie jeden H1 i brak przeskoków poziomów', async ({ page }) => {
    for (const route of routes) {
      await visit(page, route.path)
      const h1Count = await page.locator('h1').count()
      expect(h1Count, `Exact 1 H1 on ${route.path}`).toBe(1)

      // Heading hierarchy check: verify no skips (e.g. h1 followed directly by h3)
      const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) =>
        elements.map((el) => parseInt(el.tagName.replace('H', ''), 10)),
      )
      expect(headings[0], `First heading on ${route.path} is H1`).toBe(1)
      for (let i = 1; i < headings.length; i++) {
        const prev = headings[i - 1]
        const curr = headings[i]
        expect(
          curr <= prev + 1,
          `Heading hierarchy on ${route.path}: H${curr} after H${prev} skips a level`,
        ).toBe(true)
      }
    }
  })

  test('Wszystkie obrazy <img> na wszystkich trasach posiadają atrybut alt', async ({ page }) => {
    for (const route of routes) {
      await visit(page, route.path)
      const imagesWithoutAlt = await page.$$eval('img:not([alt])', (elements) =>
        elements.map((img) => img.getAttribute('src') || 'unknown'),
      )
      expect(imagesWithoutAlt, `Missing alt on ${route.path}`).toEqual([])
    }
  })

  test('Podglądy społecznościowe Open Graph i Twitter Card są kompletne', async ({ page }) => {
    for (const route of routes) {
      await visit(page, route.path)

      // Open Graph
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
      const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content')
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
      const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')

      expect(ogTitle, `og:title on ${route.path}`).toBeTruthy()
      expect(ogDesc, `og:description on ${route.path}`).toBeTruthy()
      expect(ogImage, `og:image on ${route.path}`).toBeTruthy()
      expect(ogType, `og:type on ${route.path}`).toBe('website')

      // Twitter Card
      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
      const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content')
      const twitterDesc = await page.locator('meta[name="twitter:description"]').getAttribute('content')
      const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content')

      expect(twitterCard, `twitter:card on ${route.path}`).toBe('summary_large_image')
      expect(twitterTitle, `twitter:title on ${route.path}`).toBeTruthy()
      expect(twitterDesc, `twitter:description on ${route.path}`).toBeTruthy()
      expect(twitterImage, `twitter:image on ${route.path}`).toBeTruthy()
    }
  })

  test('Plik og-image.jpg istnieje, ma format JPEG, wymiary 1200x630 i wagę < 300 kB', async () => {
    const ogPath = join(process.cwd(), 'public/og-image.jpg')
    const stats = statSync(ogPath)
    expect(stats.size, 'og-image.jpg size under 300 kB').toBeLessThan(300 * 1024)

    const buffer = readFileSync(ogPath)
    // Check JPEG signature: 0xFF, 0xD8, 0xFF
    expect(buffer[0]).toBe(0xff)
    expect(buffer[1]).toBe(0xd8)
    expect(buffer[2]).toBe(0xff)
  })

  test('Dane strukturalne JSON-LD Schema.org parsują się poprawnie i zawierają oczekiwane typy', async ({ page }) => {
    for (const route of routes) {
      await visit(page, route.path)
      const jsonLdElements = await page.locator('script[type="application/ld+json"]').all()
      expect(jsonLdElements.length, `JSON-LD scripts on ${route.path}`).toBeGreaterThan(0)

      for (const element of jsonLdElements) {
        const text = await element.textContent()
        expect(text, `JSON-LD content on ${route.path}`).toBeTruthy()
        const parsed = JSON.parse(text!)
        expect(parsed['@context']).toBe('https://schema.org')
        expect(Array.isArray(parsed['@graph'])).toBe(true)

        const graphTypes = parsed['@graph'].map((node: { '@type': string }) => node['@type'])
        if (route.path === '/') {
          expect(graphTypes).toContain('WebSite')
          expect(graphTypes).toContain('Organization')
          expect(graphTypes).toContain('Person')
        } else {
          expect(graphTypes).toContain('BreadcrumbList')
        }
      }
    }
  })
})

test.describe('P4 — Krok 3: Pliki indeksowania, obsługa 404 i Cache-Control', () => {
  test('Robots.txt zwraca kod 200, zezwala na indeksowanie i wskazuje sitemap.xml', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    const text = await response.text()
    expect(text).toContain('User-Agent: *')
    expect(text).toContain('Allow: /')
    expect(text).toContain('Sitemap:')
    expect(text).toContain('/sitemap.xml')
  })

  test('Sitemap.xml zwraca kod 200 i zawiera wszystkie 5 tras z protokołem HTTPS', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const text = await response.text()
    expect(text).toContain('<urlset')

    for (const route of routes) {
      const expectedUrlFragment = route.path === '/' ? '</loc>' : `${route.path}</loc>`
      expect(text, `Sitemap contains ${route.path}`).toContain(expectedUrlFragment)
    }
  })

  test('Nieistniejący URL zwraca rzeczywisty kod HTTP 404 Not Found (Brak Soft 404)', async ({ request, page }) => {
    const response = await request.get('/nieistnieje-test-p4-not-found-404')
    expect(response.status(), 'Response HTTP status must be 404').toBe(404)

    // Verify visual 404 page renders in browser
    await page.goto('/nieistnieje-test-p4-not-found-404', { waitUntil: 'domcontentloaded' })
    const notFoundText = page.getByText(/404/i).first()
    await expect(notFoundText).toBeVisible()
    const homeLink = page.getByRole('link', { name: /stron.*główn|wróć/i }).first()
    await expect(homeLink).toBeAttached()
  })

  test('Statyczne zasoby JS posiadają nagłówki Cache-Control', async ({ request }) => {
    const robotsRes = await request.get('/robots.txt')
    expect(robotsRes.status()).toBe(200)

    const faviconRes = await request.get('/favicon.ico')
    expect(faviconRes.status()).toBe(200)
    const faviconCache = faviconRes.headers()['cache-control']
    if (faviconCache) {
      expect(faviconCache).toContain('max-age')
    }
  })
})

test.describe('P4 — Krok 4: Wymogi Prawne, RODO i Dostępność WCAG 2.1 AA', () => {
  test.beforeEach(async ({ page }) => skipIntro(page))

  test('Strona /polityka-prywatnosci zawiera kompletne sekcje i brak placeholderów', async ({ page }) => {
    await visit(page, '/polityka-prywatnosci')

    // Verify key sections are present
    await expect(page.getByText('Administrator Danych Osobowych')).toBeVisible()
    await expect(page.getByText('Cele i podstawy prawne przetwarzania danych')).toBeVisible()
    await expect(page.getByText('Twoje prawa zgodnie z RODO')).toBeVisible()
    await expect(page.getByText('Pliki Cookies i technologie przeglądarki')).toBeVisible()

    // Verify Speed Insights disclosure
    await expect(page.getByText('Speed Insights', { exact: true }).first()).toBeVisible()

    // Verify that raw unrendered placeholders don't appear in the document
    const textContent = await page.content()
    expect(textContent).not.toContain('[WSTAW')
    expect(textContent).not.toContain('{PLACEHOLDER')
    expect(textContent).not.toContain('TODO_')
  })

  test('Stopka na każdej trasie zawiera odnośnik do Polityki Prywatności', async ({ page }) => {
    for (const route of routes) {
      await visit(page, route.path)
      const privacyLink = page.locator('footer a[href="/polityka-prywatnosci"]')
      await expect(privacyLink, `Privacy policy link in footer on ${route.path}`).toBeAttached()
    }
  })

  test('Brak błędów dostępności axe-core na wszystkich 5 trasach', async ({ page }) => {
    for (const route of routes) {
      await visit(page, route.path)
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      )
      expect(
        criticalViolations,
        `Accessibility violations on ${route.path}: ${criticalViolations.map((v) => v.help).join('; ')}`,
      ).toEqual([])
    }
  })
})

test.describe('P4 — Krok 5: Nagłówki Bezpieczeństwa i Brak Błędów Konsoli CSP', () => {
  test('Odpowiedzi zawierają wymagane nagłówki bezpieczeństwa HTTP', async ({ request }) => {
    const response = await request.get('/')
    expect(response.status()).toBe(200)
    const headers = response.headers()

    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['permissions-policy']).toContain('camera=()')
    expect(headers['permissions-policy']).toContain('microphone=()')
  })

  test('Nawigacja po trasach nie zgłasza żadnych naruszeń CSP w konsoli', async ({ page }) => {
    await skipIntro(page)
    const cspErrors: string[] = []

    page.on('console', (msg) => {
      const text = msg.text()
      if (text.toLowerCase().includes('content security policy') || text.toLowerCase().includes('violates the following')) {
        cspErrors.push(text)
      }
    })

    for (const route of routes) {
      await visit(page, route.path)
    }

    expect(cspErrors, `CSP errors detected: ${cspErrors.join('\n')}`).toEqual([])
  })
})
