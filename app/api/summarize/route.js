import { llm } from '../openai';
import { supabase } from '../supabase';
import { config } from '../../../lib/config.js';

export const POST = async (req) => {
  try {
    const { checksum, content, fileName } = await req.json();

    if (!checksum || !content || !fileName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Truncate content if too long (HuggingFace has token limits)
    const maxContentLength = 4000;
    const contentToSummarize = content.join(' ').slice(0, maxContentLength);

    const summaryPrompt = `Please provide a comprehensive summary of the following document content. Focus on the main topics, key points, and important information:

Document: ${fileName}

Content:
${contentToSummarize}

Summary:`;

    try {
      // Set timeout for LLM call using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 45000); // 45 seconds
      
      const summary = await llm.call(summaryPrompt);
      clearTimeout(timeoutId);
      
      if (!summary || summary.trim().length === 0) {
        throw new Error('Empty summary generated');
      }

      // Store summary in Supabase
      const { error: updateError } = await supabase()
        .from(config.supabase.tables.documents)
        .update({ 
          summary: summary.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('checksum', checksum);

      if (updateError) {
        console.error('Error updating document with summary:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to save summary' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        summary: summary.trim(),
        checksum 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (llmError) {
      console.error('Error generating summary:', llmError);
      
      let errorMessage = 'Failed to generate summary';
      if (llmError.message.includes('timeout') || llmError.message.includes('timed out')) {
        errorMessage = 'Summary generation timed out. Please try again.';
      } else if (llmError.message.includes('rate limit') || llmError.message.includes('429')) {
        errorMessage = 'API rate limit exceeded. Please try again in a moment.';
      } else if (llmError.message.includes('API key') || llmError.message.includes('401')) {
        errorMessage = 'Invalid API key. Please check your HuggingFace configuration.';
      }
      
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Summarization error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};