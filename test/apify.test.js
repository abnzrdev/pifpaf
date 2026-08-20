import assert from 'node:assert/strict'
import test from 'node:test'

import { normalizeActorItem, ReelFetchError } from '../lib/apify.js'

const canonicalUrl = 'https://www.instagram.com/reel/C9Ab_12/'

test('normalizes the maintained Apify Reel actor output', () => {
  const raw = {
    shortCode: 'C9Ab_12',
    caption: 'A calm morning',
    displayUrl: 'https://scontent.example/cover.jpg',
    timestamp: '2026-08-01T08:00:00.000Z',
    videoDuration: 18.5,
    videoViewCount: 4200,
    likesCount: 320,
    commentsCount: 14,
    sharesCount: 7,
  }

  assert.deepEqual(normalizeActorItem(raw, canonicalUrl), {
    url: canonicalUrl,
    shortcode: 'C9Ab_12',
    caption: 'A calm morning',
    coverUrl: 'https://scontent.example/cover.jpg',
    publishedAt: '2026-08-01T08:00:00.000Z',
    durationSeconds: 18.5,
    views: 4200,
    likes: 320,
    comments: 14,
    shares: 7,
    rawJson: raw,
  })
})

test('does not invent unavailable or hidden metrics', () => {
  const reel = normalizeActorItem(
    {
      shortCode: 'C9Ab_12',
      images: ['https://scontent.example/fallback.jpg'],
      videoPlayCount: 42,
      likesCount: -1,
    },
    canonicalUrl,
  )

  assert.equal(reel.coverUrl, 'https://scontent.example/fallback.jpg')
  assert.equal(reel.views, 42)
  assert.equal(reel.likes, null)
  assert.equal(reel.comments, null)
  assert.equal(reel.shares, null)
})

test('drops unsafe cover image schemes at the provider boundary', () => {
  const reel = normalizeActorItem(
    { shortCode: 'C9Ab_12', displayUrl: 'javascript:alert(1)' },
    canonicalUrl,
  )
  assert.equal(reel.coverUrl, null)
})

test('rejects actor results without the requested shortcode', () => {
  assert.throws(
    () => normalizeActorItem({ shortCode: 'Different' }, canonicalUrl),
    (error) => error.code === 'empty' && error.message === 'This Instagram post is not a public Reel.',
  )
})

test('uses friendly messages for every provider failure class', () => {
  const messages = {
    empty: 'This Instagram post is not a public Reel.',
    failed: 'Instagram data could not be fetched right now. Please try again.',
    rate_limit: 'The data service is busy. Please wait a moment and try again.',
    timeout: 'Fetching this Reel took too long. Please try again.',
  }
  for (const [code, message] of Object.entries(messages)) {
    assert.equal(new ReelFetchError(code).message, message)
  }
})
