export const UNITS = [
  // ── KB-TK sub-unit ─────────────────────────────────────────────
  {
    id: 'kb',
    nama: 'Kelompok Bermain (KB)',
    singkatan: 'KB',
    warna: '#fd0290',
    deskripsi: 'Usia 2–3 tahun',
    usiaMin: 2,
    usiaMax: 3,
    parentId: 'kb-tk',
    noRekening: '1033923046',
    namaBank: 'Bank Syariah Indonesia (BSI)',
    nomorWA: '6285166458827',
    biayaPendaftaran: 150000,
  },
  {
    id: 'tpa',
    nama: 'Taman Pengasuhan Anak (TPA)',
    singkatan: 'TPA',
    warna: '#ff66c4',
    deskripsi: 'Usia 0–2 tahun',
    usiaMin: 0,
    usiaMax: 2,
    parentId: 'kb-tk',
    noRekening: '1033923046',
    namaBank: 'Bank Syariah Indonesia (BSI)',
    nomorWA: '6285166458827',
    biayaPendaftaran: 150000,
  },
  {
    id: 'tka',
    nama: 'TK A (Taman Kanak-Kanak A)',
    singkatan: 'TK A',
    warna: '#c2006e',
    deskripsi: 'Usia 4–5 tahun',
    usiaMin: 4,
    usiaMax: 5,
    parentId: 'kb-tk',
    noRekening: '1033923046',
    namaBank: 'Bank Syariah Indonesia (BSI)',
    nomorWA: '6285166458827',
    biayaPendaftaran: 150000,
  },
  {
    id: 'tkb',
    nama: 'TK B (Taman Kanak-Kanak B)',
    singkatan: 'TK B',
    warna: '#8b004d',
    deskripsi: 'Usia 5–6 tahun',
    usiaMin: 5,
    usiaMax: 6,
    parentId: 'kb-tk',
    noRekening: '1033923046',
    namaBank: 'Bank Syariah Indonesia (BSI)',
    nomorWA: '6285166458827',
    biayaPendaftaran: 150000,
  },
  // ── SD ─────────────────────────────────────────────────────────
  {
    id: 'sdit',
    nama: 'SDIT Al-Madinah',
    singkatan: 'SDIT',
    warna: '#ff0000',
    deskripsi: 'Sekolah Dasar Islam Terpadu',
    usiaMin: 6,
    usiaMax: 13,
    parentId: null,
    noRekening: '1033923046',
    namaBank: 'Bank Syariah Indonesia (BSI)',
    nomorWA: '6285166458827',
    biayaPendaftaran: 200000,
  },
  // ── SMP ────────────────────────────────────────────────────────
  {
    id: 'smp',
    nama: 'SMP Integral Hidayatullah',
    singkatan: 'SMP',
    warna: '#007c92',
    deskripsi: 'Sekolah Menengah Pertama Integral',
    usiaMin: 12,
    usiaMax: 16,
    parentId: null,
    noRekening: '1033923046',
    namaBank: 'Bank Syariah Indonesia (BSI)',
    nomorWA: '6285166458827',
    biayaPendaftaran: 250000,
  },
]

/** Semua unit yang tampil sebagai grup utama di halaman beranda */
export const UNIT_GROUPS = [
  {
    id: 'kb-tk',
    nama: 'KB-TK Yaa Bunayya',
    singkatan: 'KB-TK',
    warna: '#fd0290',
    deskripsi: 'Kelompok Bermain & Taman Kanak-Kanak',
    logo: '/logo-tk.png',
    iconFallback: '🌱',
    subUnits: ['tpa', 'kb', 'tka', 'tkb'],
  },
  {
    id: 'sdit',
    nama: 'SDIT Al-Madinah',
    singkatan: 'SDIT',
    warna: '#ff0000',
    deskripsi: 'Sekolah Dasar Islam Terpadu',
    logo: '/logo-sd.png',
    iconFallback: '📚',
    subUnits: [],
  },
  {
    id: 'smp',
    nama: 'SMP Integral Hidayatullah',
    singkatan: 'SMP',
    warna: '#007c92',
    deskripsi: 'Sekolah Menengah Pertama Integral',
    logo: '/logo-smp.png',
    iconFallback: '🎓',
    subUnits: [],
  },
]

export type Unit = (typeof UNITS)[number]
export type UnitGroup = (typeof UNIT_GROUPS)[number]

export const ADMIN_WA = '6285166458827'

export const ADMIN_CREDENTIALS = {
  username: 'admin',
}
