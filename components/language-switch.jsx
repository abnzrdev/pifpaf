import { setLocale } from '@/app/locale-action.js'

export function LanguageSwitch({ locale }) {
  return (
    <form action={setLocale} className="flex rounded-full border border-[var(--line)] bg-white/70 p-1 text-xs font-bold" aria-label="Language / Язык">
      {['ru', 'en'].map((value) => (
        <button className={`min-h-8 rounded-full px-3 ${locale === value ? 'bg-[var(--navy)] text-white' : 'text-[var(--muted)] hover:text-[var(--navy)]'}`} name="locale" value={value} key={value} aria-pressed={locale === value}>{value.toUpperCase()}</button>
      ))}
    </form>
  )
}
