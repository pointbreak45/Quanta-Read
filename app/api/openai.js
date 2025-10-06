import { HuggingFaceInference } from 'langchain/llms/hf';
import { HuggingFaceInferenceEmbeddings } from 'langchain/embeddings/hf';
import { BufferMemory } from 'langchain/memory';
import { FallbackEmbeddings } from './fallback-embeddings.js';

const chatMemory = new BufferMemory();

// Check if HF_API_KEY exists
if (!process.env.HF_API_KEY) {
  console.error('❌ HF_API_KEY is not set in environment variables');
  console.log('Please add your HuggingFace API key to the .env file:');
  console.log('HF_API_KEY=your_huggingface_api_key');
}

// LLM configuration with timeout and error handling
const llm = new HuggingFaceInference({
  model: 'microsoft/DialoGPT-medium',
  apiKey: process.env.HF_API_KEY,
  temperature: 0.7,
  maxTokens: 512,
  timeout: 30000,
  maxRetries: 2
});

// Robust embeddings system with immediate fallback to local implementation
class ProductionEmbeddings {
  constructor() {
    this.localFallback = new FallbackEmbeddings();
    this.useHuggingFace = false; // Disable HuggingFace temporarily due to connectivity issues
    
    if (this.useHuggingFace && process.env.HF_API_KEY) {
      this.hfEmbeddings = new HuggingFaceInferenceEmbeddings({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        apiKey: process.env.HF_API_KEY,
        timeout: 5000, // Very short timeout
        maxRetries: 0
      });
    }
  }

  async embedQuery(text) {
    // For now, go straight to local fallback due to HF connectivity issues
    if (!this.useHuggingFace) {
      console.log('🔄 Using local fallback embeddings for query (HF disabled)');
      return await this.localFallback.embedQuery(text);
    }
    
    // Try HuggingFace first (when enabled)
    try {
      console.log('Attempting HuggingFace embeddings for query...');
      return await this.hfEmbeddings.embedQuery(text);
    } catch (error) {
      console.warn('⚠️ HuggingFace failed, using local fallback:', error.message);
      return await this.localFallback.embedQuery(text);
    }
  }

  async embedDocuments(texts) {
    // For now, go straight to local fallback due to HF connectivity issues
    if (!this.useHuggingFace) {
      console.log(`🔄 Using local fallback embeddings for ${texts.length} documents (HF disabled)`);
      return await this.localFallback.embedDocuments(texts);
    }
    
    // Try HuggingFace first (when enabled)
    try {
      console.log(`Attempting HuggingFace embeddings for ${texts.length} documents...`);
      return await this.hfEmbeddings.embedDocuments(texts);
    } catch (error) {
      console.warn('⚠️ HuggingFace failed, using local fallback:', error.message);
      return await this.localFallback.embedDocuments(texts);
    }
  }
  
  // Method to enable HuggingFace when connectivity is restored
  enableHuggingFace() {
    this.useHuggingFace = true;
    console.log('✅ HuggingFace embeddings enabled');
  }
  
  // Method to disable HuggingFace if issues persist
  disableHuggingFace() {
    this.useHuggingFace = false;
    console.log('⚠️ HuggingFace embeddings disabled, using local fallback');
  }
}

const embeddings = new ProductionEmbeddings();

export { chatMemory, llm, embeddings };
