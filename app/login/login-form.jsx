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
      <div className="rounded-xl bg-[#f3f5fb] p-4 text-sm text-[var(--muted)]">
        <strong className="text-[var(--navy)]">{copy.demo}:</strong> demo@pifpaf.ai / PifPafDemo!2026
        <br />{copy.empty}: empty@pifpaf.ai / PifPafDemo!2026
      </div>
    </form>
  )
}
