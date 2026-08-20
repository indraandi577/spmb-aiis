'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { UNITS } from '@/lib/constants'

export default function SelesaiPage() {
  const params = useParams()
  const unitId = params.unit as string
  const unit = UNITS.find((u) => u.id === unitId)

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/" className="text-blue-500 hover:underline">← Kembali ke Beranda</Link>
      </div>
    )
  }

  const waUrl = `https://wa.me/${unit.nomorWA}?text=${encodeURIComponent(
    `Assalamu'alaikum, saya telah mengisi formulir pendaftaran dan mengirimkan bukti pembayaran untuk ${unit.nama} SPMB 2027/2028. Mohon konfirmasinya. Terima kasih.`
  )}`

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">✅</span>
          </div>

          <h1 className="text-xl font-bold text-slate-800 mb-2">
            Pendaftaran Berhasil!
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Data dan bukti pembayaran Anda untuk <strong>{unit.nama}</strong> telah berhasil dikirim.
            Tim kami akan segera memverifikasi.
          </p>

          {/* Steps */}
          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-3 mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Langkah Selanjutnya</p>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <p className="text-sm text-slate-600">Data dan bukti bayar Anda sudah kami terima</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <p className="text-sm text-slate-600">Hubungi WhatsApp sekolah untuk tindak lanjut dan konfirmasi</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-300 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <p className="text-sm text-slate-600">Tim kami akan menghubungi Anda untuk info selanjutnya</p>
            </div>
          </div>

          {/* WA Button */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition mb-3"
          >
            💬 Chat WhatsApp Sekolah
          </a>

          <Link
            href="/"
            className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-3 rounded-xl transition text-sm"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  )
}
