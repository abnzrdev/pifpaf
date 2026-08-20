'use client'

import { useActionState, useEffect } from 'react'

import { refreshReel } from '@/app/dashboard/actions.js'

const initialState = { ok: false, version: 0 }

export function RefreshButton({ reelId, onSuccess }) {
  const [state, action, pending] = useActionState(refreshReel, initialState)
  useEffect(() => {
    if (state.ok && state.dashboard) onSuccess(state.dashboard)
  }, [onSuccess, state])

  return (
    <form action={action} className="mt-2">
      <input type="hidden" name="reelId" value={reelId} />
      <button className="min-h-9 rounded-lg px-2 text-xs font-bold text-[var(--blue)] hover:bg-[#eef1ff]" disabled={pending}>{pending ? 'Refreshing…' : '↻ Refresh'}</button>
      {!state.ok && state.error && <p className="mt-1 text-xs text-[var(--danger)]" role="alert">{state.error}</p>}
    </form>
  )
}
