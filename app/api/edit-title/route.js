import { NextResponse } from 'next/server';

import { supabase } from '../supabase';

export const PATCH = async (req) => {
  const { id, title } = await req.json();

  const documentsTable = process.env.NEXT_PUBLIC_SUPABASE_DOCUMENTS_TABLE || 'documents';
  const { error, count } = await supabase()
    .from(documentsTable)
    .update({ title })
    .eq('checksum', id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }

  if (count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    message: 'Document title updated successfully'
  });
};
