import { z } from 'zod'

import { verifyPassword } from './password.js'
import { getRepository } from './repository.js'

const DUMMY_HASH = 'scrypt$67e4d244fc44cd599e6030d979191702$006f35366c4ddd2f733b6ce94446056ab9db3b1e9ffeedc6e824007cbdac2737936c49b9e2d5e7e4c685909253f23da38c0bdcfbf247581448e481a1cbad9597'
const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(8).max(200),
})

export function parseCredentials(value) {
  const result = credentialsSchema.safeParse(value)
  return result.success ? result.data : null
}

export async function authorizeCredentials(value, repository = getRepository()) {
  const credentials = parseCredentials(value)
  if (!credentials) return null

  const user = await repository.findUserByEmail(credentials.email)
  const matches = await verifyPassword(credentials.password, user?.password_hash ?? DUMMY_HASH)
  if (!user || !matches) return null

  return {
    id: user.id,
    email: user.email,
    name: user.email === 'demo@pifpaf.ai' ? 'Demo Creator' : 'New Creator',
  }
}
