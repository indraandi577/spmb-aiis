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

const STATS = [
  { label: 'Unit Pendidikan', value: '3', icon: '🏫' },
  { label: 'Tahun Berdiri', value: '2005', icon: '📅' },
  { label: 'Alumni', value: '1000+', icon: '🎓' },
  { label: 'Tenaga Pendidik', value: '50+', icon: '👨‍🏫' },
]

export default function HomePage() {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      {/* ─── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 overflow-hidden">

        {/* Decorative blobs */}
        <div className="blob w-96 h-96 bg-blue-400/20 top-[-80px] right-[-60px]" />
        <div className="blob w-72 h-72 bg-sky-300/10 bottom-20 left-[-40px]" />
        <div className="blob w-56 h-56 bg-indigo-400/20 top-1/2 left-1/3" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top bar */}
        <div className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <p className="text-blue-200 text-xs font-medium tracking-wide">
              Yayasan Al-Iman · PP Hidayatullah Kebumen
            </p>
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow inline-block" />
              Pendaftaran Dibuka
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-16">

          {/* Logos row */}
          <div className="animate-fade-up flex items-center justify-center gap-4 mb-8">
            {['/logo-tk.png', '/logo-sd.png', '/logo-smp.png'].map((src, i) => (
              <div
                key={i}
                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden p-2 shadow-lg"
              >
                <Image src={src} alt="logo" width={52} height={52} className="object-contain w-full h-full" />
              </div>
            ))}
          </div>

          {/* Kalimat pembuka islami */}
          <p className="animate-fade-up text-blue-300 text-sm md:text-base font-medium tracking-widest mb-3 font-arabic">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>

          <h1 className="animate-fade-up-delay-1 text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Selamat Datang di
            <span className="block text-blue-300 text-lg md:text-xl font-medium mt-2 mb-1">
               Pesantren Hidayatullah Kebumen
            </span>
            <span className="block text-blue-300 text-lg md:text-xl font-medium mt-2 mb-1">
               Yayasan Al-Iman 
            </span>
            <span className="block text-sky-300 mt-1">SPMB AIIS</span>
            <span className="block text-2xl md:text-3xl font-semibold text-blue-200 mt-2">
              Tahun Ajaran 2027/2028
            </span>
          </h1>

          <p className="animate-fade-up-delay-2 text-blue-200 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-3">
            Sistem Penerimaan Murid Baru — <strong className="text-white">Al-Iman Islamic Integrated School</strong>
          </p>

          {/* Tagline / quote */}
          <div className="animate-fade-up-delay-2 inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl px-5 py-3 mb-10 max-w-md">
            <span className="text-xl">🌟</span>
            <p className="text-blue-100 text-sm italic">
              "Membentuk generasi beriman, berilmu, dan berakhlak mulia"
            </p>
          </div>

          {/* CTA buttons */}
          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row gap-3 items-center">
            <a
              href="#daftar"
              className="group inline-flex items-center gap-2 bg-sky-400 hover:bg-sky-300 text-blue-950 font-bold px-8 py-3.5 rounded-xl text-base shadow-lg shadow-sky-400/30 transition-all duration-200 hover:scale-[1.03]"
            >
              Daftar Sekarang
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="#alur"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-6 py-3.5 rounded-xl text-base backdrop-blur-sm transition-all duration-200"
            >
              Lihat Alur Pendaftaran
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-white font-bold text-xl">{s.value}</div>
                <div className="text-blue-300 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-blue-300/60 text-xs">
          <span>scroll</span>
          <div className="w-px h-6 bg-blue-300/40 animate-pulse-slow" />
        </div>
      </section>

      {/* ─── ALUR PENDAFTARAN ─────────────────────────────────────── */}
      <section id="alur" className="bg-slate-50 py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Alur Pendaftaran
            </span>
            <h2 className="text-2xl font-bold text-slate-800">Cara Mendaftarkan Putra-Putri Anda</h2>
          </div>

          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-blue-100 hidden md:block" />

            <div className="space-y-5">
              {[
                {
                  no: '1',
                  icon: '📝',
                  title: 'Lengkapi Formulir',
                  desc: 'Isi formulir pendaftaran secara online dengan data yang benar dan lengkap sesuai dokumen resmi.',
                },
                {
                  no: '2',
                  icon: '💳',
                  title: 'Infaq Pendaftaran',
                  desc: 'Lakukan infaq pendaftaran sesuai ketentuan unit yang dipilih setelah formulir berhasil diisi.',
                },
                {
                  no: '3',
                  icon: '📤',
                  title: 'Upload Bukti Infaq',
                  desc: 'Upload foto/screenshot bukti transfer infaq pendaftaran untuk proses verifikasi dan konfirmasi.',
                },
                {
                  no: '4',
                  icon: '📱',
                  title: 'Konfirmasi WhatsApp',
                  desc: 'Tim kami akan menghubungi Anda melalui WhatsApp untuk informasi dan proses penerimaan selanjutnya.',
                },
              ].map((step) => (
                <div key={step.no} className="relative flex gap-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-blue-200 z-10">
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                        Langkah {step.no}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-base">{step.title}</h3>
                    <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PILIH UNIT DAFTAR ────────────────────────────────────── */}
      <section id="daftar" className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">

          {/* Section heading */}
          <div className="text-center mb-10">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Pendaftaran Online
            </span>
            <h2 className="text-2xl font-bold text-slate-800">Pilih Unit Sekolah</h2>
            <p className="text-slate-500 text-sm mt-2">Pilih unit sesuai usia dan jenjang pendidikan yang dituju</p>
          </div>

          {/* Unit Group Cards */}
          <div className="grid gap-5 md:grid-cols-3">
            {UNIT_GROUPS.map((group) => {
              const { r, g, b } = hexToRgb(group.warna)
              const isExpanded = expandedGroup === group.id
              const hasSubUnits = group.subUnits.length > 0
              const subUnits = UNITS.filter((u) => group.subUnits.includes(u.id))

              if (hasSubUnits) {
                return (
                  <div
                    key={group.id}
                    className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden shadow-sm ${
                      isExpanded ? 'md:col-span-3' : 'hover:shadow-lg'
                    }`}
                    style={{
                      borderColor: isExpanded ? `rgba(${r},${g},${b},0.5)` : '#e2e8f0',
                    }}
                  >
                    {/* Header */}
                    <button
                      type="button"
                      onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                      className="w-full text-left p-5 flex items-center gap-4 hover:bg-slate-50 transition"
                    >
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden p-1.5 shrink-0 shadow-md"
                        style={{ background: `linear-gradient(135deg, rgba(${r},${g},${b},0.15), rgba(${r},${g},${b},0.05))`, border: `1.5px solid rgba(${r},${g},${b},0.2)` }}
                      >
                        <Image src={group.logo} alt={`Logo ${group.nama}`} width={52} height={52} className="object-contain w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-base leading-tight">{group.nama}</h3>
                        <p className="text-slate-500 text-xs mt-0.5">{group.deskripsi}</p>
                        <span
                          className="inline-flex items-center gap-1 text-white text-xs font-semibold px-3 py-1 rounded-full mt-2 shadow-sm"
                          style={{ background: `linear-gradient(135deg, ${group.warna}, rgba(${r},${g},${b},0.75))` }}
                        >
                          {isExpanded ? '▲ Tutup' : '▼ Pilih Kelas'}
                        </span>
                      </div>
                    </button>

                    {/* Sub-units */}
                    {isExpanded && (
                      <div
                        className="px-5 pb-6 border-t"
                        style={{ borderColor: `rgba(${r},${g},${b},0.15)`, background: `rgba(${r},${g},${b},0.02)` }}
                      >
                        <p className="text-xs text-slate-500 font-semibold mt-4 mb-3 uppercase tracking-wide">
                          Pilih kelas sesuai usia anak:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {subUnits.map((sub) => {
                            const { r: sr, g: sg, b: sb } = hexToRgb(sub.warna)
                            return (
                              <Link
                                key={sub.id}
                                href={`/daftar/${sub.id}`}
                                className="group flex flex-col items-center text-center rounded-xl border-2 bg-white p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                                style={{ borderColor: `rgba(${sr},${sg},${sb},0.2)` }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = `rgba(${sr},${sg},${sb},0.6)`
                                  e.currentTarget.style.background = `rgba(${sr},${sg},${sb},0.04)`
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = `rgba(${sr},${sg},${sb},0.2)`
                                  e.currentTarget.style.background = 'white'
                                }}
                              >
                                <span
                                  className="text-white text-xs font-bold px-2.5 py-1 rounded-full mb-2 shadow-sm"
                                  style={{ background: `linear-gradient(135deg, ${sub.warna}, rgba(${sr},${sg},${sb},0.7))` }}
                                >
                                  {sub.singkatan}
                                </span>
                                <p className="text-slate-700 font-bold text-sm leading-tight">{sub.nama}</p>
                                <p className="text-slate-400 text-xs mt-1">{sub.deskripsi}</p>
                                <span
                                  className="mt-3 text-xs font-semibold group-hover:underline"
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
                  className="group block rounded-2xl border-2 border-slate-200 p-5 bg-white shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                >
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden p-2 mb-4 shadow-md"
                    style={{ background: `linear-gradient(135deg, rgba(${r},${g},${b},0.15), rgba(${r},${g},${b},0.05))`, border: `1.5px solid rgba(${r},${g},${b},0.2)` }}
                  >
                    <Image
                      src={group.logo}
                      alt={`Logo ${group.nama}`}
                      width={56}
                      height={56}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{group.nama}</h3>
                  <p className="text-slate-500 text-sm mt-1 mb-4">{group.deskripsi}</p>

                  <span
                    className="inline-flex items-center gap-1 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md group-hover:scale-[1.03] transition-transform"
                    style={{ background: `linear-gradient(135deg, ${group.warna}, rgba(${r},${g},${b},0.75))` }}
                  >
                    Daftar Sekarang →
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────── */}
      <footer className="bg-blue-950 text-blue-300 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="text-center md:text-left">
            <p className="font-semibold text-white">SPMB AIIS 2027/2028</p>
            <p className="text-blue-400 text-xs mt-0.5">Yayasan Al-Iman · PP Hidayatullah Kebumen</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-blue-400">
            <Link href="/admin" className="hover:text-white transition-colors">Admin Panel</Link>
            <span>·</span>
            <span>© 2027 AIIS</span>
          </div>
        </div>
      </footer>

    </main>
  )
}
