import assert from 'node:assert/strict'
import test from 'node:test'

import { authorizeCredentials, parseCredentials } from '../lib/credentials.js'
import { hashPassword } from '../lib/password.js'

test('normalizes valid credentials and rejects malformed input', () => {
  assert.deepEqual(parseCredentials({ email: '  DEMO@PIFPAF.AI ', password: 'secret123' }), {
    email: 'demo@pifpaf.ai',
    password: 'secret123',
  })
  assert.equal(parseCredentials({ email: 'not-an-email', password: '' }), null)
})

test('authorizes only a matching stored password without exposing the failure cause', async () => {
  const passwordHash = await hashPassword('PifPafDemo!2026')
  const repository = {
    findUserByEmail: async () => ({ id: 'user-1', email: 'demo@pifpaf.ai', password_hash: passwordHash }),
  }

  assert.deepEqual(
    await authorizeCredentials({ email: 'demo@pifpaf.ai', password: 'PifPafDemo!2026' }, repository),
    { id: 'user-1', email: 'demo@pifpaf.ai', name: 'Demo Creator' },
  )
  assert.equal(await authorizeCredentials({ email: 'demo@pifpaf.ai', password: 'wrong-password' }, repository), null)
  assert.equal(await authorizeCredentials({ email: 'bad', password: '' }, repository), null)
})

test('uses the same null result when the user does not exist', async () => {
  const repository = { findUserByEmail: async () => null }
  assert.equal(await authorizeCredentials({ email: 'missing@example.com', password: 'secret123' }, repository), null)
})
