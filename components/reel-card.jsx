import Image from 'next/image'

import { formatDate, formatDuration, formatMetric } from '@/lib/format.js'

import { RefreshButton } from './refresh-button.jsx'

export function ReelCard({ reel, onRefresh, locale, copy }) {
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
        <h3 className="line-clamp-2 min-h-10 font-bold leading-5">{reel.caption || copy.reel.untitled}</h3>
        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--line)] pt-3">
          <div><dt className="text-[0.68rem] text-[var(--muted)]">{copy.reel.views}</dt><dd className="mt-1 font-bold">{formatMetric(reel.views)}</dd></div>
          <div><dt className="text-[0.68rem] text-[var(--muted)]">{copy.reel.likes}</dt><dd className="mt-1 font-bold">{formatMetric(reel.likes)}</dd></div>
          <div><dt className="text-[0.68rem] text-[var(--muted)]">{copy.reel.comments}</dt><dd className="mt-1 font-bold">{formatMetric(reel.comments)}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-[var(--muted)]"><span className="font-semibold">{copy.reel.date}:</span> {formatDate(reel.publishedAt, locale)}</p>
        <RefreshButton reelId={reel.id} onSuccess={onRefresh} locale={locale} copy={copy} />
      </div>
    </article>
  )
}
