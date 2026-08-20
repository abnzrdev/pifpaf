'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { authOptions } from '@/lib/auth.js'
import { importReelForUser, refreshReelForUser } from '@/lib/import-reel.js'

const reelIdSchema = z.uuid()

export async function importReel(_previousState, formData) {
  const userId = await authenticatedUserId()
  if (!userId) return result({ ok: false, error: 'Your session expired. Please sign in again.' })

  const imported = await importReelForUser({ userId, url: formData.get('url') })
  if (imported.ok) revalidatePath('/dashboard')
  return result(imported)
}

export async function refreshReel(_previousState, formData) {
  const userId = await authenticatedUserId()
  if (!userId) return result({ ok: false, error: 'Your session expired. Please sign in again.' })

  const reelId = reelIdSchema.safeParse(formData.get('reelId'))
  if (!reelId.success) return result({ ok: false, error: 'That Reel is no longer available.' })
  const refreshed = await refreshReelForUser({ userId, reelId: reelId.data })
  if (refreshed.ok) revalidatePath('/dashboard')
  return result(refreshed)
}

async function authenticatedUserId() {
  const session = await getServerSession(authOptions)
  return session?.user?.id ?? null
}

function result(value) {
  return { ...value, version: Date.now() }
}
