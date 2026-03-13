import test from 'node:test'
import assert from 'node:assert/strict'
import {
  filterSupportedSocialLinks,
  isSocialPlatform,
} from '../components/sections/hero/socialPlatforms.ts'

test('isSocialPlatform validates supported platform names', () => {
  assert.equal(isSocialPlatform('facebook'), true)
  assert.equal(isSocialPlatform('youtube'), true)
  assert.equal(isSocialPlatform('linkedin'), false)
})

test('filterSupportedSocialLinks keeps only supported platform entries', () => {
  const links = [
    { platform: 'facebook', href: '#' },
    { platform: 'linkedin', href: '#' },
    { platform: 'instagram', href: '#' },
  ]

  const filtered = filterSupportedSocialLinks(links)

  assert.deepEqual(
    filtered.map((link) => link.platform),
    ['facebook', 'instagram'],
  )
})
