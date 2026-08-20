import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import WAButton from '@/components/WAButton'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'SPMB AIIS 2027/2028 — Penerimaan Murid Baru',
  description:
    'Sistem Penerimaan Murid Baru Al-Ikhlas Islamic Integrated School, Yayasan Al-Iman Pondok Pesantren Hidayatullah Kebumen. Tahun Ajaran 2027/2028.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <WAButton />
      </body>
    </html>
  )
}
