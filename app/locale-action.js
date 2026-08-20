'use server'

import { cookies } from 'next/headers'

import { LOCALE_COOKIE, normalizeLocale } from '@/lib/i18n.js'

export async function setLocale(formData) {
  const locale = normalizeLocale(formData.get('locale'))
  ;(await cookies()).set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}
