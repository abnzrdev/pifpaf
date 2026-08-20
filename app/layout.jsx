import './globals.css'

export const metadata = {
  title: 'PifPaf AI for creators',
  description: 'Your Reels and results in one calm creator space.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
