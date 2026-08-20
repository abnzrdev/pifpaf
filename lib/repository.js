import { getPool } from './db.js'

function mapReel(row) {
  if (!row) return null
  return {
    id: row.id,
    url: row.url,
    shortcode: row.shortcode,
    caption: row.caption,
    coverUrl: row.cover_url,
    publishedAt: row.published_at?.toISOString() ?? null,
    durationSeconds: row.duration_seconds,
    views: row.views === null ? null : Number(row.views),
    likes: row.likes === null ? null : Number(row.likes),
    comments: row.comments === null ? null : Number(row.comments),
    shares: row.shares === null ? null : Number(row.shares),
    lastSyncedAt: row.last_synced_at.toISOString(),
    createdAt: row.created_at.toISOString(),
  }
}

export function createRepository(pool) {
  return {
    async findUserByEmail(email) {
      const { rows } = await pool.query(
        'SELECT id, email, password_hash FROM users WHERE email = $1',
        [email.trim().toLowerCase()],
      )
      return rows[0] ?? null
    },

    async createUser(email, passwordHash) {
      const { rows } = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email.trim().toLowerCase(), passwordHash],
      )
      return rows[0]
    },

    async getDashboard(userId) {
      const [reelsResult, statsResult] = await Promise.all([
        pool.query('SELECT * FROM reels WHERE user_id = $1 ORDER BY created_at DESC', [userId]),
        pool.query(
          `SELECT
             COUNT(*)::int AS reel_count,
             COALESCE(SUM(views), 0)::bigint AS total_views,
             (ARRAY_AGG(id ORDER BY views DESC NULLS LAST, created_at DESC))[1] AS best_reel_id,
             (ARRAY_AGG(views ORDER BY views DESC NULLS LAST, created_at DESC))[1] AS best_reel_views
           FROM reels
           WHERE user_id = $1`,
          [userId],
        ),
      ])
      const stats = statsResult.rows[0]
      return {
        reels: reelsResult.rows.map(mapReel),
        stats: {
          reelCount: stats.reel_count,
          totalViews: Number(stats.total_views),
          bestReelId: stats.best_reel_id,
          bestReelViews: stats.best_reel_views === null ? null : Number(stats.best_reel_views),
        },
      }
    },

    async getReel(userId, reelId) {
      const { rows } = await pool.query('SELECT * FROM reels WHERE user_id = $1 AND id = $2', [userId, reelId])
      return mapReel(rows[0])
    },

    async getStaleReels(userId, cutoff) {
      const { rows } = await pool.query(
        'SELECT * FROM reels WHERE user_id = $1 AND last_synced_at < $2 ORDER BY last_synced_at LIMIT 10',
        [userId, cutoff],
      )
      return rows.map(mapReel)
    },

    async upsertReel(userId, reel) {
      const { rows } = await pool.query(
        `INSERT INTO reels (
           user_id, url, shortcode, caption, cover_url, published_at,
           duration_seconds, views, likes, comments, shares, raw_json
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb)
         ON CONFLICT (user_id, shortcode) DO UPDATE SET
           url = EXCLUDED.url,
           caption = EXCLUDED.caption,
           cover_url = EXCLUDED.cover_url,
           published_at = EXCLUDED.published_at,
           duration_seconds = EXCLUDED.duration_seconds,
           views = EXCLUDED.views,
           likes = EXCLUDED.likes,
           comments = EXCLUDED.comments,
           shares = EXCLUDED.shares,
           raw_json = EXCLUDED.raw_json,
           last_synced_at = NOW(),
           updated_at = NOW()
         RETURNING *`,
        [
          userId,
          reel.url,
          reel.shortcode,
          reel.caption,
          reel.coverUrl,
          reel.publishedAt,
          reel.durationSeconds,
          reel.views,
          reel.likes,
          reel.comments,
          reel.shares,
          JSON.stringify(reel.rawJson),
        ],
      )
      return mapReel(rows[0])
    },
  }
}

export function getRepository() {
  return createRepository(getPool())
}
