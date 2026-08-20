import { createPool } from '../lib/db.js'
import { hashPassword } from '../lib/password.js'
import { createRepository } from '../lib/repository.js'

try {
  process.loadEnvFile('.env.local')
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

const pool = createPool()
const repository = createRepository(pool)

try {
  const passwordHash = await hashPassword('PifPafDemo!2026')
  const demoUser = await upsertUser('demo@pifpaf.ai', passwordHash)
  await upsertUser('empty@pifpaf.ai', passwordHash)

  const fixtures = [
    ['MOUNTAINS26', 'Weekend in the mountains ✨', 'mountains', 48700, 3800, 214, 24, '2026-08-17'],
    ['CAFE26', 'Morning coffee ☕', 'cafe', 32100, 2600, 148, null, '2026-08-15'],
    ['CITY26', 'City walk', 'city', 29400, 2100, 96, null, '2026-08-13'],
    ['FASHION26', 'Summer details', 'fashion', 27800, 1900, 84, 11, '2026-08-11'],
    ['INTERIOR26', 'Little moments', 'interior', 24600, 1600, 62, null, '2026-08-09'],
    ['PORTRAIT26', 'Slow Sunday', 'portrait', 21600, 1400, 51, null, '2026-08-07'],
  ]

  for (const [shortcode, caption, image, views, likes, comments, shares, date] of fixtures) {
    await repository.upsertReel(demoUser.id, {
      url: `https://www.instagram.com/reel/${shortcode}/`,
      shortcode,
      caption,
      coverUrl: `/images/${image}.webp`,
      publishedAt: `${date}T12:00:00.000Z`,
      durationSeconds: 18 + (shortcode.length % 8),
      views,
      likes,
      comments,
      shares,
      rawJson: { seeded: true, shortCode: shortcode },
    })
  }
  console.log('Seeded demo@pifpaf.ai and empty@pifpaf.ai')
} finally {
  await pool.end()
}

async function upsertUser(email, passwordHash) {
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash) VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
     RETURNING id, email`,
    [email, passwordHash],
  )
  return rows[0]
}
