import { NextResponse } from 'next/server';

import { chatMemory } from '../openai';
import { supabase } from '../supabase';

// GUEST MODE: Constant user ID - Using UUID format for database compatibility
const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000";

export const POST = async (req) => {
  try {
    chatMemory.clear();
  } catch (e) {
    console.error(e);
  }

  const body = await req.json();

  const chatRecordsTable = process.env.NEXT_PUBLIC_SUPABASE_CHAT_RECORDS_TABLE || 'chat_records';
  const { data, error } = await supabase()
    .from(chatRecordsTable)
    .select('id, message, actor, created_at')
    .eq('checksum', body.checksum)
    .eq('created_by', GUEST_USER_ID) // Filter by guest user
    .order('created_at', { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
};
