import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseClient = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  isSingleton: true,
  options: {
    realtime: {
      timeout: 60000
    }
  }
});

export { supabaseClient };
