import { NextResponse } from 'next/server';

import { supabase } from '../supabase';

// GUEST MODE: Constant user ID - Using UUID format for database compatibility
const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000";

export const GET = async () => {
  const documentsTable = process.env.NEXT_PUBLIC_SUPABASE_DOCUMENTS_TABLE || 'documents';
  const { data: documents, error } = await supabase()
    .from(documentsTable)
    .select('checksum, document_name, title')
    .eq('created_by', GUEST_USER_ID) // Filter by guest user
    .order('created_time', { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(documents);
};
