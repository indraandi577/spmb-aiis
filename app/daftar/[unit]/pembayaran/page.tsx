'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { UNITS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

function formatRupiah(angka: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
}

export default function PembayaranPage() {
  const params = useParams()
  const router = useRouter()
  const unitId = params.unit as string
  const unit = UNITS.find((u) => u.id === unitId)

  const [pendaftaranId, setPendaftaranId] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const id = sessionStorage.getItem('pendaftaran_id')
    const savedUnit = sessionStorage.getItem('pendaftaran_unit')
    if (!id || savedUnit !== unitId) {
      router.push(`/daftar/${unitId}`)
      return
    }
    setPendaftaranId(id)
  }, [unitId, router])

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Unit tidak ditemukan.</p>
      </div>
    )
  }

  const warna = unit.warna

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { alert('Ukuran file maksimal 5 MB'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const copyRekening = () => {
    navigator.clipboard.writeText(unit.noRekening.replace(/-/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUpload = async () => {
    if (!file || !pendaftaranId) { alert('Pilih file bukti pembayaran terlebih dahulu'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `bukti-${pendaftaranId}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('bukti-bayar')
        .upload(fileName, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('bukti-bayar').getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from('pendaftaran')
        .update({ bukti_bayar_url: urlData.publicUrl })
        .eq('id', pendaftaranId)
      if (updateError) throw updateError

      sessionStorage.removeItem('pendaftaran_id')
      sessionStorage.removeItem('pendaftaran_unit')
      router.push(`/daftar/${unitId}/selesai`)
    } catch (err) {
      console.error(err)
      alert('Gagal upload bukti pembayaran. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="text-white" style={{ background: `linear-gradient(135deg, ${warna}, ${warna}cc)` }}>
        <div className="max-w-2xl mx-auto px-4 py-5">
          <Link href={`/daftar/${unitId}`} className="text-white/80 hover:text-white text-sm flex items-center gap-1 mb-3 w-fit">
            ← Kembali
          </Link>
          <h1 className="text-xl font-bold">Pembayaran Pendaftaran</h1>
          <p className="text-white/80 text-sm">{unit.nama}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        {/* Info Pembayaran */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-700 mb-4">💳 Transfer Biaya Pendaftaran</h2>
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Biaya Pendaftaran</span>
              <span className="font-bold text-slate-800 text-lg">{formatRupiah(unit.biayaPendaftaran)}</span>
            </div>
            <hr className="border-slate-200" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Bank</span>
              <span className="font-medium text-slate-700">{unit.namaBank}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">No. Rekening</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 tracking-wider">{unit.noRekening}</span>
                <button onClick={copyRekening}
                  className="text-xs bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded transition">
                  {copied ? '✓ Disalin' : 'Salin'}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">A.N.</span>
              <span className="font-medium text-slate-700">{unit.nama}</span>
            </div>
          </div>
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
            ⚠️ Harap transfer sesuai nominal yang tertera. Simpan bukti transfer untuk diunggah di bawah.
          </div>
        </div>

        {/* Upload Bukti */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-700 mb-4">📎 Upload Bukti Pembayaran</h2>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition"
          >
            {preview ? (
              <div>
                <img src={preview} alt="Bukti bayar" className="max-h-48 mx-auto rounded-lg object-contain" />
                <p className="text-sm text-slate-500 mt-2">{file?.name}</p>
                <p className="text-xs text-blue-500 mt-1">Klik untuk ganti gambar</p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm font-medium text-slate-600">Klik untuk pilih file</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG, atau PDF · Maks. 5 MB</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full mt-4 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: warna }}
          >
            {loading ? 'Mengunggah...' : 'Kirim Bukti Pembayaran →'}
          </button>
        </div>
      </div>
    </main>
  )
}
