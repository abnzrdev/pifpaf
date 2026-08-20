import { parseCredentials } from '../lib/credentials.js'
import { createPool } from '../lib/db.js'
import { hashPassword } from '../lib/password.js'
import { createRepository } from '../lib/repository.js'

try {
  process.loadEnvFile('.env.local')
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

const credentials = parseCredentials({
  email: process.argv[2],
  password: process.env.PIFPAF_NEW_USER_PASSWORD,
})

if (!credentials) {
  console.error('Usage: PIFPAF_NEW_USER_PASSWORD=<secure password> npm run user:create -- email@example.com')
  process.exit(1)
}

const pool = createPool()
try {
  await createRepository(pool).createUser(credentials.email, await hashPassword(credentials.password))
  console.log(`Created ${credentials.email}`)
} catch (error) {
  if (error.code === '23505') {
    console.error(`User ${credentials.email} already exists`)
    process.exitCode = 1
  } else {
    throw error
  }
} finally {
  await pool.end()
}
