import Link from 'next/link'

export function Logo({ copy = { home: 'PifPaf AI home', badge: 'for creators' } }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 font-black tracking-[-0.04em] text-[var(--navy)]" aria-label={copy.home}>
      <span className="text-2xl text-[var(--blue)]" aria-hidden="true">✦</span>
      <span className="text-xl italic">PifPaf <span className="text-[var(--blue)]">AI</span></span>
      <span className="ml-1 hidden rounded-full bg-[#edf1ff] px-2.5 py-1 text-[0.68rem] font-bold not-italic tracking-normal text-[var(--blue)] sm:inline">{copy.badge}</span>
    </Link>
  )
}
