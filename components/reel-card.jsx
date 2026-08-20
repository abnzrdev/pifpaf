import Image from 'next/image'

import { formatDate, formatDuration, formatMetric } from '@/lib/format.js'

import { RefreshButton } from './refresh-button.jsx'

export function ReelCard({ reel, onRefresh }) {
  const localCover = reel.coverUrl?.startsWith('/images/')
  return (
    <article className="card min-w-0 overflow-hidden">
      <div className="relative aspect-[9/16] overflow-hidden bg-gradient-to-br from-[#dce4ff] to-[#f7f8fc]">
        {localCover ? (
          <Image className="object-cover" src={reel.coverUrl} alt="" fill sizes="(max-width: 640px) 50vw, 220px" />
        ) : reel.coverUrl ? (
          // Actor cover domains are dynamic; the provider boundary already restricts this to HTTPS.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="h-full w-full object-cover" src={reel.coverUrl} alt="" referrerPolicy="no-referrer" />
        ) : (
          <span className="grid h-full place-items-center text-5xl text-[var(--blue)]" aria-hidden="true">✦</span>
        )}
        <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-[#0b1239cc] text-sm text-white" aria-hidden="true">▶</span>
        <span className="absolute right-3 top-3 rounded-full bg-[#0b1239cc] px-2 py-1 text-xs text-white">{formatDuration(reel.durationSeconds)}</span>
      </div>
      <div className="p-3.5">
        <h3 className="line-clamp-2 min-h-10 font-bold leading-5">{reel.caption || 'Untitled Reel'}</h3>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--muted)]">
          <div><dt className="sr-only">Views</dt><dd>◉ {formatMetric(reel.views)}</dd></div>
          <div><dt className="sr-only">Likes</dt><dd>♡ {formatMetric(reel.likes)}</dd></div>
          <div><dt className="sr-only">Comments</dt><dd>◌ {formatMetric(reel.comments)}</dd></div>
          <div><dt className="sr-only">Shares</dt><dd>↗ {formatMetric(reel.shares)}</dd></div>
        </dl>
        <p className="mt-3 border-t border-[var(--line)] pt-3 text-xs text-[var(--muted)]">{formatDate(reel.publishedAt)}</p>
        <RefreshButton reelId={reel.id} onSuccess={onRefresh} />
      </div>
    </article>
  )
}
