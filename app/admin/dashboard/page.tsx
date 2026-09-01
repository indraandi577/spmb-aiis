'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DataPendaftaran } from '@/lib/types'
import { UNITS } from '@/lib/constants'

const statusBadge: Record<string, string> = {
  pending:  'bg-yellow-100 text-yellow-700 border border-yellow-300',
  verified: 'bg-green-100  text-green-700  border border-green-300',
  rejected: 'bg-red-100    text-red-600    border border-red-300',
}
const statusLabel: Record<string, string> = {
  pending:  '⏳ Menunggu',
  verified: '✅ Terverifikasi',
  rejected: '❌ Ditolak',
}

const programLabel: Record<string, string> = {
  'fullday':                 'Full Day',
  'boarding':                'Boarding',
  'fullday-internasional':   'Full Day Intl',
  'boarding-internasional':  'Boarding Intl',
}

const unitColor: Record<string, string> = {
  daycare: '#fd0290', 'kb-kecil': '#ff66c4', 'kb-besar': '#e0007a',
  tka: '#c2006e', tkb: '#8b004d',
  sdit: '#ef4444',
  smp: '#0284c7',
}

// Kolom tabel umum (semua unit)
type ColDef = { key: string; label: string; width?: string }

const COLS_COMMON: ColDef[] = [
  { key: 'no',           label: '#',               width: 'w-8' },
  { key: 'unit',         label: 'Unit',             width: 'w-20' },
  { key: 'nama_anak',    label: 'Nama Siswa',       width: 'w-40' },
  { key: 'tgl_lahir',   label: 'Tgl Lahir',        width: 'w-24' },
  { key: 'jk',          label: 'JK',               width: 'w-10' },
  { key: 'asal_sekolah', label: 'Asal Sekolah',    width: 'w-36' },
  { key: 'nama_ayah',   label: 'Nama Ayah',        width: 'w-36' },
  { key: 'pekerjaan_ayah', label: 'Pekerjaan Ayah', width: 'w-28' },
  { key: 'nama_ibu',    label: 'Nama Ibu',         width: 'w-36' },
  { key: 'pekerjaan_ibu',  label: 'Pekerjaan Ibu', width: 'w-28' },
  { key: 'no_telepon',  label: 'WhatsApp',         width: 'w-32' },
  { key: 'alamat',      label: 'Alamat',           width: 'w-44' },
  { key: 'bukti',       label: 'Bukti',            width: 'w-16' },
  { key: 'status',      label: 'Status',           width: 'w-28' },
  { key: 'tgl_daftar',  label: 'Tgl Daftar',      width: 'w-24' },
  { key: 'aksi',        label: 'Aksi',             width: 'w-16' },
]

const COLS_SDMP: ColDef[] = [
  { key: 'no',           label: '#',               width: 'w-8' },
  { key: 'unit',         label: 'Unit',             width: 'w-20' },
  { key: 'jenis_daftar', label: 'Jenis Daftar',    width: 'w-24' },
  { key: 'program_smp',  label: 'Program',         width: 'w-28' },
  { key: 'kelas_masuk',  label: 'Kelas Tujuan',    width: 'w-24' },
  { key: 'nama_anak',    label: 'Nama Siswa',       width: 'w-40' },
  { key: 'tgl_lahir',   label: 'Tgl Lahir',        width: 'w-24' },
  { key: 'jk',          label: 'JK',               width: 'w-10' },
  { key: 'asal_sekolah', label: 'Asal Sekolah',    width: 'w-36' },
  { key: 'nama_ayah',   label: 'Nama Ayah',        width: 'w-36' },
  { key: 'pekerjaan_ayah', label: 'Pekerjaan Ayah', width: 'w-28' },
  { key: 'nama_ibu',    label: 'Nama Ibu',         width: 'w-36' },
  { key: 'pekerjaan_ibu',  label: 'Pekerjaan Ibu', width: 'w-28' },
  { key: 'no_telepon',  label: 'WhatsApp',         width: 'w-32' },
  { key: 'alamat',      label: 'Alamat',           width: 'w-44' },
  { key: 'bukti',       label: 'Bukti',            width: 'w-16' },
  { key: 'status',      label: 'Status',           width: 'w-28' },
  { key: 'tgl_daftar',  label: 'Tgl Daftar',      width: 'w-24' },
  { key: 'aksi',        label: 'Aksi',             width: 'w-16' },
]

export default function AdminDashboardPage() {
  const router = useRouter()
  const [data, setData]             = useState<DataPendaftaran[]>([])
  const [loading, setLoading]       = useState(true)
  const [filterUnit, setFilterUnit] = useState('semua')
  const [filterStatus, setFilterStatus] = useState('semua')
  const [search, setSearch]         = useState('')
  const [selected, setSelected]     = useState<DataPendaftaran | null>(null)
  const [viewMode, setViewMode]     = useState<'semua' | 'sdmp'>('semua')

  useEffect(() => {
    fetch('/api/admin/check').then((r) => {
      if (!r.ok) router.push('/admin')
      else fetchData()
    })
  }, [router])

  const fetchData = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: rows } = await supabase
      .from('pendaftaran')
      .select('*')
      .order('created_at', { ascending: false })
    if (rows) setData(rows)
    setLoading(false)
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase.from('pendaftaran').update({ status }).eq('id', id)
    setData((prev) => prev.map((d) => d.id === id ? { ...d, status: status as DataPendaftaran['status'] } : d))
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status: status as DataPendaftaran['status'] } : null)
  }

  const filtered = data.filter((d) => {
    const matchUnit   = filterUnit === 'semua' || d.unit_id === filterUnit
    const matchStatus = filterStatus === 'semua' || d.status === filterStatus
    const matchView   = viewMode === 'semua' || (d.unit_id === 'sdit' || d.unit_id === 'smp')
    const matchSearch = search === '' ||
      d.nama_anak.toLowerCase().includes(search.toLowerCase()) ||
      d.nama_ayah.toLowerCase().includes(search.toLowerCase()) ||
      d.nama_ibu.toLowerCase().includes(search.toLowerCase()) ||
      d.no_telepon.includes(search)
    return matchUnit && matchStatus && matchView && matchSearch
  })

  const stats = {
    total:    data.length,
    pending:  data.filter((d) => d.status === 'pending').length,
    verified: data.filter((d) => d.status === 'verified').length,
    rejected: data.filter((d) => d.status === 'rejected').length,
  }

  const cols = viewMode === 'sdmp' ? COLS_SDMP : COLS_COMMON

  const fmt = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'

  const renderCell = (col: ColDef, d: DataPendaftaran, i: number) => {
    switch (col.key) {
      case 'no':           return <td key={col.key} className="px-2 py-2 text-slate-400 border-r border-slate-200 text-center sticky left-0 bg-inherit z-10">{i + 1}</td>
      case 'unit':         return (
        <td key={col.key} className="px-2 py-2 border-r border-slate-200 whitespace-nowrap">
          <span className="font-bold text-white text-xs px-2 py-0.5 rounded"
            style={{ backgroundColor: unitColor[d.unit_id] ?? '#64748b' }}>
            {UNITS.find(u => u.id === d.unit_id)?.singkatan ?? d.unit_id}
          </span>
        </td>
      )
      case 'jenis_daftar': return (
        <td key={col.key} className="px-2 py-2 border-r border-slate-200 whitespace-nowrap">
          {d.jenis_pendaftaran ? (
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              d.jenis_pendaftaran === 'pindahan'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {d.jenis_pendaftaran === 'pindahan' ? '🔄 Pindahan' : '🌟 Baru'}
            </span>
          ) : <span className="text-slate-300 text-xs">—</span>}
        </td>
      )
      case 'program_smp':  return (
        <td key={col.key} className="px-2 py-2 border-r border-slate-200 whitespace-nowrap">
          {d.program_smp ? (
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-semibold">
              {programLabel[d.program_smp] ?? d.program_smp}
            </span>
          ) : <span className="text-slate-300 text-xs">—</span>}
        </td>
      )
      case 'kelas_masuk':  return <td key={col.key} className="px-2 py-2 border-r border-slate-200 text-slate-600 text-xs whitespace-nowrap">{d.kelas_masuk || <span className="text-slate-300">—</span>}</td>
      case 'nama_anak':    return <td key={col.key} className="px-2 py-2 font-semibold text-slate-800 border-r border-slate-200 whitespace-nowrap">{d.nama_anak}</td>
      case 'tgl_lahir':   return <td key={col.key} className="px-2 py-2 text-slate-600 border-r border-slate-200 whitespace-nowrap text-xs">{fmt(d.tanggal_lahir)}</td>
      case 'jk':          return <td key={col.key} className="px-2 py-2 text-slate-600 border-r border-slate-200 text-center">{d.jenis_kelamin === 'L' ? '♂' : '♀'}</td>
      case 'asal_sekolah': return <td key={col.key} className="px-2 py-2 text-slate-600 border-r border-slate-200 text-xs">{d.asal_sekolah || <span className="text-slate-300">—</span>}</td>
      case 'nama_ayah':   return <td key={col.key} className="px-2 py-2 text-slate-700 border-r border-slate-200 whitespace-nowrap text-xs">{d.nama_ayah}</td>
      case 'pekerjaan_ayah': return <td key={col.key} className="px-2 py-2 text-slate-500 border-r border-slate-200 text-xs">{d.pekerjaan_ayah || <span className="text-slate-300">—</span>}</td>
      case 'nama_ibu':    return <td key={col.key} className="px-2 py-2 text-slate-700 border-r border-slate-200 whitespace-nowrap text-xs">{d.nama_ibu}</td>
      case 'pekerjaan_ibu':  return <td key={col.key} className="px-2 py-2 text-slate-500 border-r border-slate-200 text-xs">{d.pekerjaan_ibu || <span className="text-slate-300">—</span>}</td>
      case 'no_telepon':  return (
        <td key={col.key} className="px-2 py-2 border-r border-slate-200 whitespace-nowrap">
          <a href={`https://wa.me/${d.no_telepon.replace(/\D/g, '').replace(/^0/, '62')}`}
            target="_blank" rel="noopener noreferrer"
            className="text-green-600 hover:underline font-medium text-xs flex items-center gap-1">
            <span>📱</span>{d.no_telepon}
          </a>
        </td>
      )
      case 'alamat':      return (
        <td key={col.key} className="px-2 py-2 text-slate-600 border-r border-slate-200 max-w-[11rem] text-xs">
          <span className="block truncate" title={d.alamat}>{d.alamat}</span>
        </td>
      )
      case 'bukti':       return (
        <td key={col.key} className="px-2 py-2 border-r border-slate-200 text-center">
          {d.bukti_bayar_url
            ? <a href={d.bukti_bayar_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs">📎</a>
            : <span className="text-slate-300 text-xs">—</span>}
        </td>
      )
      case 'status':      return (
        <td key={col.key} className="px-2 py-2 border-r border-slate-200 whitespace-nowrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[d.status]}`}>
            {statusLabel[d.status]}
          </span>
        </td>
      )
      case 'tgl_daftar':  return <td key={col.key} className="px-2 py-2 text-slate-400 border-r border-slate-200 whitespace-nowrap text-xs">{fmt(d.created_at)}</td>
      case 'aksi':        return (
        <td key={col.key} className="px-2 py-2 text-center">
          <button onClick={() => setSelected(d)} className="text-blue-500 hover:text-blue-700 text-xs font-semibold whitespace-nowrap">
            Detail
          </button>
        </td>
      )
      default: return <td key={col.key} />
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Topbar */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-md">
        <div>
          <h1 className="font-bold text-sm md:text-base">Admin Panel · SPMB AIIS 2027/2028</h1>
          <p className="text-slate-400 text-xs">Yayasan Al-Iman · PP Hidayatullah Kebumen</p>
        </div>
        <button onClick={handleLogout} className="text-slate-400 hover:text-white text-sm transition">
          Keluar →
        </button>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Pendaftar',       value: stats.total,    color: 'text-slate-800',  border: 'border-slate-200' },
            { label: 'Menunggu Verifikasi',   value: stats.pending,  color: 'text-yellow-600', border: 'border-yellow-200' },
            { label: 'Terverifikasi',         value: stats.verified, color: 'text-green-600',  border: 'border-green-200' },
            { label: 'Ditolak',               value: stats.rejected, color: 'text-red-600',    border: 'border-red-200' },
          ].map((s) => (
            <div key={s.label} className={`bg-white rounded-xl p-4 shadow-sm border ${s.border}`}>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-wrap gap-2 items-center">
          {/* View mode toggle */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-semibold">
            {([['semua', 'Semua Unit'], ['sdmp', 'SD & SMP']] as const).map(([val, lbl]) => (
              <button key={val} onClick={() => setViewMode(val)}
                className={`px-3 py-2 transition ${viewMode === val ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                {lbl}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="🔍 Cari nama / telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option value="semua">Semua Unit</option>
            {UNITS.map((u) => <option key={u.id} value={u.id}>{u.singkatan}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option value="semua">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="verified">Terverifikasi</option>
            <option value="rejected">Ditolak</option>
          </select>
          <button onClick={fetchData}
            className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg text-sm transition flex items-center gap-1">
            🔄 Refresh
          </button>
          <span className="text-xs text-slate-400 ml-auto font-medium">{filtered.length} data</span>
        </div>

        {/* Spreadsheet table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <p className="text-2xl mb-2">⏳</p>Memuat data...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <p className="text-2xl mb-2">📭</p>Tidak ada data pendaftaran
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse min-w-max">
                <thead>
                  <tr className="bg-slate-800 text-white text-left sticky top-0">
                    {cols.map((col) => (
                      <th key={col.key}
                        className={`px-3 py-2.5 font-semibold border-r border-slate-700 whitespace-nowrap ${col.width ?? ''}`}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, i) => (
                    <tr key={d.id}
                      className={`border-b border-slate-100 hover:bg-blue-50/60 transition-colors cursor-default ${
                        i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}>
                      {cols.map((col) => renderCell(col, d, i))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-800 text-lg">Detail Pendaftaran</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="font-bold text-white text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: unitColor[selected.unit_id] ?? '#64748b' }}>
                    {selected.unit_nama}
                  </span>
                  {selected.jenis_pendaftaran && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      selected.jenis_pendaftaran === 'pindahan'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {selected.jenis_pendaftaran === 'pindahan' ? '🔄 Pindahan' : '🌟 Siswa Baru'}
                    </span>
                  )}
                  {selected.kelas_masuk && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {selected.kelas_masuk}
                    </span>
                  )}
                  {selected.program_smp && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-semibold">
                      🎯 {programLabel[selected.program_smp]}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none ml-2 shrink-0">×</button>
            </div>

            <div className="space-y-4 text-sm">
              <Section title="🧒 Data Calon Siswa">
                <Row label="Nama Lengkap"  value={selected.nama_anak} />
                <Row label="Tanggal Lahir" value={new Date(selected.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
                <Row label="Jenis Kelamin" value={selected.jenis_kelamin === 'L' ? '♂ Laki-laki' : '♀ Perempuan'} />
                <Row label="Asal Sekolah"  value={selected.asal_sekolah || '-'} />
              </Section>

              <Section title="👪 Data Orang Tua / Wali">
                <Row label="Nama Ayah"       value={selected.nama_ayah} />
                <Row label="Pekerjaan Ayah"  value={selected.pekerjaan_ayah || '-'} />
                <Row label="Nama Ibu"        value={selected.nama_ibu} />
                <Row label="Pekerjaan Ibu"   value={selected.pekerjaan_ibu || '-'} />
                <Row label="No. WhatsApp"    value={selected.no_telepon} />
                <Row label="Alamat"          value={selected.alamat} />
              </Section>

              {selected.bukti_bayar_url && (
                <Section title="💳 Bukti Infaq Pendaftaran">
                  <a href={selected.bukti_bayar_url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selected.bukti_bayar_url} alt="Bukti bayar"
                      className="w-full rounded-lg border border-slate-200 max-h-64 object-contain bg-slate-50" />
                    <p className="text-xs text-blue-500 mt-1 text-center">↗ Buka ukuran penuh</p>
                  </a>
                </Section>
              )}

              {/* Update Status */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Update Status</p>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(selected.id!, 'verified')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2.5 rounded-lg transition">
                    ✅ Verifikasi
                  </button>
                  <button onClick={() => updateStatus(selected.id!, 'pending')}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-semibold py-2.5 rounded-lg transition">
                    ⏳ Pending
                  </button>
                  <button onClick={() => updateStatus(selected.id!, 'rejected')}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2.5 rounded-lg transition">
                    ❌ Tolak
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <p className="font-semibold text-slate-500 mb-3 text-xs uppercase tracking-wide">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400 flex-shrink-0 text-xs">{label}</span>
      <span className="text-slate-700 font-medium text-right text-xs break-all">{value}</span>
    </div>
  )
}
