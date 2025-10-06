import { supabase } from '../supabase';
import { config, GUEST_USER_ID } from '../../../lib/config.js';

export const POST = async (req) => {
  try {
    const { checksum, format = 'txt' } = await req.json();

    if (!checksum) {
      return new Response(JSON.stringify({ error: 'Document ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch chat records from Supabase (filtered by guest user)
    const { data: chatRecords, error } = await supabase()
      .from(config.supabase.tables.chatRecords)
      .select('*')
      .eq('checksum', checksum)
      .eq('created_by', GUEST_USER_ID) // Filter by guest user
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat records:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch chat history' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!chatRecords || chatRecords.length === 0) {
      return new Response(JSON.stringify({ error: 'No chat history found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get document info (filtered by guest user)
    const { data: documentInfo } = await supabase()
      .from(config.supabase.tables.documents)
      .select('title, document_name')
      .eq('checksum', checksum)
      .eq('created_by', GUEST_USER_ID) // Filter by guest user
      .single();

    const documentTitle = documentInfo?.title || 'Document';
    const fileName = documentInfo?.document_name || 'document';
    
    // Format the chat history
    let content = '';
    let mimeType = 'text/plain';
    let fileExtension = 'txt';

    if (format === 'txt') {
      content = formatAsTxt(chatRecords, documentTitle);
      mimeType = 'text/plain';
      fileExtension = 'txt';
    } else if (format === 'json') {
      content = JSON.stringify({
        document: {
          title: documentTitle,
          fileName: fileName,
          checksum: checksum
        },
        conversations: chatRecords,
        exportedAt: new Date().toISOString()
      }, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    }

    // Return the formatted content
    const exportFileName = `${fileName.replace(/\.pdf$/, '')}_chat_export.${fileExtension}`;
    
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${exportFileName}"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Export chat error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

function formatAsTxt(chatRecords, documentTitle) {
  const header = `Chat History for: ${documentTitle}\n`;
  const separator = '='.repeat(50) + '\n';
  const exportInfo = `Exported on: ${new Date().toLocaleString()}\n`;
  const conversationHeader = 'Conversation:\n' + '-'.repeat(20) + '\n\n';

  let conversations = '';
  
  chatRecords.forEach((record, index) => {
    const timestamp = new Date(record.created_at).toLocaleString();
    const actor = record.actor === 'human' ? 'You' : 'AI Assistant';
    const message = record.message || '';
    
    conversations += `[${timestamp}] ${actor}:\n${message}\n\n`;
  });

  return header + separator + exportInfo + '\n' + conversationHeader + conversations;
}