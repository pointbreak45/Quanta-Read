// Fallback embedding system when HuggingFace is unavailable
// This provides basic functionality to keep the system running

class FallbackEmbeddings {
  constructor() {
    this.dimension = 1536; // Standard embedding dimension
  }

  // Simple text-to-vector conversion using character codes and hashing
  textToVector(text) {
    const vector = new Array(this.dimension).fill(0);
    
    // Normalize text
    const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, '').trim();
    
    // Generate hash-based features
    for (let i = 0; i < normalizedText.length; i++) {
      const char = normalizedText.charCodeAt(i);
      const position = (char * 17 + i * 31) % this.dimension;
      vector[position] += 1 / (normalizedText.length + 1);
    }
    
    // Add word-based features
    const words = normalizedText.split(/\s+/).filter(w => w.length > 0);
    words.forEach((word, wordIndex) => {
      const wordHash = this.simpleHash(word);
      const position = wordHash % this.dimension;
      vector[position] += 0.5 / words.length;
      
      // Add bigram features
      if (wordIndex < words.length - 1) {
        const bigram = word + words[wordIndex + 1];
        const bigramHash = this.simpleHash(bigram);
        const bigramPosition = bigramHash % this.dimension;
        vector[bigramPosition] += 0.25 / words.length;
      }
    });
    
    // Normalize vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      return vector.map(val => val / magnitude);
    }
    
    return vector;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  async embedQuery(text) {
    console.log('Using fallback embeddings for query...');
    return this.textToVector(text);
  }

  async embedDocuments(texts) {
    console.log(`Using fallback embeddings for ${texts.length} documents...`);
    return texts.map(text => this.textToVector(text));
  }
}

export { FallbackEmbeddings };