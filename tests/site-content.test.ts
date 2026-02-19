import test from 'node:test'
import assert from 'node:assert/strict'
import { siteContent } from '../lib/site-content.ts'

test('site content exposes required SEO, Hero and Services copy fields', () => {
  assert.equal(typeof siteContent.seoDescription, 'string')
  assert.equal(typeof siteContent.structuredDataDescription, 'string')
  assert.equal(typeof siteContent.hero.headlineLine1, 'string')
  assert.equal(typeof siteContent.hero.headlineLine2, 'string')
  assert.equal(typeof siteContent.hero.subtitle, 'string')
  assert.equal(typeof siteContent.hero.ctaLabel, 'string')
  assert.equal(typeof siteContent.services.overline, 'string')
  assert.equal(typeof siteContent.services.title, 'string')
  assert.equal(typeof siteContent.services.subtitle, 'string')
  assert.ok(Array.isArray(siteContent.services.items))
  assert.equal(siteContent.services.items.length, 5)

  for (const item of siteContent.services.items) {
    assert.equal(typeof item.icon, 'string')
    assert.equal(typeof item.title, 'string')
    assert.equal(typeof item.description, 'string')
    assert.ok(item.icon.length > 0)
    assert.ok(item.title.length > 0)
    assert.ok(item.description.length > 0)
  }

  assert.ok(siteContent.seoDescription.length > 0)
  assert.ok(siteContent.structuredDataDescription.length > 0)
  assert.ok(siteContent.hero.headlineLine1.length > 0)
  assert.ok(siteContent.hero.headlineLine2.length > 0)
  assert.ok(siteContent.hero.subtitle.length > 0)
  assert.ok(siteContent.hero.ctaLabel.length > 0)
  assert.ok(siteContent.services.overline.length > 0)
  assert.ok(siteContent.services.title.length > 0)
  assert.ok(siteContent.services.subtitle.length > 0)
})
