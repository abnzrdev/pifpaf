import { fetchReel, ReelFetchError } from './apify.js'
import { getRepository } from './repository.js'
import { normalizeReelUrl } from './reels.js'

export async function importReelForUser({ userId, url, fetcher = fetchReel, repository = getRepository() }) {
  let canonicalUrl
  try {
    canonicalUrl = normalizeReelUrl(url)
  } catch (error) {
    return { ok: false, fieldError: error.message }
  }

  try {
    const reel = await fetcher(canonicalUrl)
    await repository.upsertReel(userId, reel)
    return { ok: true, dashboard: await repository.getDashboard(userId) }
  } catch (error) {
    return { ok: false, error: publicMessage(error) }
  }
}

export async function refreshReelForUser({ userId, reelId, fetcher = fetchReel, repository = getRepository() }) {
  const existing = await repository.getReel(userId, reelId)
  if (!existing) return { ok: false, error: 'That Reel is no longer available.' }

  try {
    const reel = await fetcher(existing.url)
    await repository.upsertReel(userId, reel)
    return { ok: true, dashboard: await repository.getDashboard(userId) }
  } catch (error) {
    return { ok: false, error: publicMessage(error) }
  }
}

function publicMessage(error) {
  return error instanceof ReelFetchError
    ? error.message
    : 'Reel data could not be saved right now. Please try again.'
}
