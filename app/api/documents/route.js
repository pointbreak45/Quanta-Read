import { NextResponse } from 'next/server';
import { supabase } from '../supabase';
import { config } from '../../../lib/config.js';

export const GET = async () => {
  try {
    console.log('Fetching documents for library display');
    
    const { data, error } = await supabase()
      .from(config.supabase.tables.documents)
      .select('checksum, document_name, title, created_time')
      // Note: Temporarily removing created_by filter to avoid guest user issues
      // .eq('created_by', GUEST_USER_ID)
      .order('created_time', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`Found ${data?.length || 0} documents`);
    return NextResponse.json(data || []);

  } catch (err) {
    console.error('Documents API error:', err);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
};