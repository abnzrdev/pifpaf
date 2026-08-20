'use client'

import { useActionState, useEffect, useState } from 'react'

import { importReel } from '@/app/dashboard/actions.js'
import { normalizeReelUrl } from '@/lib/reels.js'
import { ImportStatus } from './import-status.jsx'

const initialState = { ok: false, version: 0 }

export function ReelForm({ mode = 'first', onPendingChange, onSuccess }) {
  const [state, action, pending] = useActionState(importReel, initialState)
  const [url, setUrl] = useState('')
  const valid = isValid(url)

  useEffect(() => onPendingChange?.(pending), [onPendingChange, pending])
  useEffect(() => {
    if (state.ok && state.dashboard) onSuccess(state.dashboard)
  }, [onSuccess, state])

  const title = pending ? 'Fetching your Reel ✨' : mode === 'modal' ? 'Add a new Reel' : 'Add your first Reel ✨'
  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#eef1ff] text-3xl text-[var(--blue)]" aria-hidden="true">🔗</span>
        <div>
          <h2 id={mode === 'modal' ? 'reel-modal-title' : 'first-reel-title'} className="text-2xl font-black">{title}</h2>
          <p className="mt-1 text-[var(--muted)]">{pending ? 'PifPaf is collecting the latest public data from Instagram.' : 'Paste a public Instagram Reel link to begin.'}</p>
        </div>
      </div>
      <form action={action}>
        <label className="sr-only" htmlFor={`${mode}-reel-url`}>Instagram Reel URL</label>
        <input
          id={`${mode}-reel-url`}
          className="min-h-13 w-full rounded-xl border border-[var(--line)] bg-white px-4 disabled:bg-[#f7f8fb]"
          name="url"
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://www.instagram.com/reel/…"
          readOnly={pending}
          type="url"
          value={url}
          required
          autoFocus={mode === 'modal'}
          aria-describedby={`${mode}-reel-error`}
        />
        <p id={`${mode}-reel-error`} className="mt-2 min-h-5 text-sm font-semibold text-[var(--danger)]" role="alert">{state.fieldError || state.error || ''}</p>
        {pending && <ImportStatus />}
        <button className="button mt-4 w-full" disabled={!valid || pending}>
          {pending ? 'Fetching Reel Data…' : 'Fetch Reel Data'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-[var(--muted)]">🔒 Only public Reel information is accessed.</p>
    </div>
  )
}

function isValid(value) {
  try {
    normalizeReelUrl(value)
    return true
  } catch {
    return false
  }
}
