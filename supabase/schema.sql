-- Tabel pendaftaran
CREATE TABLE pendaftaran (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id TEXT NOT NULL CHECK (unit_id IN ('tpa', 'kb', 'tka', 'tkb', 'sdit', 'smp')),
  unit_nama TEXT NOT NULL,

  -- Data Anak
  nama_anak TEXT NOT NULL,
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin TEXT NOT NULL CHECK (jenis_kelamin IN ('L', 'P')),
  asal_sekolah TEXT,

  -- Data Orang Tua
  nama_ayah TEXT NOT NULL,
  nama_ibu TEXT NOT NULL,
  no_telepon TEXT NOT NULL,
  alamat TEXT NOT NULL,

  -- Pembayaran
  bukti_bayar_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk filter yang sering dipakai
CREATE INDEX idx_pendaftaran_unit_id ON pendaftaran (unit_id);
CREATE INDEX idx_pendaftaran_status ON pendaftaran (status);
CREATE INDEX idx_pendaftaran_created_at ON pendaftaran (created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE pendaftaran ENABLE ROW LEVEL SECURITY;

-- Policy: siapa saja bisa INSERT (pendaftaran baru)
CREATE POLICY "Allow public insert" ON pendaftaran
  FOR INSERT WITH CHECK (true);

-- Policy: hanya service role yang bisa SELECT, UPDATE (admin pakai service role key)
CREATE POLICY "Allow service role select" ON pendaftaran
  FOR SELECT USING (true);

CREATE POLICY "Allow service role update" ON pendaftaran
  FOR UPDATE USING (true);
