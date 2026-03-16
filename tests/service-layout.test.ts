import test from 'node:test'
import assert from 'node:assert/strict'
import type { ServiceIconName } from '../lib/site-content.ts'
import {
  getCardVariant,
  getSceneNumber,
  orderServiceItems,
} from '../components/sections/services/serviceLayout.ts'

type MockServiceItem = {
  icon: ServiceIconName
  title: string
}

const mockItems: MockServiceItem[] = [
  { icon: 'drone', title: 'A' },
  { icon: 'heart', title: 'B' },
  { icon: 'wheel', title: 'C' },
  { icon: 'flag', title: 'D' },
]

test('getCardVariant identifies highlight and military variants', () => {
  assert.equal(getCardVariant('heart'), 'highlight')
  assert.equal(getCardVariant('flag'), 'highlight')
  assert.equal(getCardVariant('wheel'), 'military')
})

test('orderServiceItems keeps highlight items first while preserving relative order', () => {
  const ordered = orderServiceItems(mockItems)

  assert.deepEqual(
    ordered.map((item) => item.title),
    ['B', 'C', 'D'],
  )
})

test('getSceneNumber returns a zero-padded scene label', () => {
  assert.equal(getSceneNumber(0), '01')
  assert.equal(getSceneNumber(4), '05')
})
