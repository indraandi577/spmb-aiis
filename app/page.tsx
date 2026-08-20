'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { UNITS, UNIT_GROUPS } from '@/lib/constants'

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

export default function HomePage() {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-5 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
            Yayasan Al-Iman Pondok Pesantren Hidayatullah Kebumen
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            SPMB AIIS 2027/2028
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Sistem Penerimaan Murid Baru · Tahun Ajaran 2027/2028
          </p>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mt-2 border border-green-200">
            📋 Pendaftaran Dibuka
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-slate-700">Pilih Unit Sekolah</h2>
          <p className="text-slate-500 text-sm mt-1">
            Pilih unit sekolah yang ingin Anda daftarkan
          </p>
        </div>

        {/* Unit Group Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {UNIT_GROUPS.map((group) => {
            const { r, g, b } = hexToRgb(group.warna)
            const isExpanded = expandedGroup === group.id
            const hasSubUnits = group.subUnits.length > 0
            const subUnits = UNITS.filter((u) => group.subUnits.includes(u.id))

            if (hasSubUnits) {
              return (
                <div
                  key={group.id}
                  className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                    isExpanded ? 'md:col-span-3' : ''
                  }`}
                  style={{
                    backgroundColor: `rgba(${r},${g},${b},0.06)`,
                    borderColor: isExpanded
                      ? `rgba(${r},${g},${b},0.6)`
                      : `rgba(${r},${g},${b},0.25)`,
                  }}
                >
                  {/* Group Header — klik untuk expand */}
                  <button
                    type="button"
                    onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                    className="w-full text-left p-6 flex items-start gap-4 hover:bg-white/40 transition"
                  >
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden p-1.5 shrink-0">
                      <Image
                        src={group.logo}
                        alt={`Logo ${group.nama}`}
                        width={56}
                        height={56}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-base leading-tight">
                        {group.nama}
                      </h3>
                      <p className="text-slate-500 text-sm mt-1">{group.deskripsi}</p>
                      <span
                        className="inline-flex items-center gap-1 text-white text-xs font-medium px-3 py-1 rounded-full mt-3"
                        style={{ backgroundColor: group.warna }}
                      >
                        {isExpanded ? '▲ Tutup pilihan' : '▼ Pilih kelas'}
                      </span>
                    </div>
                  </button>

                  {/* Sub-unit Grid */}
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <p className="text-xs text-slate-500 mb-3 font-medium">
                        Pilih kelas sesuai usia anak:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {subUnits.map((sub) => {
                          const { r: sr, g: sg, b: sb } = hexToRgb(sub.warna)
                          return (
                            <Link
                              key={sub.id}
                              href={`/daftar/${sub.id}`}
                              className="flex flex-col items-center text-center rounded-xl border-2 p-4 bg-white hover:scale-[1.03] hover:shadow-md transition-all duration-150"
                              style={{ borderColor: `rgba(${sr},${sg},${sb},0.35)` }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = `rgba(${sr},${sg},${sb},0.7)`
                                e.currentTarget.style.backgroundColor = `rgba(${sr},${sg},${sb},0.06)`
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = `rgba(${sr},${sg},${sb},0.35)`
                                e.currentTarget.style.backgroundColor = 'white'
                              }}
                            >
                              {/* Badge singkatan */}
                              <span
                                className="text-white text-xs font-bold px-2.5 py-0.5 rounded-full mb-2"
                                style={{ backgroundColor: sub.warna }}
                              >
                                {sub.singkatan}
                              </span>
                              <p className="text-slate-700 font-semibold text-sm leading-tight">
                                {sub.singkatan === 'TPA'
                                  ? 'Daycare'
                                  : sub.singkatan === 'KB'
                                  ? 'Kelompok Bermain'
                                  : sub.singkatan === 'TK A'
                                  ? 'RA A'
                                  : 'RA B'}
                              </p>
                              <p className="text-slate-400 text-xs mt-1">{sub.deskripsi}</p>
                              <span
                                className="mt-3 text-xs font-medium"
                                style={{ color: sub.warna }}
                              >
                                Daftar →
                              </span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            }

            // Card biasa (SDIT, SMP)
            return (
              <Link
                key={group.id}
                href={`/daftar/${group.id}`}
                className="block rounded-2xl border-2 p-6 transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-md"
                style={{
                  backgroundColor: `rgba(${r},${g},${b},0.06)`,
                  borderColor: `rgba(${r},${g},${b},0.25)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `rgba(${r},${g},${b},0.6)`
                  e.currentTarget.style.backgroundColor = `rgba(${r},${g},${b},0.1)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `rgba(${r},${g},${b},0.25)`
                  e.currentTarget.style.backgroundColor = `rgba(${r},${g},${b},0.06)`
                }}
              >
                {/* Logo */}
                <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4 overflow-hidden p-2">
                  <Image
                    src={group.logo}
                    alt={`Logo ${group.nama}`}
                    width={72}
                    height={72}
                    className="object-contain w-full h-full"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      target.style.display = 'none'
                      const span = target.nextElementSibling as HTMLElement
                      if (span) span.style.display = 'flex'
                    }}
                  />
                  <span className="text-3xl hidden items-center justify-center w-full h-full">
                    {group.iconFallback}
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 text-lg leading-tight">
                  {group.nama}
                </h3>
                <p className="text-slate-500 text-sm mt-1 mb-4">{group.deskripsi}</p>

                <div
                  className="inline-flex items-center gap-1 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: group.warna }}
                >
                  Daftar Sekarang →
                </div>
              </Link>
            )
          })}
        </div>

        {/* Info */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-semibold mb-3">📋 Alur Pendaftaran</p>
          <ol className="space-y-2 text-amber-700">
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center">1</span>
              <span>Lengkapi formulir pendaftaran dengan data yang benar dan lengkap</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center">2</span>
              <span>Lakukan infaq pendaftaran sesuai ketentuan, setelah formulir berhasil diisi</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center">3</span>
              <span>Upload bukti infaq pendaftaran untuk proses verifikasi dan konfirmasi</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center">4</span>
              <span>Tim kami akan menghubungi Anda melalui WhatsApp untuk informasi dan proses selanjutnya</span>
            </li>
          </ol>
        </div>

        {/* Footer link admin */}
        <div className="text-center mt-8">
          <Link href="/admin" className="text-slate-400 hover:text-slate-600 text-xs transition-colors">
            Admin Panel →
          </Link>
        </div>
      </div>
    </main>
  )
}
