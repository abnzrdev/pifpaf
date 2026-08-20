import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'

import { Logo } from '@/components/logo.jsx'
import { authOptions } from '@/lib/auth.js'

const steps = [
  ['🔗', '01 — Add a Reel', 'Paste your public Instagram Reel link.'],
  ['◉', '02 — PifPaf collects data', 'Views, date and cover update together.'],
  ['✦', '03 — Track results', 'All your Reels stay in one calm space.'],
]

export default async function LandingPage() {
  const session = await getServerSession(authOptions)
  const destination = session ? '/dashboard' : '/login'

  return (
    <main className="shell py-4 sm:py-10">
      <div className="surface relative min-h-[calc(100vh-2rem)] overflow-hidden px-5 py-6 sm:min-h-0 sm:px-10 sm:py-8 lg:px-16">
        <header className="flex items-center justify-between">
          <Logo />
          <Link className="rounded-full px-4 py-2 text-sm font-bold hover:bg-[#f1f4fb]" href={destination}>{session ? 'Dashboard' : 'Sign in'} <span aria-hidden="true">→</span></Link>
        </header>

        <section className="grid items-center gap-14 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:py-20" aria-labelledby="hero-title">
          <div className="relative z-10 max-w-xl">
            <span className="mb-5 inline-block text-2xl text-[#ff66a3]" aria-hidden="true">⌁</span>
            <h1 id="hero-title" className="text-[clamp(3.25rem,7vw,5.35rem)] font-black leading-[0.96] tracking-[-0.065em]">Your Reels.<br />All your results<br />in <span className="text-[var(--blue)]">one place.</span></h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-[var(--muted)]">Add your Reels and track views and performance in one simple creator space.</p>
            <Link className="button mt-8 min-w-64" href={destination}>Enter Creator Space <span aria-hidden="true">→</span></Link>
            <p className="mt-4 text-sm text-[var(--muted)]">Your posts — all in one place ✨</p>
          </div>

          <div className="relative mx-auto h-[32rem] w-full max-w-[38rem] sm:h-[38rem]" aria-label="Creator lifestyle collage">
            <div className="absolute left-[4%] top-[20%] h-[55%] w-[30%] -rotate-3 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-xl"><Image className="object-cover" src="/images/mountains.webp" alt="Mountain travel Reel" fill sizes="180px" priority /></div>
            <div className="absolute left-[30%] top-0 h-[62%] w-[31%] rotate-1 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-xl"><Image className="object-cover" src="/images/cafe.webp" alt="Cafe lifestyle Reel" fill sizes="190px" priority /></div>
            <div className="absolute right-[7%] top-[18%] h-[57%] w-[30%] rotate-3 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-xl"><Image className="object-cover" src="/images/interior.webp" alt="Sunlit interior Reel" fill sizes="180px" /></div>
            <div className="absolute bottom-0 left-[42%] h-[47%] w-[29%] -rotate-2 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-xl"><Image className="object-cover" src="/images/portrait.webp" alt="Outdoor portrait Reel" fill sizes="175px" /></div>
            <span className="card absolute right-0 top-[11%] rounded-full px-5 py-3 font-black">◉ 128K <small className="block pl-5 font-normal text-[var(--muted)]">views</small></span>
            <span className="card absolute bottom-[3%] left-[7%] rounded-full px-5 py-3 font-black text-[var(--blue)]">↗ +18% <small className="block pl-5 font-normal text-[var(--muted)]">this week</small></span>
            <span className="absolute right-[2%] top-[48%] text-3xl text-[#ffbe2e]" aria-hidden="true">✧</span>
          </div>
        </section>

        <section className="pb-8" aria-labelledby="how-title">
          <h2 id="how-title" className="mb-8 text-center text-2xl font-black">How it works</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map(([icon, title, copy]) => (
              <article className="card flex items-center gap-4 p-5" key={title}>
                <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-[#eef1ff] text-2xl text-[var(--blue)]" aria-hidden="true">{icon}</span>
                <div><h3 className="font-black">{title}</h3><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{copy}</p></div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
