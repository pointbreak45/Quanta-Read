export const GET = async () => {
  try {
    return new Response(JSON.stringify({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        hfApiKeyPresent: !!process.env.HF_API_KEY,
        supabaseUrlPresent: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKeyPresent: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      status: 'error',
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};