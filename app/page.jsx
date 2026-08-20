import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'

import { LanguageSwitch } from '@/components/language-switch.jsx'
import { Logo } from '@/components/logo.jsx'
import { authOptions } from '@/lib/auth.js'
import { getMessages } from '@/lib/i18n.js'
import { getLocale } from '@/lib/locale.js'

export default async function LandingPage() {
  const session = await getServerSession(authOptions)
  const locale = await getLocale()
  const copy = getMessages(locale)
  const destination = session ? '/dashboard' : '/login'

  return (
    <main className="shell min-h-screen py-6 sm:py-8">
        <header className="flex items-center justify-between gap-4">
          <Logo copy={copy.logo} />
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitch locale={locale} />
            <Link className="rounded-full px-3 py-2 text-sm font-bold hover:bg-white/70 sm:px-4" href={destination}>{session ? copy.common.dashboard : copy.common.signIn} <span aria-hidden="true">→</span></Link>
          </div>
        </header>

        <section className="grid min-h-[calc(100vh-7rem)] items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-8" aria-labelledby="hero-title">
          <div className="relative z-10 max-w-xl">
            <span className="mb-5 inline-block text-2xl text-[#ff66a3]" aria-hidden="true">⌁</span>
            <h1 id="hero-title" className="editorial text-[clamp(3.5rem,7vw,6rem)] leading-[0.88] tracking-[-0.045em]">{copy.landing.headline[0]}<br />{copy.landing.headline[1]}<br /><i className="font-medium text-[var(--blue)]">{copy.landing.headline[2]}</i></h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-[var(--muted)]">{copy.landing.description}</p>
            <Link className="button mt-8 min-w-64" href={destination}>{copy.landing.cta} <span aria-hidden="true">→</span></Link>
            <p className="mt-4 text-sm text-[var(--muted)]">{copy.landing.note}</p>
          </div>

          <div className="relative mx-auto h-[29rem] w-full max-w-[38rem] sm:h-[35rem]" aria-label={copy.landing.collage}>
            <div className="absolute left-[4%] top-[20%] h-[55%] w-[30%] -rotate-3 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-xl"><Image className="object-cover" src="/images/mountains.webp" alt="Mountain travel Reel" fill sizes="180px" priority /></div>
            <div className="absolute left-[30%] top-0 h-[62%] w-[31%] rotate-1 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-xl"><Image className="object-cover" src="/images/cafe.webp" alt="Cafe lifestyle Reel" fill sizes="190px" priority /></div>
            <div className="absolute right-[7%] top-[18%] h-[57%] w-[30%] rotate-3 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-xl"><Image className="object-cover" src="/images/interior.webp" alt="Sunlit interior Reel" fill sizes="180px" /></div>
            <div className="absolute bottom-0 left-[42%] h-[47%] w-[29%] -rotate-2 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-xl"><Image className="object-cover" src="/images/portrait.webp" alt="Outdoor portrait Reel" fill sizes="175px" /></div>
            <span className="card absolute right-0 top-[11%] rounded-full px-5 py-3 font-black">◉ 128K <small className="block pl-5 font-normal text-[var(--muted)]">{copy.landing.views}</small></span>
            <span className="absolute right-[2%] top-[48%] text-3xl text-[#ffbe2e]" aria-hidden="true">✧</span>
          </div>
        </section>
    </main>
  )
}
