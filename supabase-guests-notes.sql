-- Supabase SQL Editor'da bir kez çalıştırın: isteğe bağlı misafir notu
ALTER TABLE guests
  ADD COLUMN IF NOT EXISTS notes TEXT;

COMMENT ON COLUMN guests.notes IS 'Misafirin bıraktığı isteğe bağlı not';
