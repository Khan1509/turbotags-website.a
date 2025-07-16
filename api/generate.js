import localFallbackTags from './fallback.json' assert { type: 'json' };

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  // Block non-POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Only POST requests are supported' 
    });
  }

  try {
    const { prompt, platform } = req.body;
    if (!prompt) throw new Error("Missing prompt");

    // 1. Try Mistral 7B (Fast/Accurate)
    const mistralResponse = await tryModel({
      model: "mistralai/mistral-7b-instruct-v0.2",
      prompt: `Generate 10 ${platform} tags for: ${prompt}. Respond ONLY with comma-separated tags.`,
      temperature: 0.7,
      max_tokens: 100
    });

    if (mistralResponse) {
      return res.status(200).json({
        tags: formatTags(mistralResponse),
        model: "mistral-7b"
      });
    }

    // 2. Try Gemini Flash (Cost-Effective)
    const geminiResponse = await tryModel({
      model: "google/gemini-flash-1.5",
      prompt: `Generate 10 trending ${platform} tags for: ${prompt}. Return ONLY tags separated by commas.`,
      temperature: 0.5,
      max_tokens: 80
    });

    if (geminiResponse) {
      return res.status(200).json({
        tags: formatTags(geminiResponse),
        model: "gemini-flash"
      });
    }

    // 3. Fallback to Local JSON
    const fallbackTags = getLocalFallback(platform, prompt);
    return res.status(200).json({
      tags: fallbackTags,
      model: "local-fallback"
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Generation Failed',
      message: error.message
    });
  }
}

// Helper Functions
async function tryModel({ model, prompt, temperature, max_tokens }) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens
      })
    });
    return (await response.json())?.choices?.[0]?.message?.content;
  } catch {
    return null; // Silently fail to allow fallback
  }
}

function formatTags(rawText) {
  return rawText.split(',')
    .map(tag => tag.trim().replace(/^#/, ''))
    .filter(tag => tag.length > 0);
}

function getLocalFallback(platform, prompt) {
  // Customize your fallback logic per platform
  const defaults = {
    youtube: ["viral", "trending", "shorts"],
    instagram: ["love", "instadaily", "photooftheday"],
    tiktok: ["fyp", "viralvideo", "trending"]
  };
  return defaults[platform.toLowerCase()] || defaults.youtube;
}
