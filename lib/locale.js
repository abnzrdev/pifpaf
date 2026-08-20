import { cookies } from 'next/headers'

import { LOCALE_COOKIE, normalizeLocale } from './i18n.js'

export async function getLocale() {
  return normalizeLocale((await cookies()).get(LOCALE_COOKIE)?.value)
}
