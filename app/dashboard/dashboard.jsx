'use client'

import { useCallback, useRef, useState } from 'react'

import { ReelCard } from '@/components/reel-card.jsx'
import { ReelForm } from '@/components/reel-form.jsx'
import { ReelModal } from '@/components/reel-modal.jsx'
import { StatCard } from '@/components/stat-card.jsx'
import { Toast } from '@/components/toast.jsx'

export function Dashboard({ user, initialDashboard, locale, copy }) {
  const [dashboard, setDashboard] = useState(initialDashboard)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState('')
  const addButtonRef = useRef(null)
  const { reels, stats } = dashboard
  const updateDashboard = useCallback((nextDashboard) => setDashboard(nextDashboard), [])
  const importedFirst = useCallback((nextDashboard) => {
    setDashboard(nextDashboard)
  }, [])
  const importedAnother = useCallback((nextDashboard) => {
    setDashboard(nextDashboard)
    setModalOpen(false)
    setToast(copy.dashboard.added)
  }, [copy.dashboard.added])
  const closeModal = useCallback(() => {
    setModalOpen(false)
    requestAnimationFrame(() => addButtonRef.current?.focus())
  }, [])
  const clearToast = useCallback(() => setToast(''), [])
  return (
    <main className="shell py-10 sm:py-14">
      <div className="mb-8">
        <p className="font-medium text-[var(--muted)]">{copy.dashboard.welcome}, {user.name} ✨</p>
        <h1 className="editorial mt-2 text-[clamp(3rem,6vw,4.75rem)] leading-none tracking-[-0.035em]">{copy.dashboard.title}</h1>
        <p className="mt-2 text-[var(--muted)]">{copy.dashboard.description}</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3" aria-label={copy.dashboard.totals}>
        <StatCard icon="▣" label={copy.dashboard.totalReels} value={stats.reelCount} />
        <StatCard icon="◉" label={copy.dashboard.totalViews} value={stats.totalViews} />
        <StatCard icon="☆" label={copy.dashboard.bestReel} value={stats.bestReelViews ?? '—'} />
      </section>

      {reels.length === 0 ? (
        <EmptyDashboard onSuccess={importedFirst} locale={locale} copy={copy} />
      ) : (
        <ReturningDashboard reels={reels} addButtonRef={addButtonRef} onAdd={() => setModalOpen(true)} onRefresh={updateDashboard} locale={locale} copy={copy} />
      )}
      {modalOpen && <ReelModal onClose={closeModal} onSuccess={importedAnother} locale={locale} copy={copy} />}
      {toast && <Toast message={toast} onDone={clearToast} />}
    </main>
  )
}

function EmptyDashboard({ onSuccess, locale, copy }) {
  return (
    <section className="surface relative mx-auto mt-8 max-w-3xl overflow-hidden p-6 sm:mt-12 sm:p-10" aria-labelledby="first-reel-title">
      <span className="absolute right-8 top-7 text-3xl text-[#ff66a3]" aria-hidden="true">⌁</span>
      <ReelForm onSuccess={onSuccess} locale={locale} copy={copy} />
    </section>
  )
}

function ReturningDashboard({ reels, addButtonRef, onAdd, onRefresh, locale, copy }) {
  return (
    <section className="mt-12" aria-labelledby="reels-title">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 id="reels-title" className="editorial text-4xl">{copy.dashboard.yourReels}</h2><p className="mt-1 text-[var(--muted)]">{copy.dashboard.reelsDescription}</p></div>
        <button className="button" ref={addButtonRef} onClick={onAdd}>＋ {copy.dashboard.addAnother}</button>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reels.map((reel) => <ReelCard key={reel.id} reel={reel} onRefresh={onRefresh} locale={locale} copy={copy} />)}
      </div>
      <p className="mx-auto mt-10 max-w-lg rounded-full bg-white/60 px-5 py-3 text-center text-sm text-[var(--muted)]">✦ {copy.dashboard.growth}</p>
    </section>
  )
}
