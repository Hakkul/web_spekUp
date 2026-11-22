import { createClient } from '@supabase/supabase-js';

const cleanEnv = (val) => (val || '').trim().replace(/^["']|["']$/g, '');

const supabaseUrl = cleanEnv(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = cleanEnv(import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true
  }
});