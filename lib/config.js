// Centralized configuration for environment variables
// This provides a single source of truth and proper fallbacks

export const config = {
  // Supabase configuration - prefer server-side vars in API routes, client-side vars in components
  supabase: {
    url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    bucket: process.env.SUPABASE_BUCKET || process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'documents',
    
    // Table names with proper fallbacks
    tables: {
      documents: process.env.SUPABASE_DOCUMENTS_TABLE || process.env.NEXT_PUBLIC_SUPABASE_DOCUMENTS_TABLE || 'documents',
      chatRecords: process.env.SUPABASE_CHAT_RECORDS_TABLE || process.env.NEXT_PUBLIC_SUPABASE_CHAT_RECORDS_TABLE || 'chat_records',
      documentChunks: process.env.SUPABASE_DOCUMENT_CHUNKS_TABLE || process.env.NEXT_PUBLIC_SUPABASE_DOCUMENT_CHUNKS_TABLE || 'document_chunks'
    },
    
    // Functions
    functions: {
      vectorMatching: process.env.SUPABASE_VECTOR_MATCHING_FUNCTION || process.env.NEXT_PUBLIC_SUPABASE_VECTOR_MATCHING_FUNCTION || 'match_documents'
    }
  },
  
  // HuggingFace configuration
  huggingface: {
    apiKey: process.env.HF_API_KEY || '',
  },
  
  // Application configuration
  app: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  }
};

// Guest mode configuration
export const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000";

// Utility function to check if all required config is present
export const validateConfig = () => {
  const errors = [];
  
  if (!config.supabase.url) {
    errors.push('SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is required');
  }
  
  if (!config.supabase.anonKey) {
    errors.push('SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
  }
  
  if (!config.huggingface.apiKey) {
    errors.push('HF_API_KEY is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};