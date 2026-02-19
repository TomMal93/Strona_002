import test from 'node:test'
import assert from 'node:assert/strict'
import { siteContent } from '../lib/site-content.ts'

test('site content exposes required SEO and Hero copy fields', () => {
  assert.equal(typeof siteContent.seoDescription, 'string')
  assert.equal(typeof siteContent.structuredDataDescription, 'string')
  assert.equal(typeof siteContent.hero.headlineLine1, 'string')
  assert.equal(typeof siteContent.hero.headlineLine2, 'string')
  assert.equal(typeof siteContent.hero.subtitle, 'string')
  assert.equal(typeof siteContent.hero.ctaLabel, 'string')

  assert.ok(siteContent.seoDescription.length > 0)
  assert.ok(siteContent.structuredDataDescription.length > 0)
  assert.ok(siteContent.hero.headlineLine1.length > 0)
  assert.ok(siteContent.hero.headlineLine2.length > 0)
  assert.ok(siteContent.hero.subtitle.length > 0)
  assert.ok(siteContent.hero.ctaLabel.length > 0)
})
