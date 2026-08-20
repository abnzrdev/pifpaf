export function ImportStatus({ copy }) {
  return (
    <div className="mt-5 rounded-xl border border-[var(--line)] bg-[#f8faff] p-4" role="status" aria-live="polite">
      <div className="flex items-center gap-4">
        <span className="spinner grid size-12 shrink-0 place-items-center rounded-full border-2 border-[#d8e0ff] text-[var(--blue)]" aria-hidden="true">✦</span>
        <ol className="space-y-2 text-sm">
          <li className="font-semibold text-[var(--blue)]">✓ {copy.found}</li>
          <li className="font-semibold">◌ {copy.metrics}</li>
          <li className="text-[var(--muted)]">○ {copy.cover}</li>
        </ol>
      </div>
      <p className="mt-4 text-center text-xs text-[var(--muted)]">{copy.wait}</p>
    </div>
  )
}
