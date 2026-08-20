import pg from 'pg'

export function createPool(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error('DATABASE_URL is required')
  return new pg.Pool({ connectionString, max: 10 })
}

export function getPool() {
  if (!globalThis.pifpafPool) globalThis.pifpafPool = createPool()
  return globalThis.pifpafPool
}
