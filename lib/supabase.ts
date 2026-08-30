import { createClient } from "@supabase/supabase-js";

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  attending: boolean;
  created_at: string;
  /** Aynı form gönderimindeki kayıtları gruplar (eşlikçiler) */
  party_id: string | null;
  /** 1 = ana davetli, 2+ = eşlikçiler; katılmıyor kayıtlarında null */
  party_index: number | null;
  /** İsteğe bağlı misafir notu */
  notes?: string | null;
}

let _supabase: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === "your_supabase_url_here") {
    throw new Error(
      "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  _supabase = createClient(url, key);
  return _supabase;
}
