import { formatMetric } from '@/lib/format.js'

export function StatCard({ icon, label, value }) {
  return (
    <article className="card flex min-h-24 items-center gap-4 p-4 sm:p-5">
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#eef1ff] text-xl text-[var(--blue)]" aria-hidden="true">{icon}</span>
      <div>
        <p className="text-sm text-[var(--muted)]">{label}</p>
        <p className="mt-1 text-2xl font-black tracking-[-0.04em]">{typeof value === 'number' ? formatMetric(value) : value}</p>
      </div>
    </article>
  )
}
