import { createClient } from '@supabase/supabase-js';

// GUEST MODE: Using basic Supabase client without auth helpers
let supabaseSingleton = null;

const createSupabaseClient = () => {
  console.log('Creating basic supabase client for guest mode');

  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false // Disable session persistence for guest mode
      }
    }
  );

  supabaseSingleton = client;
  return client;
};

export const supabase = () => {
  if (supabaseSingleton) {
    console.log('Returning existing supabase client');
    return supabaseSingleton;
  }

  return createSupabaseClient();
};
