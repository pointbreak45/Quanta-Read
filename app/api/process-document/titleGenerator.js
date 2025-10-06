import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';

import { llm } from '../openai';

const { supabase } = require('../supabase');

export const generateDocumentTitle = async (checksum, fileName) => {
  const defaultTitle = {
    title: fileName
  };
  const prompt = new PromptTemplate({
    template:
      'Based on the passage below, suggest a modest title for the passage. The following are the conditions that must be followed\n\n- The title should be within ten words\n- The title should include only alphabets and numbers\n\nPassage:\n------------------\n{content}\n------------------\n\nTitle:',
    inputVariables: ['content']
  });

  const { content } = await getChunkContent(checksum, 3);
  if (content === null) {
    return defaultTitle;
  }

  const chain = new LLMChain({
    llm,
    prompt,
    verbose: true
  });

  const { text: title, error } = await chain
    .call({
      content
    })
    .catch((error) => {
      console.error({ error });
      return { error };
    });

  if (error) {
    return defaultTitle;
  }

  const documentsTable = process.env.NEXT_PUBLIC_SUPABASE_DOCUMENTS_TABLE || 'documents';
  const { error: updateError } = await supabase()
    .from(documentsTable)
    .update({
      title
    })
    .eq('checksum', checksum);

  if (updateError) {
    console.error(updateError);
    return defaultTitle;
  }

  return {
    title
  };
};

const getChunkContent = async (checksum, chunkLimit = 3) => {
  const chunksTable = process.env.NEXT_PUBLIC_SUPABASE_DOCUMENT_CHUNKS_TABLE || 'document_chunks';
  const { data, error } = await supabase()
    .from(chunksTable)
    .select('chunk_content')
    .lte('chunk_number', chunkLimit)
    .eq('document_checksum', checksum);

  if (error) {
    console.error(error);
    return {
      content: null
    };
  }

  const content = data
    .map((chunk) => chunk.chunk_content)
    .join('\n')
    .slice(0, 6000);

  return {
    content
  };
};
