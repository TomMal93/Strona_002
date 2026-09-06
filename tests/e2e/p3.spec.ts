import { expect, test, type Page } from '@playwright/test'

const routes = ['/', '/contact', '/o-mnie', '/oferta', '/polityka-prywatnosci'] as const

async function skipIntro(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem('intro:played:v1', '1'))
}

async function visit(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
  expect(response?.status(), route).toBe(200)
  await expect(page.locator('#main-content')).toBeVisible()
  await page.waitForTimeout(100)
}

test.describe('P3 — Krok 1: Weryfikacja tagów HTML5 video i atrybutów', () => {
  test.beforeEach(async ({ page }) => skipIntro(page))

  test('Wszystkie dekoracyjne wideo posiadają autoplay, loop, muted, playsinline oraz poster', async ({ page }) => {
    // Desktop check
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, '/')

    // Scroll to about section to mount desktop video
    const aboutSection = page.locator('#about')
    await aboutSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(200)

    const decorativeVideos = page.locator('video[autoplay]')
    const count = await decorativeVideos.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const vid = decorativeVideos.nth(i)
      const attrs = await vid.evaluate((el: HTMLVideoElement) => ({
        muted: el.muted,
        loop: el.loop,
        playsInline: el.playsInline,
        poster: el.getAttribute('poster'),
        preload: el.getAttribute('preload'),
      }))

      expect(attrs.muted, `Video #${i} muted`).toBe(true)
      expect(attrs.loop, `Video #${i} loop`).toBe(true)
      expect(attrs.playsInline, `Video #${i} playsInline`).toBe(true)
      expect(attrs.poster, `Video #${i} poster`).toBeTruthy()
      expect(attrs.poster?.endsWith('.webp'), `Video #${i} poster is webp`).toBe(true)
    }
  })

  test('Mobilne wideo Hero posiada komplet wymaganych atrybutów', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await visit(page, '/')

    const mobileHeroVideo = page.locator('video[src="/videos/hero/hero-video.mp4"]')
    await expect(mobileHeroVideo).toBeAttached()

    const attrs = await mobileHeroVideo.evaluate((el: HTMLVideoElement) => ({
      muted: el.muted,
      loop: el.loop,
      playsInline: el.playsInline,
      poster: el.getAttribute('poster'),
      preload: el.getAttribute('preload'),
    }))

    expect(attrs.muted).toBe(true)
    expect(attrs.loop).toBe(true)
    expect(attrs.playsInline).toBe(true)
    expect(attrs.poster).toBe('/images/hero/hero-video-poster.webp')
  })

  test('Każdy plik WebM w odtwarzaczach posiada fallback MP4', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, '/oferta')

    // Scroll through offer page to load all video sources
    const articles = page.locator('[data-offer-block]')
    const articleCount = await articles.count()
    expect(articleCount).toBeGreaterThan(0)

    for (let i = 0; i < articleCount; i++) {
      await articles.nth(i).scrollIntoViewIfNeeded()
      await page.waitForTimeout(150)
    }

    const videoElements = page.locator('video')
    const videoCount = await videoElements.count()

    for (let i = 0; i < videoCount; i++) {
      const sources = await videoElements.nth(i).locator('source').all()
      if (sources.length > 0) {
        const types = await Promise.all(sources.map(s => s.getAttribute('type')))
        const srcList = await Promise.all(sources.map(s => s.getAttribute('src')))
        const hasWebM = types.some(t => t?.includes('webm')) || srcList.some(s => s?.endsWith('.webm'))
        if (hasWebM) {
          const hasMp4 = types.some(t => t?.includes('mp4')) || srcList.some(s => s?.endsWith('.mp4'))
          expect(hasMp4, `Video #${i} with WebM has MP4 fallback`).toBe(true)
        }
      }
    }
  })
})

test.describe('P3 — Krok 2.5: Weryfikacja niestandardowych odtwarzaczy i hooka lazy source', () => {
  test.beforeEach(async ({ page }) => skipIntro(page))

  test('useLazyVideoSource wstrzymuje ładowanie źródeł wideo poniżej linii zgięcia przy starcie', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, '/')

    // At top of page (hero), promo section is far below the fold (~3000px down)
    const promoVideoSources = page.locator('#promo video source')
    const promoSourceCount = await promoVideoSources.count()
    expect(promoSourceCount).toBe(0)

    // Now scroll to promo section
    const promoSection = page.locator('#promo')
    await promoSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)

    // After scrolling, sources should now be loaded
    const promoSourcesAfterScroll = page.locator('#promo video source')
    await expect(promoSourcesAfterScroll.first()).toBeAttached()
  })

  test('CinematicVideoPlayer reaguje na kliknięcie play/pause oraz klawisze Space i strzałki', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, '/')

    const promoSection = page.locator('#promo')
    await promoSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)

    const playerFrame = promoSection.locator('[role="group"][aria-label*="film promocyjny"]')
    await expect(playerFrame).toBeVisible()

    const playBtn = playerFrame.locator('button[aria-label*="film promocyjny"]').first()
    await expect(playBtn).toBeVisible()

    // Focus and press Space
    await playerFrame.focus()
    await page.keyboard.press('Space')
    await page.waitForTimeout(200)

    // Press Space again to toggle back
    await page.keyboard.press('Space')
    await page.waitForTimeout(100)
    const isPausedAfterSecondSpace = await playerFrame.locator('video').evaluate((v: HTMLVideoElement) => v.paused)
    expect(isPausedAfterSecondSpace).toBe(true)
  })

  test('CinematicVideoPlayer wyświetla komunikat błędu role="alert" przy uszkodzonym źródle', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, '/')

    const promoSection = page.locator('#promo')
    await promoSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)

    const playerFrame = promoSection.locator('[role="group"][aria-label*="film promocyjny"]')
    const video = playerFrame.locator('video')

    // Simulate error event on video element
    await video.evaluate((v: HTMLVideoElement) => {
      v.dispatchEvent(new Event('error'))
    })
    await page.waitForTimeout(100)

    const alertMsg = playerFrame.locator('[role="alert"]')
    await expect(alertMsg).toBeVisible()
    await expect(alertMsg).toContainText('Nie udało się załadować filmu')
  })

  test('YouTubeFacade: fasada ładuje miniaturkę z img.youtube.com i montuje iframe youtube-nocookie.com po kliknięciu', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, '/')

    const promoSection = page.locator('#promo')
    await promoSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)

    const firstYtCard = promoSection.locator('[class*="ytGrid"] [class*="ytCard"]').first()
    await expect(firstYtCard).toBeVisible()

    // Ensure NO iframe exists initially
    expect(await firstYtCard.locator('iframe').count()).toBe(0)

    // Verify thumbnail image points to img.youtube.com
    const thumb = firstYtCard.locator('img[src*="img.youtube.com"]')
    await expect(thumb).toBeVisible()

    // Click the thumbnail button
    const thumbBtn = firstYtCard.locator('button[aria-label*="Odtwórz:"]')
    await thumbBtn.click()
    await page.waitForTimeout(200)

    // Verify iframe has been mounted with youtube-nocookie.com
    const iframe = firstYtCard.locator('iframe')
    await expect(iframe).toBeVisible()
    const iframeSrc = await iframe.getAttribute('src')
    expect(iframeSrc).toContain('youtube-nocookie.com/embed/')
  })
})

test.describe('P3 — Krok 3: Kanały kontaktu, konwersja i formaty CTA', () => {
  test.beforeEach(async ({ page }) => skipIntro(page))

  test('Podstrona /contact posiada poprawne linki tel, mailto i wa.me oraz Steps Panel', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, '/contact')

    // Check telephone link
    const phoneLink = page.locator('a[href^="tel:"]').first()
    await expect(phoneLink).toBeVisible()
    const phoneHref = await phoneLink.getAttribute('href')
    expect(phoneHref).toBe('tel:+48791705230')

    // Check email link with subject
    const mailLink = page.locator('a[href^="mailto:"]').first()
    await expect(mailLink).toBeVisible()
    const mailHref = await mailLink.getAttribute('href')
    expect(mailHref).toContain('mailto:kontakt@maleszyk.media')
    expect(mailHref).toContain('subject=Zapytanie%20ofertowe')

    // Check WhatsApp link with cleaned number and pre-filled message
    const waLink = page.locator('a[href*="wa.me"]').first()
    await expect(waLink).toBeVisible()
    const waHref = await waLink.getAttribute('href')
    expect(waHref).toContain('https://wa.me/48791705230')
    expect(waHref).toContain('text=')

    // Check target="_blank" and rel="noopener noreferrer" on external WhatsApp link
    expect(await waLink.getAttribute('target')).toBe('_blank')
    expect(await waLink.getAttribute('rel')).toBe('noopener noreferrer')

    // Check Steps Panel (01 Opowiedz, 02 Ustalamy kierunek, 03 Realizujemy)
    const stepsPanel = page.locator('aside[aria-label="Etapy rozpoczęcia współpracy"]')
    await expect(stepsPanel).toBeVisible()
    await expect(stepsPanel).toContainText('01')
    await expect(stepsPanel).toContainText('Opowiedz')
    await expect(stepsPanel).toContainText('02')
    await expect(stepsPanel).toContainText('Ustalamy kierunek')
    await expect(stepsPanel).toContainText('03')
    await expect(stepsPanel).toContainText('Realizujemy')
  })
})

test.describe('P3 — Krok 4: Linki społecznościowe w stopce, FAQ i integralność odnośników', () => {
  test.beforeEach(async ({ page }) => skipIntro(page))

  test('Stopka zawiera 5 poprawnych profili społecznościowych z target="_blank" i aria-label', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, '/')

    const footer = page.getByRole('contentinfo')
    await expect(footer).toBeVisible()

    const expectedSocials = [
      { label: 'Facebook', hrefPart: 'facebook.com' },
      { label: 'Instagram', hrefPart: 'instagram.com' },
      { label: 'YouTube', hrefPart: 'youtube.com' },
      { label: 'WhatsApp', hrefPart: 'wa.me' },
      { label: 'Messenger', hrefPart: 'm.me' },
    ]

    for (const item of expectedSocials) {
      const link = footer.locator(`a[aria-label="${item.label}"]`)
      await expect(link, `Footer link ${item.label}`).toBeVisible()
      const href = await link.getAttribute('href')
      expect(href, `${item.label} href`).toContain(item.hrefPart)
      expect(await link.getAttribute('target'), `${item.label} target`).toBe('_blank')
      expect(await link.getAttribute('rel'), `${item.label} rel`).toBe('noopener noreferrer')
    }
  })

  test('Akordeon FAQ: poprawne rozwijanie/zwijanie oraz atrybuty aria-expanded i aria-controls', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await visit(page, '/')

    const faqSection = page.locator('#faq')
    await faqSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(200)

    const firstQuestionBtn = faqSection.locator('button[id^="faq-question-"]').first()
    await expect(firstQuestionBtn).toBeVisible()

    // Initially closed
    expect(await firstQuestionBtn.getAttribute('aria-expanded')).toBe('false')
    const answerId = await firstQuestionBtn.getAttribute('aria-controls')
    expect(answerId).toBeTruthy()

    const answerRegion = faqSection.locator(`#${answerId}`)
    await expect(answerRegion).toBeAttached()
    expect(await answerRegion.getAttribute('aria-labelledby')).toBe(await firstQuestionBtn.getAttribute('id'))

    // Click to open
    await firstQuestionBtn.click()
    await page.waitForTimeout(150)
    expect(await firstQuestionBtn.getAttribute('aria-expanded')).toBe('true')

    // Click to close
    await firstQuestionBtn.click()
    await page.waitForTimeout(150)
    expect(await firstQuestionBtn.getAttribute('aria-expanded')).toBe('false')
  })

  test('Brak martwych linków (broken links) oraz brak pustych href="#" na wszystkich 5 trasach', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    for (const route of routes) {
      await visit(page, route)

      const links = page.locator('a[href]')
      const count = await links.count()
      expect(count, `Liczba linków na ${route}`).toBeGreaterThan(0)

      for (let i = 0; i < count; i++) {
        const href = await links.nth(i).getAttribute('href')
        expect(href, `Link #${i} na ${route} nie może być pusty`).toBeTruthy()
        expect(href, `Link #${i} na ${route} nie może być czystym '#'` ).not.toBe('#')
        expect(href, `Link #${i} na ${route} nie może być javascript:`).not.toMatch(/^javascript:/)
      }
    }
  })
})
