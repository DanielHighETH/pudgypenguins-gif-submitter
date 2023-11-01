import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const kvant = localFont({
  src: '/fonts/Kvant - Menco-Medium.otf',
  display: 'swap',
  variable: '--font-kvant',
})

const typeType = localFont({
  src: '/fonts/TypeType - TT Trailers ExtraBold.otf',
  display: 'swap',
  variable: '--font-typeType',
})

const fobble = localFont({
  src: '/fonts/Fobble_regular-Regular.otf',
  display: 'swap',
  variable: '--font-fobble',
})


export const metadata: Metadata = {
  title: 'PudgyPenguins Gif Submitter',
  description: 'Created by DanielHigh',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${kvant.variable} ${typeType.variable} ${fobble.variable}`}>{children}</body>
    </html>
  )
}
