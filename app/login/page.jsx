import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import { Logo } from '@/components/logo.jsx'
import { LanguageSwitch } from '@/components/language-switch.jsx'
import { authOptions } from '@/lib/auth.js'
import { getMessages } from '@/lib/i18n.js'
import { getLocale } from '@/lib/locale.js'
import { LoginForm } from './login-form.jsx'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect('/dashboard')
  const locale = await getLocale()
  const copy = getMessages(locale)

  return (
    <main className="shell flex min-h-screen items-center justify-center py-8">
      <section className="surface grid w-full max-w-4xl overflow-hidden md:grid-cols-[1.05fr_0.95fr]" aria-labelledby="login-title">
        <div className="relative hidden min-h-[38rem] overflow-hidden bg-[#e9eeff] p-9 md:block">
          <Logo copy={copy.logo} />
          <div className="absolute inset-x-12 bottom-[-8rem] aspect-[9/16] w-[17rem] rotate-[-4deg] overflow-hidden rounded-[2rem] shadow-2xl">
            <Image className="object-cover" src="/images/portrait.webp" alt={copy.login.imageAlt} fill sizes="272px" priority />
          </div>
          <p className="editorial absolute left-10 top-28 max-w-xs text-5xl leading-[0.95]">{copy.login.imageCopy[0]}<br /><i className="font-medium text-[var(--blue)]">{copy.login.imageCopy[1]}</i></p>
          <span className="absolute right-12 top-24 text-3xl text-[#ff66a3]" aria-hidden="true">⌁</span>
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-12">
          <div className="mb-10 flex items-center justify-between md:justify-end"><span className="md:hidden"><Logo copy={copy.logo} /></span><LanguageSwitch locale={locale} /></div>
          <p className="mb-2 font-semibold text-[var(--blue)]">{copy.login.eyebrow}</p>
          <h1 id="login-title" className="editorial text-5xl leading-[0.95]">{copy.login.title}</h1>
          <p className="mt-3 text-[var(--muted)]">{copy.login.description}</p>
          <LoginForm copy={copy.login} />
        </div>
      </section>
    </main>
  )
}
