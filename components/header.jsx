import { AccountMenu } from './account-menu.jsx'
import { Logo } from './logo.jsx'

export function Header({ user }) {
  return (
    <header className="border-b border-[var(--line)] bg-white/90 backdrop-blur">
      <div className="shell flex min-h-18 items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <span className="hidden border-l border-[var(--line)] pl-8 font-bold md:block">Dashboard</span>
        </div>
        <AccountMenu user={user} />
      </div>
    </header>
  )
}
