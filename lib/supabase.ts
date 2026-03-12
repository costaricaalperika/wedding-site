import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface Guest {
  id: string;
  name: string;
  email: string;
  attending: boolean;
  created_at: string;
}

interface Database {
  public: {
    Tables: {
      guests: {
        Row: Guest;
        Insert: Omit<Guest, "id" | "created_at">;
      };
    };
  };
}

let _supabase: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === "your_supabase_url_here") {
    throw new Error(
      "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  _supabase = createClient<Database>(url, key);
  return _supabase;
}
