import { AccountMenu } from './account-menu.jsx'
import { Logo } from './logo.jsx'
import { LanguageSwitch } from './language-switch.jsx'

export function Header({ user, locale, copy }) {
  return (
    <header className="border-b border-[var(--line)] bg-white/90 backdrop-blur">
      <div className="shell flex min-h-18 items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo copy={copy.logo} />
          <span className="hidden border-l border-[var(--line)] pl-8 font-bold md:block">{copy.common.dashboard}</span>
        </div>
        <div className="flex items-center gap-3"><LanguageSwitch locale={locale} /><AccountMenu user={user} signOutLabel={copy.common.signOut} /></div>
      </div>
    </header>
  )
}
