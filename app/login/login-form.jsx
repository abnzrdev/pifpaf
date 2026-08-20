'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LoginForm({ copy }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setPending(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const result = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    })
    if (!result?.ok) {
      setError(copy.error)
      setPending(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={submit}>
      <label className="block font-semibold">
        {copy.email}
        <input className="mt-2 min-h-12 w-full rounded-xl border border-[var(--line)] bg-white px-4 font-normal" name="email" type="email" autoComplete="email" defaultValue="demo@pifpaf.ai" required />
      </label>
      <label className="block font-semibold">
        {copy.password}
        <input className="mt-2 min-h-12 w-full rounded-xl border border-[var(--line)] bg-white px-4 font-normal" name="password" type="password" autoComplete="current-password" defaultValue="PifPafDemo!2026" minLength={8} required />
      </label>
      <p className="min-h-6 text-sm font-semibold text-[var(--danger)]" role="alert" aria-live="polite">{error}</p>
      <button className="button w-full" disabled={pending}>{pending ? copy.pending : copy.submit}</button>
      <div className="rounded-2xl border border-[#cdd8ff] bg-[#eef2ff] p-4 text-sm shadow-[0_10px_30px_rgb(51_93_255/10%)]">
        <p className="mb-3 font-black text-[var(--navy)]">✦ {copy.accounts}</p>
        <div className="space-y-2">
          <p className="rounded-xl bg-white/80 px-3 py-2"><strong className="text-[var(--blue)]">{copy.demo}</strong><br /><span className="font-semibold text-[var(--navy)]">demo@pifpaf.ai</span> <span className="text-[var(--muted)]">/ PifPafDemo!2026</span></p>
          <p className="rounded-xl bg-white/80 px-3 py-2"><strong className="text-[var(--blue)]">{copy.empty}</strong><br /><span className="font-semibold text-[var(--navy)]">empty@pifpaf.ai</span> <span className="text-[var(--muted)]">/ PifPafDemo!2026</span></p>
        </div>
      </div>
    </form>
  )
}
