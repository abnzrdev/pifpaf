import { ReelCard } from '@/components/reel-card.jsx'
import { StatCard } from '@/components/stat-card.jsx'

export function Dashboard({ user, initialDashboard }) {
  const { reels, stats } = initialDashboard
  return (
    <main className="shell py-10 sm:py-14">
      <div className="mb-8">
        <p className="font-medium text-[var(--muted)]">Welcome back, {user.name} ✨</p>
        <h1 className="mt-2 text-[clamp(2.6rem,6vw,4rem)] font-black tracking-[-0.06em]">Your Creator Space</h1>
        <p className="mt-2 text-[var(--muted)]">See how your Reels are performing and keep everything together.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Reel totals">
        <StatCard icon="▣" label="Total Reels" value={stats.reelCount} />
        <StatCard icon="◉" label="Total Views" value={stats.totalViews} />
        <StatCard icon="☆" label="Best Reel" value={stats.bestReelViews ?? '—'} />
      </section>

      {reels.length === 0 ? <EmptyDashboard /> : <ReturningDashboard reels={reels} />}
    </main>
  )
}

function EmptyDashboard() {
  return (
    <section className="surface relative mx-auto mt-8 max-w-3xl overflow-hidden p-6 sm:mt-12 sm:p-10" aria-labelledby="first-reel-title">
      <span className="absolute right-8 top-7 text-3xl text-[#ff66a3]" aria-hidden="true">⌁</span>
      <div className="mb-6 flex items-center gap-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#eef1ff] text-3xl text-[var(--blue)]" aria-hidden="true">🔗</span>
        <div><h2 id="first-reel-title" className="text-2xl font-black">Add your first Reel ✨</h2><p className="mt-1 text-[var(--muted)]">Paste a public Instagram Reel link to begin.</p></div>
      </div>
      <label className="sr-only" htmlFor="first-reel-url">Instagram Reel URL</label>
      <input id="first-reel-url" className="min-h-13 w-full rounded-xl border border-[var(--line)] bg-white px-4" placeholder="https://www.instagram.com/reel/…" type="url" />
      <button className="button mt-4 w-full" disabled>Fetch Reel Data</button>
      <p className="mt-4 text-center text-sm text-[var(--muted)]">🔒 Only public Reel information is accessed.</p>
    </section>
  )
}

function ReturningDashboard({ reels }) {
  return (
    <section className="mt-12" aria-labelledby="reels-title">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 id="reels-title" className="text-2xl font-black">Your Reels</h2><p className="mt-1 text-[var(--muted)]">All your saved Reels in one place.</p></div>
        <button className="button">＋ Add Another Reel</button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {reels.map((reel) => <ReelCard key={reel.id} reel={reel} />)}
      </div>
      <p className="mx-auto mt-10 max-w-lg rounded-full bg-white/60 px-5 py-3 text-center text-sm text-[var(--muted)]">✦ Keep adding Reels to track your <strong className="text-[var(--blue)]">growth and storytelling.</strong></p>
    </section>
  )
}
