const INVALID_REEL = 'Enter a valid public Instagram Reel URL.'
const HOSTS = new Set(['instagram.com', 'www.instagram.com', 'm.instagram.com'])

export function hasReelUrlInput(value) {
  return String(value).trim().length > 0
}

export function normalizeReelUrl(value) {
  let url
  try {
    url = new URL(String(value).trim())
  } catch {
    throw new Error(INVALID_REEL)
  }

  const parts = url.pathname.split('/').filter(Boolean)
  if (
    url.protocol !== 'https:' ||
    !HOSTS.has(url.hostname.toLowerCase()) ||
    !['reel', 'reels'].includes(parts[0]) ||
    parts.length !== 2 ||
    !/^[A-Za-z0-9_-]+$/.test(parts[1])
  ) {
    throw new Error(INVALID_REEL)
  }

  return `https://www.instagram.com/reel/${parts[1]}/`
}
