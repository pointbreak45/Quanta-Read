import { createClient } from '@supabase/supabase-js';

// GUEST MODE: Using basic Supabase client without auth helpers
export function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false // Disable session persistence for guest mode
      }
    }
  );
}

// Export the client for use in components
export const supabaseClient = createSupabaseClient();
