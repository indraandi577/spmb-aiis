export type UnitId = 'daycare' | 'kb-kecil' | 'kb-besar' | 'tka' | 'tkb' | 'sdit' | 'smp'

export interface DataPendaftaran {
  id?: string
  unit_id: UnitId
  unit_nama: string

  // Data Anak
  nama_anak: string
  tanggal_lahir: string
  jenis_kelamin: 'L' | 'P'
  asal_sekolah: string

  // Data Orang Tua
  nama_ayah: string
  pekerjaan_ayah: string
  nama_ibu: string
  pekerjaan_ibu: string
  no_telepon: string
  alamat: string

  // Pembayaran
  bukti_bayar_url?: string
  status: 'pending' | 'verified' | 'rejected'

  created_at?: string
}
