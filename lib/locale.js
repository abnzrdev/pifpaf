import { cookies } from 'next/headers'

import { normalizeLocale } from './i18n.js'

export async function getLocale() {
  return normalizeLocale((await cookies()).get('pifpaf-locale')?.value)
}
