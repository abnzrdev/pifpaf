import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

try {
  process.loadEnvFile('.env.local')
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

const useTestDatabase = process.argv.includes('--test')
const connectionString = useTestDatabase ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL
if (!connectionString) throw new Error(`${useTestDatabase ? 'TEST_DATABASE_URL' : 'DATABASE_URL'} is required`)

const directory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../db')
const files = (await readdir(directory)).filter((file) => /^\d{3}_.*\.sql$/.test(file)).sort()
const pool = new pg.Pool({ connectionString })

try {
  await pool.query('CREATE TABLE IF NOT EXISTS schema_migrations (filename TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())')
  for (const filename of files) {
    const applied = await pool.query('SELECT 1 FROM schema_migrations WHERE filename = $1', [filename])
    if (applied.rowCount) continue
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(await readFile(path.join(directory, filename), 'utf8'))
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [filename])
      await client.query('COMMIT')
      console.log(`Applied ${filename}`)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
} finally {
  await pool.end()
}
