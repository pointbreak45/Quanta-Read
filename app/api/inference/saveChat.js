import { supabase } from '../supabase';

// GUEST MODE: Constant user ID - Using UUID format for database compatibility
const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000";

export const saveChat = async (chatRecord) => {
  const chatRecordsTable = process.env.NEXT_PUBLIC_SUPABASE_CHAT_RECORDS_TABLE || 'chat_records';
  const { error } = await supabase()
    .from(chatRecordsTable)
    .insert({
      ...chatRecord,
      created_by: GUEST_USER_ID // Set guest user ID
    });

  if (error) {
    console.error(error);
    return { error };
  }

  return { error: null };
};
