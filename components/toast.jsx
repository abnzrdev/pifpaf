'use client'

import { useEffect } from 'react'

export function Toast({ message, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3200)
    return () => clearTimeout(timer)
  }, [onDone])

  return <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[var(--navy)] px-5 py-3 font-bold text-white shadow-2xl" role="status">✓ {message}</div>
}
