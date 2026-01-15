import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,  // ✅ Desabilita renovação automática
    persistSession: true,     // ✅ Mantém sessão no localStorage
    detectSessionInUrl: true  // ✅ Para magic links funcionarem
  }
});