'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { UNITS, UNIT_GROUPS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export default function FormDaftarPage() {
  const params = useParams()
  const router = useRouter()
  const unitId = params.unit as string
  const unit = UNITS.find((u) => u.id === unitId)
  // Cari nama grup induk (untuk tampilan breadcrumb/back)
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
    nama_ibu: '',
    no_telepon: '',
    alamat: '',
  })

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Unit tidak ditemukan.</p>
          <Link href="/" className="text-blue-500 hover:underline">← Kembali</Link>
        </div>
      </div>
    )
  }

  const warna = unit.warna

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
      errors[field] ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-200'
    }`

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="text-white" style={{ background: `linear-gradient(135deg, ${warna}, ${warna}cc)` }}>
        <div className="max-w-2xl mx-auto px-4 py-5">
          <Link href="/" className="text-white/80 hover:text-white text-sm flex items-center gap-1 mb-3 w-fit">
            ← Kembali
          </Link>
          <h1 className="text-xl font-bold">{unit.nama}</h1>
          <p className="text-white/80 text-sm">
            {parentGroup ? `${parentGroup.nama} · ` : ''}Formulir Pendaftaran SPMB 2027/2028
          </p>
          {unit.usiaMin !== undefined && (
            <p className="text-white/70 text-xs mt-0.5">
              Usia: {unit.usiaMin}–{unit.usiaMax} tahun
            </p>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Data Anak */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-semibold text-slate-700 mb-4">👦 Data Calon Siswa</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Nama Lengkap Anak <span className="text-red-500">*</span>
                </label>
                <input type="text" name="nama_anak" value={form.nama_anak} onChange={handleChange}
                  placeholder="Nama lengkap sesuai akta lahir" className={inputClass('nama_anak')} />
                {errors.nama_anak && <p className="text-red-500 text-xs mt-1">{errors.nama_anak}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={handleChange}
                    className={inputClass('tanggal_lahir')} />
                  {errors.tanggal_lahir && <p className="text-red-500 text-xs mt-1">{errors.tanggal_lahir}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange}
                    className={inputClass('jenis_kelamin')}>
                    <option value="">Pilih</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                  {errors.jenis_kelamin && <p className="text-red-500 text-xs mt-1">{errors.jenis_kelamin}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  {isKBTK ? 'Asal Playgroup / TPA Sebelumnya' : 'Asal Sekolah / TK Sebelumnya'}
                </label>
                <input type="text" name="asal_sekolah" value={form.asal_sekolah} onChange={handleChange}
                  placeholder={isKBTK ? 'Nama playgroup / TPA asal (jika ada)' : 'Nama sekolah / TK asal (jika ada)'}
                  className={inputClass('asal_sekolah')} />
              </div>
            </div>
          </div>

          {/* Data Orang Tua */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-semibold text-slate-700 mb-4">👪 Data Orang Tua / Wali</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Nama Ayah <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="nama_ayah" value={form.nama_ayah} onChange={handleChange}
                    placeholder="Nama lengkap ayah" className={inputClass('nama_ayah')} />
                  {errors.nama_ayah && <p className="text-red-500 text-xs mt-1">{errors.nama_ayah}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Nama Ibu <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="nama_ibu" value={form.nama_ibu} onChange={handleChange}
                    placeholder="Nama lengkap ibu" className={inputClass('nama_ibu')} />
                  {errors.nama_ibu && <p className="text-red-500 text-xs mt-1">{errors.nama_ibu}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input type="tel" name="no_telepon" value={form.no_telepon} onChange={handleChange}
                  placeholder="Contoh: 08123456789" className={inputClass('no_telepon')} />
                {errors.no_telepon && <p className="text-red-500 text-xs mt-1">{errors.no_telepon}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Alamat Rumah <span className="text-red-500">*</span>
                </label>
                <textarea name="alamat" value={form.alamat} onChange={handleChange} rows={3}
                  placeholder="Alamat lengkap tempat tinggal"
                  className={`${inputClass('alamat')} resize-none`} />
                {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
            style={{ backgroundColor: warna }}
          >
            {loading ? 'Menyimpan...' : 'Lanjut ke Pembayaran →'}
          </button>
        </form>
      </div>
    </main>
  )
}
