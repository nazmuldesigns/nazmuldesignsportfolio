import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseConfig) {
  console.error('Supabase is not configured. Set VITE_SUPABASE_URL=https://khkwarlnlcxfbaiijrgf.supabase.co and VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoa3dhcmxubGN4ZmJhaWlqcmdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MTE0NTYsImV4cCI6MjEwNTA4Nz before starting the app.');
}

// Keep the client constructible for local diagnostics, but never hide a missing
// configuration behind fake content. Public queries will show their real error.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
);
