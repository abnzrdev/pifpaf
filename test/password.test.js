import assert from 'node:assert/strict'
import test from 'node:test'

import { hashPassword, verifyPassword } from '../lib/password.js'

test('verifies only the original password', async () => {
  const encoded = await hashPassword('PifPafDemo!2026')

  assert.match(encoded, /^scrypt\$[\da-f]{32}\$[\da-f]+$/)
  assert.equal(await verifyPassword('PifPafDemo!2026', encoded), true)
  assert.equal(await verifyPassword('wrong-password', encoded), false)
})

test('rejects malformed stored hashes without throwing', async () => {
  assert.equal(await verifyPassword('anything', 'not-a-hash'), false)
})
