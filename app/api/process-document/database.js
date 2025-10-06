import SqlString from 'sqlstring';

import { supabase } from '../supabase';
import { config, GUEST_USER_ID } from '../../../lib/config.js';

export const fetchDocument = async ({ checksum }) => {
  console.log('Fetching from table:', config.supabase.tables.documents);
  
  const { data, error, count } = await supabase()
    .from(config.supabase.tables.documents)
    .select('checksum, document_name, title', {
      count: 'exact'
    })
    .eq('checksum', checksum);
    // Note: Temporarily removing created_by filter to avoid guest user issues
    // .eq('created_by', GUEST_USER_ID);

  if (error) {
    console.error(error);
    return { error };
  }

  if (count === 0) {
    return {
      data: null,
      error: null
    };
  }

  const { checksum: id, document_name: fileName, title } = data[0];
  return {
    data: {
      id,
      fileName,
      title
    },
    error: null
  };
};

export const saveDocument = async ({ checksum, fileName, chunks }) => {
  
  // Try to get the storage object, but don't fail if it doesn't exist
  const { data: object, error: objectError } = await supabase()
    .schema('storage')
    .from('objects')
    .select('id')
    .eq('name', `${checksum}.pdf`);

  // Prepare the document insert data without foreign key for guest mode
  const documentData = {
    checksum: checksum,
    document_name: fileName,
    title: fileName
    // Note: Temporarily removing created_by to avoid foreign key constraint
    // In production, you should either:
    // 1. Create the guest user in auth.users table, or
    // 2. Make created_by nullable and remove the foreign key constraint
  };

  // Add uploaded_object_id if storage object exists
  if (object && object.length > 0) {
    documentData.uploaded_object_id = object[0].id;
  }

  const { error } = await supabase()
    .from(config.supabase.tables.documents)
    .insert(documentData);

  if (error) {
    console.error('Error saving document:', error);
    if (error.message?.includes('row-level security policy') || error.message?.includes('policy violation')) {
      return { error: 'Database access denied: Row-level security policy violation. Please check your database permissions.' };
    }
    if (error.message?.includes('foreign key constraint') || error.code === '23503') {
      return { error: 'Database constraint error: Guest user not found. Please run the database setup script.' };
    }
    return { error: error.message || 'Failed to save document' };
  }

  // Handle potential embedding errors gracefully
  if (chunks.error) {
    console.warn('Embeddings had errors, but continuing with fallback data:', chunks.error);
  }

  const { error: saveChunksError } = await saveDocumentChunks(checksum, chunks);
  if (saveChunksError) {
    await supabase()
      .from(config.supabase.tables.documents)
      .delete({ count: 1 })
      .eq('checksum', checksum);

    return {
      error: saveChunksError
    };
  }

  return {
    data: {
      id: checksum,
      fileName,
      embeddingStatus: chunks.fallback ? 'fallback' : 'success'
    },
    error: null
  };
};

const saveDocumentChunks = async (checksum, chunks) => {
  const { content, embeddings } = chunks;

  let data = [];
  for (let i = 0; i < content.length; i++) {
    data.push({
      document_checksum: checksum,
      chunk_number: i + 1,
      chunk_content: SqlString.escape(content[i]),
      chunk_embedding: embeddings[i]
      // Note: Temporarily removing created_by to avoid foreign key constraint
      // Same issue as with documents table
    });
  }

  const { error } = await supabase()
    .from(config.supabase.tables.documentChunks)
    .insert(data);

  if (error) {
    console.error('Error saving document chunks:', error);
    if (error.message?.includes('row-level security policy') || error.message?.includes('policy violation')) {
      return { error: 'Database access denied: Row-level security policy violation for document chunks. Please check your database permissions.' };
    }
    if (error.message?.includes('foreign key constraint') || error.code === '23503') {
      return { error: 'Database constraint error: Guest user not found for chunks. Please run the database setup script.' };
    }
    return { error: error.message || 'Failed to save document chunks' };
  }

  return { error: null };
};
