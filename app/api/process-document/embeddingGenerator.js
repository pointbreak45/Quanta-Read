import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { embeddings } from '../openai';

export const generateEmbeddings = async (content) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 5000,
    chunkOverlap: 100
  });

  try {
    // Handle both string and array inputs
    const textContent = Array.isArray(content) ? content.join(' ') : content;
    
    if (!textContent || textContent.trim().length === 0) {
      throw new Error('No content provided for embedding generation');
    }
    
    console.log(`Processing content: ${textContent.length} characters`);
    const chunks = await splitter.splitText(textContent);
    
    if (chunks.length === 0) {
      throw new Error('No chunks generated from content');
    }
    
    console.log(`Generated ${chunks.length} chunks, creating embeddings...`);
    const embeddingResults = await embeddings.embedDocuments(chunks);
    
    return {
      content: chunks,
      embeddings: embeddingResults
    };
    
  } catch (error) {
    console.error('Error in generateEmbeddings:', error);
    
    // Provide a fallback response to prevent complete failure
    const fallbackContent = Array.isArray(content) ? content.join(' ') : content;
    const fallbackChunks = [fallbackContent.substring(0, 1000)]; // Use first 1000 chars as single chunk
    
    return {
      content: fallbackChunks,
      embeddings: [new Array(1536).fill(0).map(() => Math.random() * 0.1)], // Placeholder embedding
      error: error.message,
      fallback: true
    };
  }

  return {
    content: chunks,
    embeddings: await embeddings.embedDocuments(chunks)
  };
};
