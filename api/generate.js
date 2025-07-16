// api/generate.js
export default async function handler(req, res) {
  console.log("[API] Request received for OpenRouter with failover logic");

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ 
      error: 'Method Not Allowed', 
      message: 'Only POST requests are supported' 
    });
  }

  // Validate API key
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    console.error("[API] OPENROUTER_API_KEY not configured");
    return res.status(500).json({ 
      error: 'Server Configuration Error', 
      message: 'OpenRouter API key not configured' 
    });
  }

  // Validate request body
  if (!req.body?.prompt) {
    return res.status(400).json({ 
      error: 'Bad Request', 
      message: 'Missing prompt in request body' 
    });
  }

  const { prompt } = req.body;
  console.log(`[API] Processing prompt (${prompt.length} chars): "${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}"`);

  const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
  const MODELS = {
    PRIMARY: "mistralai/mistral-7b-instruct-v0.2",
    FALLBACK: "google/gemini-flash-1.5"
  };

  const headers = {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://your-site.com', // OpenRouter requires this
    'X-Title': 'Your App Name' // For OpenRouter analytics
  };

  const requestOptions = {
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300, // Increased from 150 for better responses
    temperature: 0.7,
  };

  try {
    // Try primary model
    console.log(`[API] Attempting primary model: ${MODELS.PRIMARY}`);
    const primaryResponse = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...requestOptions, model: MODELS.PRIMARY })
    });

    if (primaryResponse.ok) {
      const data = await primaryResponse.json();
      if (data?.choices?.[0]?.message?.content) {
        return res.status(200).json({ 
          text: data.choices[0].message.content,
          modelUsed: MODELS.PRIMARY
        });
      }
    } else {
      const error = await primaryResponse.json();
      console.error("[API] Primary model error:", error);
    }

    // Fallback model attempt
    console.log(`[API] Trying fallback model: ${MODELS.FALLBACK}`);
    const fallbackResponse = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...requestOptions, model: MODELS.FALLBACK })
    });

    if (fallbackResponse.ok) {
      const data = await fallbackResponse.json();
      return res.status(200).json({ 
        text: data.choices[0].message.content,
        modelUsed: MODELS.FALLBACK
      });
    } else {
      const error = await fallbackResponse.json();
      console.error("[API] Fallback model error:", error);
      throw new Error('Both models failed');
    }

  } catch (error) {
    console.error("[API] Server error:", error);
    return res.status(500).json({ 
      error: 'Generation Failed', 
      message: error.message || 'All models failed to respond' 
    });
  }
}
