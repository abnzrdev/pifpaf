import { formatMetric } from '@/lib/format.js'

export function StatCard({ icon, label, value, className = '', iconClassName = 'bg-[#e9efff] text-[var(--blue)]' }) {
  return (
    <article className={`card flex min-h-28 items-center gap-4 p-5 sm:p-6 ${className}`}>
      <span className={`grid size-14 shrink-0 place-items-center rounded-2xl text-2xl ${iconClassName}`} aria-hidden="true">{icon}</span>
      <div>
        <p className="text-sm text-[var(--muted)]">{label}</p>
        <p className="mt-1 text-3xl font-black tracking-[-0.04em]">{typeof value === 'number' ? formatMetric(value) : value}</p>
      </div>
    </article>
  )
}
