import { config, validateConfig } from '../../../lib/config.js';

export const GET = async () => {
  try {
    const validation = validateConfig();
    
    return new Response(JSON.stringify({
      success: true,
      validation,
      config: {
        supabase: {
          url: config.supabase.url ? 'SET' : 'NOT_SET',
          anonKey: config.supabase.anonKey ? 'SET' : 'NOT_SET',
          bucket: config.supabase.bucket,
          tables: config.supabase.tables,
          functions: config.supabase.functions
        },
        huggingface: {
          apiKey: config.huggingface.apiKey ? 'SET' : 'NOT_SET'
        },
        app: config.app
      },
      rawEnv: {
        // Server-side vars
        SUPABASE_DOCUMENTS_TABLE: process.env.SUPABASE_DOCUMENTS_TABLE || 'NOT_SET',
        SUPABASE_CHAT_RECORDS_TABLE: process.env.SUPABASE_CHAT_RECORDS_TABLE || 'NOT_SET',
        
        // Client-side vars (should be available in API routes too)
        NEXT_PUBLIC_SUPABASE_DOCUMENTS_TABLE: process.env.NEXT_PUBLIC_SUPABASE_DOCUMENTS_TABLE || 'NOT_SET',
        NEXT_PUBLIC_SUPABASE_CHAT_RECORDS_TABLE: process.env.NEXT_PUBLIC_SUPABASE_CHAT_RECORDS_TABLE || 'NOT_SET',
        
        HF_API_KEY: process.env.HF_API_KEY ? 'SET' : 'NOT_SET'
      }
    }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};