'use client'

import { useCallback, useRef, useState } from 'react'

import { ReelCard } from '@/components/reel-card.jsx'
import { ReelForm } from '@/components/reel-form.jsx'
import { ReelModal } from '@/components/reel-modal.jsx'
import { StatCard } from '@/components/stat-card.jsx'
import { Toast } from '@/components/toast.jsx'

export function Dashboard({ user, initialDashboard }) {
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
    setToast('Reel added to your Creator Space')
  }, [])
  const closeModal = useCallback(() => {
    setModalOpen(false)
    requestAnimationFrame(() => addButtonRef.current?.focus())
  }, [])
  const clearToast = useCallback(() => setToast(''), [])
  return (
    <main className="shell py-10 sm:py-14">
      <div className="mb-8">
        <p className="font-medium text-[var(--muted)]">Welcome back, {user.name} ✨</p>
        <h1 className="mt-2 text-[clamp(2.6rem,6vw,4rem)] font-black tracking-[-0.06em]">Your Creator Space</h1>
        <p className="mt-2 text-[var(--muted)]">See how your Reels are performing and keep everything together.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Reel totals">
        <StatCard icon="▣" label="Total Reels" value={stats.reelCount} />
        <StatCard icon="◉" label="Total Views" value={stats.totalViews} />
        <StatCard icon="☆" label="Best Reel" value={stats.bestReelViews ?? '—'} />
      </section>

      {reels.length === 0 ? (
        <EmptyDashboard onSuccess={importedFirst} />
      ) : (
        <ReturningDashboard reels={reels} addButtonRef={addButtonRef} onAdd={() => setModalOpen(true)} onRefresh={updateDashboard} />
      )}
      {modalOpen && <ReelModal onClose={closeModal} onSuccess={importedAnother} />}
      {toast && <Toast message={toast} onDone={clearToast} />}
    </main>
  )
}

function EmptyDashboard({ onSuccess }) {
  return (
    <section className="surface relative mx-auto mt-8 max-w-3xl overflow-hidden p-6 sm:mt-12 sm:p-10" aria-labelledby="first-reel-title">
      <span className="absolute right-8 top-7 text-3xl text-[#ff66a3]" aria-hidden="true">⌁</span>
      <ReelForm onSuccess={onSuccess} />
    </section>
  )
}

function ReturningDashboard({ reels, addButtonRef, onAdd, onRefresh }) {
  return (
    <section className="mt-12" aria-labelledby="reels-title">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 id="reels-title" className="text-2xl font-black">Your Reels</h2><p className="mt-1 text-[var(--muted)]">All your saved Reels in one place.</p></div>
        <button className="button" ref={addButtonRef} onClick={onAdd}>＋ Add Another Reel</button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {reels.map((reel) => <ReelCard key={reel.id} reel={reel} onRefresh={onRefresh} />)}
      </div>
      <p className="mx-auto mt-10 max-w-lg rounded-full bg-white/60 px-5 py-3 text-center text-sm text-[var(--muted)]">✦ Keep adding Reels to track your <strong className="text-[var(--blue)]">growth and storytelling.</strong></p>
    </section>
  )
}
