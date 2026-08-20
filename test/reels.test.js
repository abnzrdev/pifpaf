import assert from 'node:assert/strict'
import test from 'node:test'

import { normalizeReelUrl } from '../lib/reels.js'

test('canonicalizes supported Instagram Reel URLs', () => {
  assert.equal(
    normalizeReelUrl('https://www.instagram.com/reel/C9Ab_12/?igsh=abc#fragment'),
    'https://www.instagram.com/reel/C9Ab_12/',
  )
  assert.equal(
    normalizeReelUrl('https://instagram.com/reels/C9Ab_12/'),
    'https://www.instagram.com/reel/C9Ab_12/',
  )
})

test('rejects URLs that are not public HTTPS Instagram Reels', () => {
  for (const value of [
    'http://instagram.com/reel/C9Ab_12/',
    'https://example.com/reel/C9Ab_12/',
    'https://www.instagram.com/p/C9Ab_12/',
    'https://www.instagram.com/reel/',
    'not a url',
  ]) {
    assert.throws(() => normalizeReelUrl(value), /valid public Instagram Reel/i)
  }
})
