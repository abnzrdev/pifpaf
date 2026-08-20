import { Dashboard } from './dashboard.jsx'
import { Header } from '@/components/header.jsx'
import { requireUser } from '@/lib/auth.js'
import { getRepository } from '@/lib/repository.js'

export default async function DashboardPage() {
  const user = await requireUser()
  const dashboard = await getRepository().getDashboard(user.id)

  return (
    <>
      <Header user={user} />
      <Dashboard user={user} initialDashboard={dashboard} />
    </>
  )
}
