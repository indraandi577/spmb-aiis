import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import WAButton from '@/components/WAButton'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SPMB AIIS 2027/2028 - Sistem Penerimaan Murid Baru',
  description: 'Pendaftaran murid baru Al-Ikhlas Islamic Integrated School tahun ajaran 2027/2028',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={geist.className}>
        {children}
        <WAButton />
      </body>
    </html>
  )
}
