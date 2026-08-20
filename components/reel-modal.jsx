'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ReelForm } from './reel-form.jsx'

export function ReelModal({ onClose, onSuccess, locale, copy }) {
  const dialogRef = useRef(null)
  const pendingRef = useRef(false)
  const [pending, setPending] = useState(false)
  const pendingChanged = useCallback((value) => {
    pendingRef.current = value
    setPending(value)
  }, [])
  const close = useCallback(() => {
    if (!pending) dialogRef.current?.close()
  }, [pending])

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    function cancel(event) {
      if (pendingRef.current) event.preventDefault()
    }
    function keydown(event) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      if (!pendingRef.current) dialog.close()
    }
    dialog.addEventListener('cancel', cancel)
    dialog.addEventListener('keydown', keydown)
    return () => {
      dialog.removeEventListener('cancel', cancel)
      dialog.removeEventListener('keydown', keydown)
    }
  }, [])

  return (
    <dialog className="reel-dialog m-auto w-[min(calc(100%-2rem),38rem)] rounded-[1.5rem] border-0 bg-white p-0 text-[var(--navy)] shadow-2xl" ref={dialogRef} onClose={onClose} aria-labelledby="reel-modal-title">
      <div className="relative p-6 sm:p-9">
        <button className="absolute right-5 top-4 grid size-11 place-items-center rounded-full text-2xl hover:bg-[#f2f4fa]" type="button" onClick={close} disabled={pending} aria-label={copy.common.close}>×</button>
        <div className="mb-5 text-center"><span className="rounded-full bg-[#edf1ff] px-3 py-1 text-xs font-bold text-[var(--blue)]">{copy.import.badge}</span></div>
        <ReelForm mode="modal" onPendingChange={pendingChanged} onSuccess={onSuccess} locale={locale} copy={copy} />
      </div>
    </dialog>
  )
}
