export const GET = async () => {
  try {
    const hfApiKey = process.env.HF_API_KEY;
    
    if (!hfApiKey) {
      return new Response(JSON.stringify({ 
        error: 'HF_API_KEY not found in environment variables' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Test with a simple HuggingFace API call
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: 'Hello, this is a test.',
        parameters: {
          max_length: 50,
          temperature: 0.7
        }
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        error: `HuggingFace API error: ${response.status} - ${errorText}` 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await response.json();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'HuggingFace API is working!',
      apiKeyPresent: !!hfApiKey,
      apiKeyPrefix: hfApiKey.substring(0, 7) + '...',
      testResponse: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('HuggingFace API test error:', error);
    return new Response(JSON.stringify({ 
      error: `Test failed: ${error.message}`,
      type: error.constructor.name
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};