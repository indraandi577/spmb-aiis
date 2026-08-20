'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { UNITS, UNIT_GROUPS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export default function FormDaftarPage() {
  const params = useParams()
  const router = useRouter()
  const unitId = params.unit as string
  const unit = UNITS.find((u) => u.id === unitId)
  const parentGroup = unit?.parentId
    ? UNIT_GROUPS.find((g) => g.id === unit.parentId)
    : null
  const isKBTK = unit?.parentId === 'kb-tk'

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    nama_anak: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    asal_sekolah: '',
    nama_ayah: '',
    pekerjaan_ayah: '',
    nama_ibu: '',
    pekerjaan_ibu: '',
    no_telepon: '',
    alamat: '',
  })

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-slate-600 font-semibold mb-1">Unit tidak ditemukan</p>
          <p className="text-slate-400 text-sm mb-5">Halaman yang Anda cari tidak tersedia.</p>
          <Link href="/" className="inline-flex items-center gap-1 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.nama_anak.trim()) e.nama_anak = 'Nama anak wajib diisi'
    if (!form.tanggal_lahir) e.tanggal_lahir = 'Tanggal lahir wajib diisi'
    if (!form.jenis_kelamin) e.jenis_kelamin = 'Jenis kelamin wajib dipilih'
    if (!form.nama_ayah.trim()) e.nama_ayah = 'Nama ayah wajib diisi'
    if (!form.nama_ibu.trim()) e.nama_ibu = 'Nama ibu wajib diisi'
    if (!form.no_telepon.trim()) e.no_telepon = 'Nomor telepon wajib diisi'
    else if (!/^(\+62|62|0)[0-9]{8,13}$/.test(form.no_telepon.replace(/\s/g, '')))
      e.no_telepon = 'Format nomor telepon tidak valid'
    if (!form.alamat.trim()) e.alamat = 'Alamat wajib diisi'
    return e
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pendaftaran')
        .insert({ unit_id: unit.id, unit_nama: unit.nama, ...form, status: 'pending' })
        .select()
        .single()
      if (error) throw error
      sessionStorage.setItem('pendaftaran_id', data.id)
      sessionStorage.setItem('pendaftaran_unit', unit.id)
      router.push(`/daftar/${unit.id}/pembayaran`)
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const inputClass = (field: string) =>
    `w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition ${
      errors[field]
        ? 'border-red-300 focus:ring-red-100 bg-red-50/30'
        : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'
    }`

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white text-sm mb-4 transition-colors">
            ← Kembali
          </Link>

          <div className="flex items-center gap-4">
            {/* Logo unit */}
            <div className="w-14 h-14 rounded-xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center overflow-hidden p-2 shrink-0">
              <Image
                src={parentGroup?.logo ?? (unit.id === 'sdit' ? '/logo-sd.png' : '/logo-smp.png')}
                alt={unit.nama}
                width={48}
                height={48}
                className="object-contain w-full h-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {parentGroup && (
                  <span className="text-blue-300 text-xs bg-white/10 px-2 py-0.5 rounded-full">
                    {parentGroup.nama}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold mt-0.5">{unit.nama}</h1>
              <p className="text-blue-200 text-sm">Formulir Pendaftaran SPMB 2027/2028</p>
              {unit.usiaMin !== undefined && unit.id !== 'smp' && (
                <span className="inline-block bg-white/10 border border-white/20 text-blue-100 text-xs px-2.5 py-0.5 rounded-full mt-1.5">
                  🎂 Usia {unit.usiaMin}–{unit.usiaMax} tahun
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Data Calon Siswa ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-lg">🧒</span>
              <h2 className="font-bold text-slate-700">Data Calon Siswa</h2>
            </div>
            <div className="px-6 py-5 space-y-4">

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input type="text" name="nama_anak" value={form.nama_anak} onChange={handleChange}
                  placeholder="Nama lengkap sesuai akta lahir" className={inputClass('nama_anak')} />
                {errors.nama_anak && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠ {errors.nama_anak}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={handleChange}
                    className={inputClass('tanggal_lahir')} />
                  {errors.tanggal_lahir && <p className="text-red-500 text-xs mt-1">⚠ {errors.tanggal_lahir}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange}
                    className={inputClass('jenis_kelamin')}>
                    <option value="">Pilih...</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                  {errors.jenis_kelamin && <p className="text-red-500 text-xs mt-1">⚠ {errors.jenis_kelamin}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                  {isKBTK
                    ? 'Asal Playgroup / Daycare Sebelumnya'
                    : unit.id === 'smp'
                    ? 'Asal SD / Sekolah Sebelumnya'
                    : 'Asal Sekolah / TK Sebelumnya'}
                </label>
                <input type="text" name="asal_sekolah" value={form.asal_sekolah} onChange={handleChange}
                  placeholder={
                    isKBTK ? 'Nama playgroup / daycare asal (jika ada)'
                    : unit.id === 'smp' ? 'Nama SD asal'
                    : 'Nama sekolah / TK asal (jika ada)'
                  }
                  className={inputClass('asal_sekolah')} />
              </div>
            </div>
          </div>

          {/* ── Data Orang Tua ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-lg">👪</span>
              <h2 className="font-bold text-slate-700">Data Orang Tua / Wali</h2>
            </div>
            <div className="px-6 py-5 space-y-4">

              {/* Ayah */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                    Nama Ayah <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="nama_ayah" value={form.nama_ayah} onChange={handleChange}
                    placeholder="Nama lengkap ayah" className={inputClass('nama_ayah')} />
                  {errors.nama_ayah && <p className="text-red-500 text-xs mt-1">⚠ {errors.nama_ayah}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Pekerjaan Ayah</label>
                  <input type="text" name="pekerjaan_ayah" value={form.pekerjaan_ayah} onChange={handleChange}
                    placeholder="Contoh: Wiraswasta" className={inputClass('pekerjaan_ayah')} />
                </div>
              </div>

              {/* Ibu */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                    Nama Ibu <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="nama_ibu" value={form.nama_ibu} onChange={handleChange}
                    placeholder="Nama lengkap ibu" className={inputClass('nama_ibu')} />
                  {errors.nama_ibu && <p className="text-red-500 text-xs mt-1">⚠ {errors.nama_ibu}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Pekerjaan Ibu</label>
                  <input type="text" name="pekerjaan_ibu" value={form.pekerjaan_ibu} onChange={handleChange}
                    placeholder="Contoh: Ibu Rumah Tangga" className={inputClass('pekerjaan_ibu')} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                  Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">📱</span>
                  <input type="tel" name="no_telepon" value={form.no_telepon} onChange={handleChange}
                    placeholder="Contoh: 08123456789" className={`${inputClass('no_telepon')} pl-9`} />
                </div>
                {errors.no_telepon && <p className="text-red-500 text-xs mt-1">⚠ {errors.no_telepon}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                  Alamat Rumah <span className="text-red-500">*</span>
                </label>
                <textarea name="alamat" value={form.alamat} onChange={handleChange} rows={3}
                  placeholder="Alamat lengkap tempat tinggal"
                  className={`${inputClass('alamat')} resize-none`} />
                {errors.alamat && <p className="text-red-500 text-xs mt-1">⚠ {errors.alamat}</p>}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Menyimpan...
              </>
            ) : (
              'Lanjut ke Pembayaran →'
            )}
          </button>

          <p className="text-center text-slate-400 text-xs">
            * Wajib diisi · Data yang Anda isi dijaga kerahasiaannya
          </p>
        </form>
      </div>
    </main>
  )
}
