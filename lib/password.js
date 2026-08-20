import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)

export async function hashPassword(password) {
  const salt = randomBytes(16)
  const hash = await scrypt(password, salt, 64)
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`
}

export async function verifyPassword(password, encoded) {
  const [algorithm, saltHex, hashHex] = String(encoded).split('$')
  if (algorithm !== 'scrypt' || !/^[\da-f]{32}$/.test(saltHex) || !/^[\da-f]{128}$/.test(hashHex)) {
    return false
  }

  const expected = Buffer.from(hashHex, 'hex')
  const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length)
  return timingSafeEqual(actual, expected)
}
