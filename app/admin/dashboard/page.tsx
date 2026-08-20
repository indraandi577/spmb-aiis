'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DataPendaftaran } from '@/lib/types'
import { UNITS } from '@/lib/constants'

const statusBadge: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  verified: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
}
const statusLabel: Record<string, string> = {
  pending: '⏳ Menunggu',
  verified: '✅ Terverifikasi',
  rejected: '❌ Ditolak',
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DataPendaftaran[]>([])
  const [loading, setLoading] = useState(true)
  const [filterUnit, setFilterUnit] = useState('semua')
  const [filterStatus, setFilterStatus] = useState('semua')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<DataPendaftaran | null>(null)

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
    const matchUnit = filterUnit === 'semua' || d.unit_id === filterUnit
    const matchStatus = filterStatus === 'semua' || d.status === filterStatus
    const matchSearch = search === '' ||
      d.nama_anak.toLowerCase().includes(search.toLowerCase()) ||
      d.nama_ayah.toLowerCase().includes(search.toLowerCase()) ||
      d.nama_ibu.toLowerCase().includes(search.toLowerCase()) ||
      d.no_telepon.includes(search)
    return matchUnit && matchStatus && matchSearch
  })

  const stats = {
    total: data.length,
    pending: data.filter((d) => d.status === 'pending').length,
    verified: data.filter((d) => d.status === 'verified').length,
    rejected: data.filter((d) => d.status === 'rejected').length,
  }

  const unitColor: Record<string, string> = { 'kb-tk': '#fd0290', sdit: '#ff0000', smp: '#007c92' }

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Topbar */}
      <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-bold text-sm md:text-base">Admin Panel · SPMB AIIS 2027/2028</h1>
          <p className="text-slate-400 text-xs">Yayasan Al-Iman Pondok Pesantren Hidayatullah Kebumen</p>
        </div>
        <button onClick={handleLogout} className="text-slate-400 hover:text-white text-sm transition">
          Keluar →
        </button>
      </div>

      <div className="max-w-full px-4 py-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Pendaftar', value: stats.total, color: 'text-slate-800', bg: 'bg-white' },
            { label: 'Menunggu Verifikasi', value: stats.pending, color: 'text-yellow-600', bg: 'bg-white' },
            { label: 'Terverifikasi', value: stats.verified, color: 'text-green-600', bg: 'bg-white' },
            { label: 'Ditolak', value: stats.rejected, color: 'text-red-600', bg: 'bg-white' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 shadow-sm border border-slate-100`}>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="🔍 Cari nama / telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200">
            <option value="semua">Semua Unit</option>
            {UNITS.map((u) => <option key={u.id} value={u.id}>{u.singkatan}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200">
            <option value="semua">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="verified">Terverifikasi</option>
            <option value="rejected">Ditolak</option>
          </select>
          <button onClick={fetchData} className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg text-sm transition flex items-center gap-1">
            🔄 Refresh
          </button>
          <span className="text-xs text-slate-400 ml-auto">{filtered.length} data</span>
        </div>

        {/* Tabel Excel-style */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-400">Tidak ada data pendaftaran</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-700 text-white">
                    <th className="px-3 py-3 text-left font-semibold border-r border-slate-600 w-8">#</th>
                    <th className="px-3 py-3 text-left font-semibold border-r border-slate-600">Unit</th>
                    <th className="px-3 py-3 text-left font-semibold border-r border-slate-600">Nama Anak</th>
                    <th className="px-3 py-3 text-left font-semibold border-r border-slate-600">Tgl Lahir</th>
                    <th className="px-3 py-3 text-left font-semibold border-r border-slate-600">JK</th>
                    <th className="px-3 py-3 text-left font-semibold border-r border-slate-600">Asal Sekolah</th>
                    <th className="px-3 py-3 text-left font-semibold border-r border-slate-600">Nama Ayah</th>
                    <th className="px-3 py-3 text-left font-semibold border-r border-slate-600">Nama Ibu</th>
                    <th className="px-3 py-3 text-left font-semibold border-r border-slate-600">No. Telepon</th>
                    <th className="px-3 py-3 text-left font-semibold border-r border-slate-600">Alamat</th>
                    <th className="px-3 py-3 text-left font-semibold border-r border-slate-600">Bukti Bayar</th>
                    <th className="px-3 py-3 text-left font-semibold border-r border-slate-600">Status</th>
                    <th className="px-3 py-3 text-left font-semibold border-r border-slate-600">Tanggal Daftar</th>
                    <th className="px-3 py-3 text-left font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, i) => (
                    <tr key={d.id}
                      className={`border-b border-slate-100 hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                      <td className="px-3 py-2.5 text-slate-400 border-r border-slate-100 text-center">{i + 1}</td>
                      <td className="px-3 py-2.5 border-r border-slate-100">
                        <span className="font-bold text-white text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: unitColor[d.unit_id] }}>
                          {UNITS.find(u => u.id === d.unit_id)?.singkatan}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-slate-800 border-r border-slate-100 whitespace-nowrap">{d.nama_anak}</td>
                      <td className="px-3 py-2.5 text-slate-600 border-r border-slate-100 whitespace-nowrap">
                        {new Date(d.tanggal_lahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 border-r border-slate-100 text-center">
                        {d.jenis_kelamin === 'L' ? '♂ L' : '♀ P'}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 border-r border-slate-100">{d.asal_sekolah || '-'}</td>
                      <td className="px-3 py-2.5 text-slate-700 border-r border-slate-100 whitespace-nowrap">{d.nama_ayah}</td>
                      <td className="px-3 py-2.5 text-slate-700 border-r border-slate-100 whitespace-nowrap">{d.nama_ibu}</td>
                      <td className="px-3 py-2.5 border-r border-slate-100 whitespace-nowrap">
                        <a href={`https://wa.me/${d.no_telepon.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-green-600 hover:underline font-medium">
                          {d.no_telepon}
                        </a>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 border-r border-slate-100 max-w-40">
                        <span className="block truncate" title={d.alamat}>{d.alamat}</span>
                      </td>
                      <td className="px-3 py-2.5 border-r border-slate-100 text-center">
                        {d.bukti_bayar_url ? (
                          <a href={d.bukti_bayar_url} target="_blank" rel="noopener noreferrer"
                            className="text-blue-500 hover:underline font-medium">
                            📎 Lihat
                          </a>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 border-r border-slate-100">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${statusBadge[d.status]}`}>
                          {statusLabel[d.status]}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 border-r border-slate-100 whitespace-nowrap">
                        {d.created_at ? new Date(d.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-3 py-2.5">
                        <button onClick={() => setSelected(d)}
                          className="text-blue-500 hover:text-blue-700 font-medium whitespace-nowrap">
                          Detail →
                        </button>
                      </td>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-800 text-lg">Detail Pendaftaran</h2>
                <span className="text-xs font-bold text-white px-2 py-0.5 rounded mt-1 inline-block"
                  style={{ backgroundColor: unitColor[selected.unit_id] }}>
                  {selected.unit_nama}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
            </div>

            <div className="space-y-4 text-sm">
              <Section title="👦 Data Calon Siswa">
                <Row label="Nama Lengkap" value={selected.nama_anak} />
                <Row label="Tanggal Lahir" value={new Date(selected.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
                <Row label="Jenis Kelamin" value={selected.jenis_kelamin === 'L' ? '♂ Laki-laki' : '♀ Perempuan'} />
                <Row label="Asal Sekolah" value={selected.asal_sekolah || '-'} />
              </Section>

              <Section title="👪 Data Orang Tua / Wali">
                <Row label="Nama Ayah" value={selected.nama_ayah} />
                <Row label="Nama Ibu" value={selected.nama_ibu} />
                <Row label="No. Telepon" value={selected.no_telepon} />
                <Row label="Alamat" value={selected.alamat} />
              </Section>

              {selected.bukti_bayar_url && (
                <Section title="💳 Bukti Pembayaran">
                  <a href={selected.bukti_bayar_url} target="_blank" rel="noopener noreferrer">
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
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-2.5 rounded-lg transition">
                    ✅ Verifikasi
                  </button>
                  <button onClick={() => updateStatus(selected.id!, 'pending')}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-medium py-2.5 rounded-lg transition">
                    ⏳ Pending
                  </button>
                  <button onClick={() => updateStatus(selected.id!, 'rejected')}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-2.5 rounded-lg transition">
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
      <p className="font-semibold text-slate-600 mb-3 text-xs uppercase tracking-wide">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400 flex-shrink-0 text-xs">{label}</span>
      <span className="text-slate-700 font-medium text-right text-xs">{value}</span>
    </div>
  )
}
