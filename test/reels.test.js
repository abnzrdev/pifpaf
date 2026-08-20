import assert from 'node:assert/strict'
import test from 'node:test'

import { normalizeReelUrl } from '../lib/reels.js'
import * as reelRules from '../lib/reels.js'
import { formatDate } from '../lib/format.js'

test('canonicalizes supported Instagram Reel URLs', () => {
  assert.equal(
    normalizeReelUrl('https://www.instagram.com/reel/C9Ab_12/?igsh=abc#fragment'),
    'https://www.instagram.com/reel/C9Ab_12/',
  )
  assert.equal(
    normalizeReelUrl('https://instagram.com/reels/C9Ab_12/'),
    'https://www.instagram.com/reel/C9Ab_12/',
  )
  assert.equal(
    normalizeReelUrl('https://www.instagram.com/p/DZIOdupbuA/'),
    'https://www.instagram.com/reel/DZIOdupbuA/',
  )
})

test('rejects URLs that are not public HTTPS Instagram Reels', () => {
  for (const value of [
    'http://instagram.com/reel/C9Ab_12/',
    'https://example.com/reel/C9Ab_12/',
    'https://www.instagram.com/reel/',
    'not a url',
  ]) {
    assert.throws(() => normalizeReelUrl(value), /valid public Instagram Reel/i)
  }
})

test('formats Reel dates in the selected interface language', () => {
  const value = '2026-08-01T08:00:00.000Z'

  assert.equal(formatDate(value, 'ru'), '1 авг. 2026 г.')
  assert.equal(formatDate(value, 'en'), 'Aug 1, 2026')
})

test('allows any pasted URL to reach server-side Reel validation', () => {
  assert.equal(typeof reelRules.hasReelUrlInput, 'function')
  assert.equal(reelRules.hasReelUrlInput('https://www.instagram.com/p/DaVwyRxu3LO/'), true)
  assert.equal(reelRules.hasReelUrlInput('   '), false)
})
