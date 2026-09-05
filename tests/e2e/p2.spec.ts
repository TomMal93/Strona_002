import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const routes = ['/', '/contact', '/o-mnie', '/oferta', '/polityka-prywatnosci'] as const

const viewports = [
  { name: '360x800', width: 360, height: 800 },
  { name: '375x667', width: 375, height: 667 },
  { name: '393x852', width: 393, height: 852 },
  { name: '412x915', width: 412, height: 915 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '667x375', width: 667, height: 375 },
  { name: '844x390', width: 844, height: 390 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '2560x1440', width: 2560, height: 1440 },
] as const

async function skipIntro(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem('intro:played:v1', '1'))
}

async function visit(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
  expect(response?.status(), route).toBe(route === '/nieistniejaca-strona' ? 404 : 200)
  await expect(page.locator('#main-content')).toBeVisible()
  await page.waitForTimeout(80)
}

type FocusTarget = { id: string; label: string }

async function getTabOrder(page: Page, includeNativeMedia: boolean): Promise<FocusTarget[]> {
  return page.evaluate((shouldIncludeNativeMedia) => {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ]
    if (shouldIncludeNativeMedia) selectors.push('audio', 'video')
    const selector = selectors.join(',')
    const isVisible = (element: HTMLElement) => {
      const style = getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number.parseFloat(style.opacity) > 0
        && rect.width > 0
        && rect.height > 0
        && !element.closest('[aria-hidden="true"], [inert]')
    }
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(selector))
      .filter(isVisible)
      .map((element, domIndex) => ({ element, domIndex, tabIndex: element.tabIndex }))
      .filter(({ tabIndex }) => tabIndex >= 0)
      .sort((left, right) => {
        const leftPositive = left.tabIndex > 0
        const rightPositive = right.tabIndex > 0
        if (leftPositive && rightPositive) return left.tabIndex - right.tabIndex || left.domIndex - right.domIndex
        if (leftPositive) return -1
        if (rightPositive) return 1
        return left.domIndex - right.domIndex
      })

    return candidates.map(({ element }, index) => {
      const id = `p2-focus-${index}`
      element.dataset.p2FocusId = id
      return {
        id,
        label: element.getAttribute('aria-label')
          ?? element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80)
          ?? element.tagName,
      }
    })
  }, includeNativeMedia)
}

async function expectVisibleKeyboardFocus(page: Page, route: string, target: FocusTarget) {
  const focus = await page.evaluate(() => {
    const element = document.activeElement as HTMLElement | null
    if (!element) return null
    const style = getComputedStyle(element)
    return {
      id: element.dataset.p2FocusId ?? '',
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
      boxShadow: style.boxShadow,
    }
  })
  expect(focus?.id, `${route}: aktywny element „${target.label}”`).toBe(target.id)
  const hasOutline = focus?.outlineStyle !== 'none' && (focus?.outlineWidth ?? 0) >= 1
  const hasBoxShadow = Boolean(focus?.boxShadow && focus.boxShadow !== 'none')
  expect(hasOutline || hasBoxShadow, `${route}: widoczny fokus „${target.label}”`).toBe(true)
}

test.describe('P2 — macierz RWD i horizontal overflow', () => {
  test.beforeEach(async ({ page }) => skipIntro(page))

  for (const viewport of viewports) {
    test(`${viewport.name}: wszystkie trasy mieszczą się w viewport`, async ({ page }) => {
      await page.setViewportSize(viewport)

      for (const route of routes) {
        await visit(page, route)
        const dimensions = await page.evaluate(() => ({
          innerWidth: window.innerWidth,
          rootScrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
        }))

        expect.soft(dimensions.rootScrollWidth, `${route} root @ ${viewport.name}`).toBeLessThanOrEqual(dimensions.innerWidth + 1)
        expect.soft(dimensions.bodyScrollWidth, `${route} body @ ${viewport.name}`).toBeLessThanOrEqual(dimensions.innerWidth + 1)
      }
    })
  }
})

test.describe('P2 — menu mobilne i klawiatura', () => {
  test.beforeEach(async ({ page }) => skipIntro(page))

  test('menu landscape mieści się, przewija i zatrzymuje tło', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 })
    await visit(page, '/')

    const toggle = page.getByRole('button', { name: 'Otwórz menu' })
    await toggle.click()
    const dialog = page.getByRole('dialog', { name: 'Menu mobilne' })
    await expect(dialog).toBeVisible()
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')

    const geometry = await dialog.evaluate((element) => {
      element.scrollTop = element.scrollHeight
      const rect = element.getBoundingClientRect()
      return {
        bottom: rect.bottom,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        scrollTop: element.scrollTop,
      }
    })
    expect(geometry.bottom).toBeLessThanOrEqual(376)
    expect(geometry.clientHeight).toBeLessThanOrEqual(315)
    expect(geometry.scrollHeight).toBeGreaterThanOrEqual(geometry.clientHeight)
    if (geometry.scrollHeight > geometry.clientHeight) expect(geometry.scrollTop).toBeGreaterThan(0)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(page.getByRole('button', { name: 'Otwórz menu' })).toBeFocused()
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')
  })

  test('focus pozostaje w menu i zawija się w obie strony', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 })
    await visit(page, '/')
    await page.getByRole('button', { name: 'Otwórz menu' }).click()

    const dialog = page.getByRole('dialog', { name: 'Menu mobilne' })
    await expect(dialog).toBeVisible()
    const links = dialog.getByRole('link')
    const count = await links.count()
    expect(count).toBeGreaterThan(1)

    await links.last().focus()
    await page.keyboard.press('Tab')
    await expect(links.first()).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(links.last()).toBeFocused()
  })

  for (const route of routes) {
    test(`${route}: pełny porządek Tab i Shift+Tab jest logiczny, a fokus widoczny`, async ({ browserName, page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await visit(page, route)

      const positiveTabIndexes = await page.locator('[tabindex]').evaluateAll((elements) => (
        elements
          .map((element) => Number(element.getAttribute('tabindex')))
          .filter((tabIndex) => tabIndex > 0)
      ))
      expect(positiveTabIndexes, `${route}: brak ręcznie wymuszonej kolejności`).toEqual([])

      const tabOrder = await getTabOrder(page, browserName === 'firefox')
      expect(tabOrder.length, `${route}: liczba elementów w kolejności klawiatury`).toBeGreaterThan(4)
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())

      for (const target of tabOrder) {
        await page.keyboard.press('Tab')
        await expectVisibleKeyboardFocus(page, route, target)
      }

      for (let index = tabOrder.length - 2; index >= 0; index -= 1) {
        await page.keyboard.press('Shift+Tab')
        await expectVisibleKeyboardFocus(page, route, tabOrder[index])
      }
    })

    test(`${route}: Enter uruchamia link pomijający`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await visit(page, route)
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
      await page.keyboard.press('Tab')
      await expect(page.getByRole('link', { name: 'Przejdź do treści' })).toBeFocused()
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(new RegExp(`${route === '/' ? '/' : route}#main-content$`))
    })
  }

  test('Space otwiera menu, a Escape je zamyka i zwraca fokus', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 })
    await visit(page, '/')
    const toggle = page.getByRole('button', { name: 'Otwórz menu' })
    await toggle.focus()
    await page.keyboard.press('Space')
    await expect(page.getByRole('dialog', { name: 'Menu mobilne' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Menu mobilne' })).toBeHidden()
    await expect(toggle).toBeFocused()
  })
})

test.describe('P2 — ustawienia dostępności', () => {
  test.beforeEach(async ({ page }) => skipIntro(page))

  test('prefers-reduced-motion wyłącza Lenis i zachowuje treść', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 })
    await visit(page, '/')
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)
    expect(await page.locator('html').evaluate((element) => element.classList.contains('lenis'))).toBe(false)
    await expect(page.locator('#hero')).toBeVisible()
    await expect(page.locator('#cta')).toBeAttached()
  })

  for (const route of routes) {
    test(`${route}: tekst 200% nie powoduje poziomego overflow`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 })
      await visit(page, route)
      await page.locator('html').evaluate((element) => { element.style.fontSize = '200%' })
      await page.waitForTimeout(50)
      const widths = await page.evaluate(() => ({
        viewport: innerWidth,
        root: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }))
      expect.soft(widths.root, `${route} root`).toBeLessThanOrEqual(widths.viewport + 1)
      expect.soft(widths.body, `${route} body`).toBeLessThanOrEqual(widths.viewport + 1)
      await expect(page.locator('main h1, main h2').first()).toBeVisible()
    })
  }

  for (const route of ['/oferta', '/contact'] as const) {
    test(`${route}: wariant wydruku ukrywa nawigację i multimedia`, async ({ page }) => {
      await visit(page, route)
      await page.emulateMedia({ media: 'print' })
      await expect(page.locator('header')).toBeHidden()
      await expect(page.locator('footer')).toBeHidden()
      const videos = page.locator('video')
      for (let index = 0; index < await videos.count(); index += 1) {
        await expect(videos.nth(index)).toBeHidden()
      }
      expect(await page.locator('body').evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgb(255, 255, 255)')
    })
  }
})

test.describe('P2 — WCAG 2.1 AA', () => {
  test.beforeEach(async ({ page }) => skipIntro(page))

  for (const route of routes) {
    test(`${route}: brak automatycznie wykrywalnych naruszeń`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await visit(page, route)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      expect(results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        targets: violation.nodes.map((node) => node.target),
      }))).toEqual([])
    })
  }
})

test.describe('P2 — zachowania runtime', () => {
  for (const viewport of [
    { name: 'mobile', width: 360, height: 800 },
    { name: 'desktop', width: 1440, height: 900 },
  ]) {
    test(`boundary 500: reset i responsywność — ${viewport.name}`, async ({ context, page }) => {
      await page.setViewportSize(viewport)
      await context.setExtraHTTPHeaders({ 'x-p2-error-probe': '1' })
      await page.addInitScript(() => sessionStorage.setItem('p2:error-boundary', 'throw'))
      await page.goto('/p2-test/error-boundary', { waitUntil: 'domcontentloaded' })

      await expect(page.getByRole('heading', { name: 'Wystąpił błąd' })).toBeVisible()
      const widths = await page.evaluate(() => ({
        viewport: innerWidth,
        root: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }))
      expect.soft(widths.root).toBeLessThanOrEqual(widths.viewport + 1)
      expect.soft(widths.body).toBeLessThanOrEqual(widths.viewport + 1)

      await page.evaluate(() => sessionStorage.removeItem('p2:error-boundary'))
      await page.getByRole('button', { name: 'Spróbuj ponownie' }).click()
      await expect(page.getByRole('heading', { name: 'Boundary 500 zresetowane' })).toBeVisible()
      await expect(page.locator('#main-content')).toBeVisible()

      await context.setExtraHTTPHeaders({})
      const guardedResponse = await page.goto('/p2-test/error-boundary', { waitUntil: 'domcontentloaded' })
      expect(guardedResponse?.status()).toBe(404)
      await expect(page.getByRole('heading', { name: 'Nie znaleziono strony' })).toBeVisible()
    })
  }

  test('preloader odblokowuje scroll, uruchamia się raz w sesji i ponownie w świeżym kontekście', async ({ browser }) => {
    const firstContext = await browser.newContext({ reducedMotion: 'no-preference' })
    const firstPage = await firstContext.newPage()
    await firstPage.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(firstPage.locator('[data-intro-overlay]')).toBeVisible()
    await expect(firstPage.locator('[data-intro-overlay]')).toBeHidden({ timeout: 4_000 })
    expect(await firstPage.evaluate(() => sessionStorage.getItem('intro:played:v1'))).toBe('1')
    await expect.poll(() => firstPage.evaluate(() => ({
      bodyLocked: document.body.classList.contains('intro-active'),
      lenisStopped: document.documentElement.classList.contains('lenis-stopped'),
    }))).toEqual({ bodyLocked: false, lenisStopped: false })
    const initialScrollY = await firstPage.evaluate(() => scrollY)
    await firstPage.mouse.wheel(0, 900)
    await expect.poll(() => firstPage.evaluate(() => scrollY)).toBeGreaterThan(initialScrollY)
    await firstPage.reload({ waitUntil: 'domcontentloaded' })
    await expect(firstPage.locator('[data-intro-overlay]')).toBeHidden()
    await expect(firstPage.locator('body')).not.toHaveClass(/intro-active/)
    await firstContext.close()

    const freshContext = await browser.newContext({ reducedMotion: 'reduce' })
    const freshPage = await freshContext.newPage()
    await freshPage.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(freshPage.locator('[data-intro-overlay]')).toBeVisible()
    await freshContext.close()
  })

  test('SectionRail ujawnia się, ustawia aktywną sekcję i obsługuje hash', async ({ page }) => {
    await skipIntro(page)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, '/')
    const rail = page.getByRole('navigation', { name: 'Nawigacja sekcji' })
    await page.evaluate(() => scrollTo(0, innerHeight * 0.3))
    await expect(rail).toBeVisible()
    await rail.getByRole('link', { name: 'FAQ' }).click()
    await expect(page).toHaveURL(/#faq$/)
    await expect(rail.getByRole('link', { name: 'FAQ' })).toHaveAttribute('aria-current', 'true')
    await page.setViewportSize({ width: 1404, height: 900 })
    await expect(rail).toBeHidden()
    await page.setViewportSize({ width: 1405, height: 900 })
    await expect(rail).toBeVisible()
  })

  test('404 jest responsywne i zawiera działający powrót', async ({ page }) => {
    await skipIntro(page)
    await page.setViewportSize({ width: 360, height: 800 })
    await visit(page, '/nieistniejaca-strona')
    await expect(page.getByRole('heading', { name: 'Nie znaleziono strony' })).toBeVisible()
    await page.getByRole('link', { name: /Wróć na stronę główną/i }).click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('YouTubeFacade tworzy iframe dopiero po kliknięciu', async ({ page }) => {
    await skipIntro(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, '/')
    expect(await page.locator('iframe[src*="youtube-nocookie.com"]').count()).toBe(0)
    const facade = page.locator('button[aria-label^="Odtwórz:"]:visible').first()
    await facade.scrollIntoViewIfNeeded()
    await facade.click()
    const frame = page.locator('iframe[src*="youtube-nocookie.com"]').first()
    await expect(frame).toBeAttached()
    await expect(frame).toHaveAttribute('src', /autoplay=1/)
  })

  test('mobilne karuzele reagują na swipe i przyciski', async ({ browser, browserName }) => {
    const context = await browser.newContext({
      baseURL: 'http://localhost:3000',
      hasTouch: true,
      isMobile: true,
      reducedMotion: 'reduce',
      viewport: { width: 393, height: 852 },
    })
    const page = await context.newPage()
    await skipIntro(page)
    await visit(page, '/')

    const services = page.getByRole('navigation', { name: 'Nawigacja oferty' })
    await services.scrollIntoViewIfNeeded()
    await expect(services.getByRole('button', { name: 'Karta oferty 1' })).toHaveAttribute('aria-current', 'true')
    await services.getByRole('button', { name: 'Następna karta oferty' }).click()
    await expect(services.getByRole('button', { name: 'Karta oferty 2' })).toHaveAttribute('aria-current', 'true')

    if (browserName !== 'chromium') {
      await context.close()
      return
    }

    const carousel = services.locator('xpath=..').locator(':scope > div').first()
    const box = await carousel.boundingBox()
    expect(box).not.toBeNull()
    if (box) {
      const client = await context.newCDPSession(page)
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: box.x + box.width * 0.8, y: box.y + box.height / 2 }],
      })
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: box.x + box.width * 0.2, y: box.y + box.height / 2 }],
      })
      await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    }
    await expect(services.getByRole('button', { name: 'Karta oferty 3' })).toHaveAttribute('aria-current', 'true')
    await context.close()
  })

  test('Fast 3G i Slow 3G zachowują dostępność głównej treści', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'Emulacja parametrów sieci korzysta z CDP Chromium')
    test.setTimeout(90_000)
    await skipIntro(page)
    const client = await context.newCDPSession(page)

    for (const profile of [
      { name: 'Fast 3G', latency: 150, downloadThroughput: 200_000, uploadThroughput: 93_750 },
      { name: 'Slow 3G', latency: 400, downloadThroughput: 62_500, uploadThroughput: 62_500 },
    ]) {
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: profile.latency,
        downloadThroughput: profile.downloadThroughput,
        uploadThroughput: profile.uploadThroughput,
      })
      await visit(page, '/')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    }
  })

  test('pierwsza i kolejna wizyta działają przy Slow 3G', async ({ browser, browserName }) => {
    test.skip(browserName !== 'chromium', 'Emulacja parametrów sieci korzysta z CDP Chromium')
    test.setTimeout(90_000)
    const context = await browser.newContext({ baseURL: 'http://localhost:3000', reducedMotion: 'reduce' })
    const page = await context.newPage()
    const client = await context.newCDPSession(page)
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 400,
      downloadThroughput: 62_500,
      uploadThroughput: 62_500,
    })

    await visit(page, '/')
    await expect(page.locator('[data-intro-overlay]')).toBeHidden({ timeout: 45_000 })
    expect(await page.evaluate(() => sessionStorage.getItem('intro:played:v1'))).toBe('1')
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.locator('[data-intro-overlay]')).toBeHidden()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await context.close()
  })

  test('mobilne Hero od początku wyświetla i odtwarza wideo bez postera', async ({ page }) => {
    await skipIntro(page)
    await page.setViewportSize({ width: 393, height: 852 })
    await visit(page, '/')

    const heroVideo = page.locator('#hero video[src="/videos/hero/hero-video.mp4"]')
    await expect(heroVideo).toBeVisible()
    await expect(heroVideo).toHaveAttribute('autoplay', '')
    await expect(heroVideo).toHaveAttribute('playsinline', '')
    await expect(heroVideo).toHaveAttribute('preload', 'auto')
    await expect(heroVideo).not.toHaveAttribute('poster', /.+/)
    await expect(page.locator('#hero img[src*="hero-video-poster"]')).toHaveCount(0)
    await expect.poll(() => heroVideo.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0)
  })

  test('Save-Data zachowuje treść i pobiera tylko wymagane wideo Hero', async ({ browser, browserName }) => {
    test.skip(browserName !== 'chromium', 'Kontrola nagłówka Save-Data jest wykonywana w Chromium')
    const context = await browser.newContext({
      baseURL: 'http://localhost:3000',
      extraHTTPHeaders: { 'Save-Data': 'on' },
      reducedMotion: 'reduce',
      viewport: { width: 393, height: 852 },
    })
    const page = await context.newPage()
    const videoRequests: string[] = []
    let documentSaveData = ''
    page.on('request', (request) => {
      if (request.resourceType() === 'document') documentSaveData = request.headers()['save-data'] ?? ''
      if (request.resourceType() === 'media' || request.url().includes('/videos/')) videoRequests.push(request.url())
    })
    await skipIntro(page)
    await visit(page, '/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(documentSaveData).toBe('on')
    expect(videoRequests.length).toBeGreaterThan(0)
    expect(videoRequests.every((url) => url.includes('/videos/hero/hero-video.mp4'))).toBe(true)
    await context.close()
  })
})
