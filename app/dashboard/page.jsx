import { Dashboard } from './dashboard.jsx'
import { after } from 'next/server'
import { Header } from '@/components/header.jsx'
import { requireUser } from '@/lib/auth.js'
import { refreshStaleReelsForUser } from '@/lib/import-reel.js'
import { getRepository } from '@/lib/repository.js'

export default async function DashboardPage() {
  const user = await requireUser()
  const repository = getRepository()
  const dashboard = await repository.getDashboard(user.id)

  after(() => refreshStaleReelsForUser({
    userId: user.id,
    repository,
  }))

  return (
    <>
      <Header user={user} />
      <Dashboard user={user} initialDashboard={dashboard} />
    </>
  )
}
