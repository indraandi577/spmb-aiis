'use client'

import { useState } from 'react'
import { ADMIN_WA } from '@/lib/constants'

const PESAN_TEMPLATE = [
  {
    label: '✅ Sudah mendaftar',
    pesan: `Assalamu'alaikum, saya telah mengisi formulir pendaftaran SPMB AIIS 2027/2028 dan sudah mengirim bukti pembayaran. Mohon konfirmasinya. Terima kasih.`,
  },
  {
    label: '❓ Tanya info pendaftaran',
    pesan: `Assalamu'alaikum, saya ingin menanyakan informasi mengenai pendaftaran SPMB AIIS 2027/2028. Boleh saya dibantu? Terima kasih.`,
  },
  {
    label: '📋 Tanya syarat masuk',
    pesan: `Assalamu'alaikum, saya ingin mengetahui syarat dan ketentuan pendaftaran SPMB AIIS 2027/2028. Mohon informasinya. Terima kasih.`,
  },
  {
    label: '💳 Tanya biaya pendaftaran',
    pesan: `Assalamu'alaikum, saya ingin menanyakan biaya pendaftaran SPMB AIIS 2027/2028. Terima kasih.`,
  },
]

export default function WAButton() {
  const [open, setOpen] = useState(false)

  const kirimPesan = (pesan: string) => {
    const url = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(pesan)}`
    window.open(url, '_blank')
    setOpen(false)
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {/* Popup pilihan pesan */}
        {open && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-72 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-green-500 px-4 py-3">
              <p className="text-white font-semibold text-sm">💬 Hubungi Kami</p>
              <p className="text-green-100 text-xs mt-0.5">Pilih topik yang ingin ditanyakan</p>
            </div>
            <div className="p-2 space-y-1">
              {PESAN_TEMPLATE.map((t) => (
                <button
                  key={t.label}
                  onClick={() => kirimPesan(t.pesan)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-green-50 text-sm text-slate-700 hover:text-green-700 transition-colors"
                >
                  {t.label}
                </button>
              ))}
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={() => kirimPesan(`Assalamu'alaikum, saya ingin bertanya mengenai SPMB AIIS 2027/2028.`)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm text-slate-500 transition-colors"
                >
                  ✏️ Tulis pesan sendiri
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tombol WA */}
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Hubungi via WhatsApp"
        >
          {open ? (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          )}
        </button>
      </div>
    </>
  )
}
