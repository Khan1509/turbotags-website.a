// For CommonJS (more compatible with Vercel)
const localFallbackTags = require('./fallback.json');

export default async function handler(req, res) {
  // Set headers first
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');

  // Block non-POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Only POST requests are supported' 
    });
  }

  try {
    const { prompt, platform = 'youtube' } = req.body;
    if (!prompt) throw new Error("Missing prompt");

    // 1. Primary: Mistral 7B
    const mistralTags = await tryModel({
      model: "mistralai/mistral-7b-instruct-v0.2",
      prompt: `Generate 10 trending ${platform} tags for: "${prompt}". 
              Return ONLY comma-separated tags, no sentences.`,
      max_tokens: 100
    });

    if (mistralTags) {
      return res.status(200).json({
        tags: formatTags(mistralTags),
        model: "mistral-7b"
      });
    }

    // 2. Secondary: Gemini Flash
    const geminiTags = await tryModel({
      model: "google/gemini-flash-1.5",
      prompt: `Generate 10 ${platform} tags for: "${prompt}".
              Strictly use ONLY commas to separate tags. Example: tag1,tag2,tag3`,
      max_tokens: 80
    });

    if (geminiTags) {
      return res.status(200).json({
        tags: formatTags(geminiTags),
        model: "gemini-flash"
      });
    }

    // 3. Final: Local JSON Fallback
    const fallbackTags = getLocalFallback(platform, prompt);
    return res.status(200).json({
      tags: fallbackTags,
      model: "local-fallback"
    });

  } catch (error) {
    // Ultimate safety net
    return res.status(200).json({
      tags: ["viral", "trending", "fyp"],
      model: "emergency-fallback"
    });
  }
}

// Helper: Universal model caller
async function tryModel({ model, prompt, max_tokens = 100 }) {
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
        max_tokens
      }),
      timeout: 10000 // 10s timeout
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data?.choices?.[0]?.message?.content;
  } catch {
    return null; // Silent fail → triggers next fallback
  }
}

// Helper: Format tags consistently
function formatTags(rawText) {
  if (!rawText) return [];
  return String(rawText)
    .split(',')
    .map(tag => tag.trim().replace(/^[#.]/, ''))
    .filter(tag => tag.length > 0)
    .slice(0, 10); // Ensure max 10 tags
}

// Helper: Smart local fallback
function getLocalFallback(platform, prompt) {
  // Try to match prompt keywords first
  const keywords = prompt.toLowerCase().split(/\s+/);
  const platformTags = localFallbackTags[platform] || localFallbackTags.youtube;
  
  return [
    ...new Set([ // Remove duplicates
      ...keywords.filter(k => k.length > 2),
      ...platformTags
    ])
  ].slice(0, 10);
}
