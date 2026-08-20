import assert from 'node:assert/strict'
import test from 'node:test'

import { importReelForUser, refreshReelForUser, refreshStaleReelsForUser } from '../lib/import-reel.js'
import { ReelFetchError } from '../lib/apify.js'

const reel = {
  url: 'https://www.instagram.com/reel/GOOD123/',
  shortcode: 'GOOD123',
  caption: 'A creator story',
  coverUrl: '/images/cafe.webp',
  publishedAt: '2026-08-01T08:00:00.000Z',
  durationSeconds: 18,
  views: 42,
  likes: 4,
  comments: 1,
  shares: null,
  rawJson: { shortCode: 'GOOD123' },
}

test('rejects invalid URLs before spending a provider call', async () => {
  let providerCalls = 0
  const result = await importReelForUser({
    userId: 'user-1',
    url: 'https://example.com/not-a-reel',
    fetcher: async () => { providerCalls += 1 },
    repository: {},
  })

  assert.equal(providerCalls, 0)
  assert.deepEqual(result, { ok: false, fieldError: 'Enter a valid public Instagram Reel URL.' })
})

test('stores and reloads the dashboard for only the authenticated user', async () => {
  const calls = []
  const dashboard = { reels: [{ id: 'saved-1', ...reel }], stats: { reelCount: 1, totalViews: 42, bestReelId: 'saved-1', bestReelViews: 42 } }
  const repository = {
    upsertReel: async (userId, value) => { calls.push([userId, value]); return { id: 'saved-1', ...value } },
    getDashboard: async (userId) => { calls.push(['dashboard', userId]); return dashboard },
  }

  const result = await importReelForUser({ userId: 'user-1', url: reel.url, fetcher: async () => reel, repository })
  assert.deepEqual(result, { ok: true, dashboard })
  assert.equal(calls[0][0], 'user-1')
  assert.equal(calls[0][1].shortcode, 'GOOD123')
  assert.deepEqual(calls[1], ['dashboard', 'user-1'])
})

test('returns the provider friendly failure without mutating data', async () => {
  let writes = 0
  const result = await importReelForUser({
    userId: 'user-1',
    url: reel.url,
    fetcher: async () => { throw new ReelFetchError('rate_limit') },
    repository: { upsertReel: async () => { writes += 1 } },
  })

  assert.equal(writes, 0)
  assert.deepEqual(result, { ok: false, error: 'The data service is busy. Please wait a moment and try again.' })
})

test('refresh refuses a Reel owned by another user', async () => {
  let providerCalls = 0
  const result = await refreshReelForUser({
    userId: 'user-1',
    reelId: 'someone-elses-reel',
    fetcher: async () => { providerCalls += 1 },
    repository: { getReel: async () => null },
  })

  assert.equal(providerCalls, 0)
  assert.deepEqual(result, { ok: false, error: 'That Reel is no longer available.' })
})

test('background refresh updates at most one stale Reel for the authenticated user', async () => {
  const calls = []
  const repository = {
    getStaleReels: async (userId, cutoff) => {
      calls.push(['stale', userId, cutoff])
      return [{ url: reel.url }, { url: 'https://www.instagram.com/reel/LATER123/' }]
    },
    upsertReel: async (userId, value) => { calls.push(['upsert', userId, value.shortcode]) },
  }

  const result = await refreshStaleReelsForUser({
    userId: 'user-1',
    cutoff: '2026-08-20T00:00:00.000Z',
    fetcher: async (url) => { calls.push(['fetch', url]); return reel },
    repository,
  })

  assert.deepEqual(result, { refreshed: 1 })
  assert.deepEqual(calls, [
    ['stale', 'user-1', '2026-08-20T00:00:00.000Z'],
    ['fetch', reel.url],
    ['upsert', 'user-1', 'GOOD123'],
  ])
})
