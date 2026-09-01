export type UnitId = 'daycare' | 'kb-kecil' | 'kb-besar' | 'tka' | 'tkb' | 'sdit' | 'smp'
export type JenisPendaftaran = 'baru' | 'pindahan'
export type ProgramSMP = 'fullday' | 'boarding' | 'fullday-internasional' | 'boarding-internasional'

export interface DataPendaftaran {
  id?: string
  unit_id: UnitId
  unit_nama: string

  // Jenis pendaftaran (khusus SD & SMP)
  jenis_pendaftaran?: JenisPendaftaran
  kelas_masuk?: string

  // Program (khusus SMP)
  program_smp?: ProgramSMP

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
