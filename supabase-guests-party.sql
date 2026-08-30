-- Supabase SQL Editor'da bir kez çalıştırın: eşlikçi kayıtları için sütunlar
ALTER TABLE guests
  ADD COLUMN IF NOT EXISTS party_id UUID,
  ADD COLUMN IF NOT EXISTS party_index SMALLINT;

COMMENT ON COLUMN guests.party_id IS 'Aynı RSVP gönderimindeki kişileri gruplar';
COMMENT ON COLUMN guests.party_index IS '1 ana davetli, 2+ eşlikçi; tek başına veya katılmıyor için NULL';
