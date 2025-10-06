import { embeddings } from '../openai';
import { supabase } from '../supabase';

export const filterSimilarVectors = async (documentId, message, matchCount) => {
  const query_embedding = await embeddings.embedQuery(message);

  const { data: vectors, error } = await supabase().rpc('match_documents', {
    query_embedding,
    match_count: matchCount,
    filter_checksum: documentId
  });

  if (error) {
    return { error };
  }

  return {
    content: vectors
      .map((v) => {
        return v.chunk_content;
      })
      .join(' '),
    error: null
  };
};
