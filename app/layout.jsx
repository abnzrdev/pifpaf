import './globals.css'
import { Cormorant_Garamond } from 'next/font/google'

import { getLocale } from '@/lib/locale.js'

const editorial = Cormorant_Garamond({
  subsets: ['cyrillic', 'latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-editorial',
})

export const metadata = {
  title: 'PifPaf AI for creators',
  description: 'Your Reels and results in one calm creator space.',
}

export default async function RootLayout({ children }) {
  const locale = await getLocale()
  return (
    <html lang={locale} className={editorial.variable}>
      <body>{children}</body>
    </html>
  )
}
