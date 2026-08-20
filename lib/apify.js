import { normalizeReelUrl } from './reels.js'

const FRIENDLY_ERRORS = {
  empty: 'We could not find public data for this Reel. It may be private or deleted.',
  failed: 'Instagram data could not be fetched right now. Please try again.',
  rate_limit: 'The data service is busy. Please wait a moment and try again.',
  timeout: 'Fetching this Reel took too long. Please try again.',
}

export class ReelFetchError extends Error {
  constructor(code, cause) {
    super(FRIENDLY_ERRORS[code] ?? FRIENDLY_ERRORS.failed, { cause })
    this.name = 'ReelFetchError'
    this.code = code
  }
}

function metric(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null
}

export function normalizeActorItem(item, canonicalUrl) {
  const shortcode = new URL(canonicalUrl).pathname.split('/').filter(Boolean)[1]
  if (!item || item.shortCode !== shortcode) {
    throw new ReelFetchError('empty', new Error('Actor did not return the requested Reel'))
  }

  return {
    url: canonicalUrl,
    shortcode,
    caption: typeof item.caption === 'string' ? item.caption : null,
    coverUrl: item.displayUrl ?? item.images?.[0] ?? null,
    publishedAt: typeof item.timestamp === 'string' ? item.timestamp : null,
    durationSeconds: metric(item.videoDuration),
    views: metric(item.videoViewCount) ?? metric(item.videoPlayCount),
    likes: metric(item.likesCount),
    comments: metric(item.commentsCount),
    shares: metric(item.sharesCount),
    rawJson: item,
  }
}

function mockItem(canonicalUrl) {
  const shortcode = new URL(canonicalUrl).pathname.split('/').filter(Boolean)[1]
  const score = [...shortcode].reduce((total, character) => total + character.charCodeAt(0), 0)
  const images = ['mountains', 'cafe', 'city', 'fashion', 'interior', 'portrait']
  return {
    shortCode: shortcode,
    caption: `Creator story ${shortcode}`,
    displayUrl: `/images/${images[score % images.length]}.webp`,
    timestamp: new Date(Date.UTC(2026, 7, (score % 20) + 1)).toISOString(),
    videoDuration: 12 + (score % 31),
    videoViewCount: 18000 + score * 17,
    likesCount: 900 + score,
    commentsCount: 30 + (score % 90),
  }
}

export async function fetchReel(value) {
  const canonicalUrl = normalizeReelUrl(value)
  if (process.env.APIFY_MOCK === 'true') {
    return normalizeActorItem(mockItem(canonicalUrl), canonicalUrl)
  }
  if (!process.env.APIFY_TOKEN) {
    throw new ReelFetchError('failed', new Error('APIFY_TOKEN is required'))
  }

  try {
    const { ApifyClient } = await import('apify-client')
    const client = new ApifyClient({ token: process.env.APIFY_TOKEN })
    const actorId = process.env.APIFY_ACTOR_ID || 'apify/instagram-reel-scraper'
    const run = await client.actor(actorId).start({
      username: [canonicalUrl],
      resultsLimit: 1,
      includeSharesCount: false,
      includeTranscript: false,
      includeDownloadedVideo: false,
    })
    const finished = await client.run(run.id).waitForFinish({ waitSecs: 60 })

    if (finished.status === 'RUNNING' || finished.status === 'READY') {
      await client.run(run.id).abort()
      throw new ReelFetchError('timeout')
    }
    if (finished.status !== 'SUCCEEDED') {
      throw new ReelFetchError(finished.status === 'TIMED-OUT' ? 'timeout' : 'failed')
    }

    const { items } = await client.dataset(finished.defaultDatasetId).listItems({ limit: 1 })
    if (!items.length) throw new ReelFetchError('empty')
    return normalizeActorItem(items[0], canonicalUrl)
  } catch (error) {
    if (error instanceof ReelFetchError) throw error
    if (error?.statusCode === 429) throw new ReelFetchError('rate_limit', error)
    throw new ReelFetchError('failed', error)
  }
}
