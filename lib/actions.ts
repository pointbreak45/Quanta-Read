"use server";

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// GUEST MODE: Using basic Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false
    }
  }
);

// GUEST MODE: Constant user ID - Using UUID format for database compatibility
const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000";

// Server action to handle file upload to Supabase Storage
export async function uploadFile(formData: FormData) {

  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file provided' };
  }

  try {
    // Generate checksum for the file - include timestamp for uniqueness
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    const fileHash = crypto.createHash('md5').update(uint8Array).digest('hex');
    const checksum = crypto.createHash('md5').update(`${file.name}::${fileHash}::${Date.now()}`).digest('hex');
    const fileName = file.name;

    // Upload file to Supabase Storage
    const bucketName = (process as any).env.NEXT_PUBLIC_SUPABASE_BUCKET || 'documents';
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(`${checksum}.pdf`, file, {
        cacheControl: '3600',
        upsert: true // Allow overwrite if file exists
      });

    if (uploadError) {
      // If the error is about the file already existing, that's ok - continue processing
      if (uploadError.message?.includes('already exists') || uploadError.message?.includes('Duplicate')) {
        console.log('File already exists in storage, continuing with processing...');
      } else if (uploadError.message?.includes('row-level security policy') || uploadError.message?.includes('policy violation')) {
        console.error('RLS policy error:', uploadError);
        return { error: `Storage error: new row violates row-level security policy. Please check your database permissions.` };
      } else {
        console.error('Storage upload error:', uploadError);
        return { error: `Storage error: ${uploadError.message}` };
      }
    }

    // Extract text content from PDF (simplified - you'll need a proper PDF parser)
    const content = await extractTextFromFile(file);

    // Process the document using existing API
    const baseUrl = (process as any).env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const processResponse = await fetch(`${baseUrl}/api/process-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checksum,
        fileName,
        content
      })
    });

    if (!processResponse.ok) {
      const error = await processResponse.json();
      return { error: error.message || 'Failed to process document' };
    }

    const processResult = await processResponse.json();
    
    return { 
      success: true, 
      data: {
        id: checksum,
        fileName,
        message: processResponse.status === 200 ? 'Document already exists and is ready to use' : 'File uploaded successfully',
        isExisting: processResponse.status === 200
      }
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { error: 'Failed to upload file' };
  }
}

// Helper function to extract text from file using the existing PDF extraction API
async function extractTextFromFile(file: File): Promise<string> {
  try {
    // Use the existing PDF extraction API endpoint with proper absolute URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/extract-pdf`, {
      method: 'POST',
      body: await file.arrayBuffer(),
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });

    if (!response.ok) {
      console.warn('PDF extraction failed, using fallback');
      return `Content placeholder for ${file.name} - PDF extraction temporarily unavailable`;
    }

    const result = await response.json();
    
    // Handle both string and array responses from the extraction API
    if (result.content) {
      return Array.isArray(result.content) ? result.content.join(' ') : result.content;
    }
    
    // Fallback if no content extracted
    return `Content placeholder for ${file.name} - No text content extracted`;
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return `Content placeholder for ${file.name} - Error during text extraction`;
  }
}
