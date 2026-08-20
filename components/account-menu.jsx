'use client'

import Image from 'next/image'
import { signOut } from 'next-auth/react'

export function AccountMenu({ user }) {
  return (
    <details className="group relative">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full p-1 pr-3 font-semibold marker:content-none">
        <Image className="size-9 rounded-full object-cover" src="/images/portrait.webp" alt="" width={36} height={36} />
        <span className="hidden sm:inline">{user.name}</span>
        <span className="text-xs text-[var(--muted)] transition group-open:rotate-180" aria-hidden="true">⌄</span>
      </summary>
      <div className="card absolute right-0 z-30 mt-2 w-64 p-3">
        <div className="border-b border-[var(--line)] px-3 pb-3">
          <p className="font-bold">{user.name}</p>
          <p className="truncate text-sm text-[var(--muted)]">{user.email}</p>
        </div>
        <button className="mt-2 min-h-11 w-full rounded-lg px-3 text-left font-semibold hover:bg-[#f3f5fb]" onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
      </div>
    </details>
  )
}
