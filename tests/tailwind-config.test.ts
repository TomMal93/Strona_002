import test from 'node:test'
import assert from 'node:assert/strict'
import tailwindConfig from '../tailwind.config.ts'

test('tailwind config contains required design tokens used by UI', () => {
  const extend = tailwindConfig.theme?.extend as {
    maxWidth?: Record<string, string>
    height?: Record<string, string>
    letterSpacing?: Record<string, string>
    borderRadius?: Record<string, string>
    colors?: Record<string, string>
  }
  assert.ok(extend)

  assert.equal(extend?.maxWidth?.content, '1280px')
  assert.equal(extend?.height?.['hero-media'], '120%')
  assert.equal(extend?.letterSpacing?.overline, '0.2em')
  assert.equal(extend?.borderRadius?.micro, '2px')

  assert.equal(extend?.colors?.khaki, '#8B7355')
  assert.equal(extend?.colors?.['military-green'], '#4A5240')
})
