'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { authOptions } from '@/lib/auth.js'
import { importReelForUser, refreshReelForUser } from '@/lib/import-reel.js'
import { normalizeLocale, translateError } from '@/lib/i18n.js'

const reelIdSchema = z.uuid()

export async function importReel(_previousState, formData) {
  const locale = normalizeLocale(formData.get('locale'))
  const userId = await authenticatedUserId()
  if (!userId) return result({ ok: false, error: translateError('Your session expired. Please sign in again.', locale) })

  const imported = await importReelForUser({ userId, url: formData.get('url') })
  if (imported.ok) revalidatePath('/dashboard')
  return result(localize(imported, locale))
}

export async function refreshReel(_previousState, formData) {
  const locale = normalizeLocale(formData.get('locale'))
  const userId = await authenticatedUserId()
  if (!userId) return result({ ok: false, error: translateError('Your session expired. Please sign in again.', locale) })

  const reelId = reelIdSchema.safeParse(formData.get('reelId'))
  if (!reelId.success) return result({ ok: false, error: translateError('That Reel is no longer available.', locale) })
  const refreshed = await refreshReelForUser({ userId, reelId: reelId.data })
  if (refreshed.ok) revalidatePath('/dashboard')
  return result(localize(refreshed, locale))
}

async function authenticatedUserId() {
  const session = await getServerSession(authOptions)
  return session?.user?.id ?? null
}

function result(value) {
  return { ...value, version: Date.now() }
}

function localize(value, locale) {
  return {
    ...value,
    error: value.error ? translateError(value.error, locale) : value.error,
    fieldError: value.fieldError ? translateError(value.fieldError, locale) : value.fieldError,
  }
}
