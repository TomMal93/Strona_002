import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getHighlightVariant,
  PRIMARY_HIGHLIGHTS_COUNT,
} from '../components/sections/about/highlightLayout.ts'

test('getHighlightVariant marks first highlights as primary', () => {
  assert.equal(PRIMARY_HIGHLIGHTS_COUNT, 2)
  assert.equal(getHighlightVariant(0), 'primary')
  assert.equal(getHighlightVariant(1), 'primary')
})

test('getHighlightVariant marks later highlights as secondary', () => {
  assert.equal(getHighlightVariant(2), 'secondary')
  assert.equal(getHighlightVariant(3), 'secondary')
})
