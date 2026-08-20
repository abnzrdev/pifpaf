import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import pg from 'pg'

import { createRepository } from '../lib/repository.js'

try {
  process.loadEnvFile('.env.local')
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

const connectionString = process.env.TEST_DATABASE_URL
const canRun = Boolean(connectionString && (process.env.NODE_ENV === 'test' || connectionString !== process.env.DATABASE_URL))
const integration = canRun ? test : test.skip
let pool
let repository
let firstUser
let secondUser
let createdUser

before(async () => {
  if (!canRun) return
  pool = new pg.Pool({ connectionString })
  repository = createRepository(pool)
  const suffix = `${Date.now()}-${Math.random()}`
  firstUser = (await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
    [`first-${suffix}@example.test`, 'test-only'],
  )).rows[0].id
  secondUser = (await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
    [`second-${suffix}@example.test`, 'test-only'],
  )).rows[0].id
})

after(async () => {
  if (!pool) return
  await pool.query('DELETE FROM users WHERE id = ANY($1::uuid[])', [[firstUser, secondUser, createdUser].filter(Boolean)])
  await pool.end()
})

integration('keeps Reel rows and aggregates scoped to their authenticated user', async () => {
  await repository.upsertReel(firstUser, reel('FIRST', 120))
  const second = await repository.upsertReel(secondUser, reel('SECOND', 900))

  const dashboard = await repository.getDashboard(firstUser)
  assert.deepEqual(dashboard.stats, { reelCount: 1, totalViews: 120, bestReelId: dashboard.reels[0].id, bestReelViews: 120 })
  assert.deepEqual(dashboard.reels.map((item) => item.shortcode), ['FIRST'])
  assert.equal(await repository.getReel(firstUser, second.id), null)
})

integration('updates a duplicate shortcode instead of inserting another row', async () => {
  await repository.upsertReel(firstUser, reel('DUPLICATE', 20))
  await repository.upsertReel(firstUser, reel('DUPLICATE', 45))

  const dashboard = await repository.getDashboard(firstUser)
  assert.equal(dashboard.reels.filter((item) => item.shortcode === 'DUPLICATE').length, 1)
  assert.equal(dashboard.reels.find((item) => item.shortcode === 'DUPLICATE').views, 45)
})

integration('creates a normalized user and rejects a duplicate email', async () => {
  assert.equal(typeof repository.createUser, 'function')
  const email = `Creator-${Date.now()}@Example.test`

  const user = await repository.createUser(email, 'scrypt$test')
  createdUser = user.id

  assert.equal(user.email, email.toLowerCase())
  await assert.rejects(repository.createUser(email.toLowerCase(), 'scrypt$other'), { code: '23505' })
})

function reel(shortcode, views) {
  return {
    url: `https://www.instagram.com/reel/${shortcode}/`,
    shortcode,
    caption: shortcode,
    coverUrl: '/images/cafe.webp',
    publishedAt: '2026-08-01T08:00:00.000Z',
    durationSeconds: 18,
    views,
    likes: null,
    comments: 4,
    shares: null,
    rawJson: { shortCode: shortcode },
  }
}
