import { NextResponse } from 'next/server';
import { supabase } from '../supabase';

// GUEST MODE: Test with proper UUID
const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000";

export const GET = async () => {
  try {
    console.log('Testing Supabase connection in Guest Mode...');
    
    // Test basic connection
    const { data: tables, error } = await supabase()
      .from('documents')
      .select('count')
      .eq('created_by', GUEST_USER_ID)
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return NextResponse.json({ 
        status: 'error',
        error: error.message,
        details: error 
      }, { status: 500 });
    }

    // Test environment variables
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      documentsTable: process.env.NEXT_PUBLIC_SUPABASE_DOCUMENTS_TABLE || 'documents',
      bucket: process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'documents',
      guestUserId: GUEST_USER_ID
    };

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful in Guest Mode',
      environment: envCheck,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Connection test failed:', error);
    return NextResponse.json({ 
      status: 'error',
      error: error.message 
    }, { status: 500 });
  }
};