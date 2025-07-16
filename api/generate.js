// Use dynamic import() for JSON to work in Vercel Edge Functions
const localFallbackTags = {
  youtube: ["trending", "viral", "shorts", "subscribe", "youtuber"],
  instagram: ["love", "instadaily", "photooftheday", "instagood", "fashion"],
  tiktok: ["fyp", "foryoupage", "viralvideo", "trending", "tiktoker"]
};

export default async function handler(req, res) {
  // Set headers first - critical for Edge Functions
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
    
    if (!prompt) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing prompt in request body'
      });
    }

    // 1. Primary: Mistral 7B
    let tags, model;
    
    try {
      const mistralResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct-v0.2",
          messages: [{
            role: "user",
            content: `Generate 10 ${platform} tags for: "${prompt}". Return ONLY comma-separated tags. Example: tag1,tag2,tag3`
          }],
          max_tokens: 100
        }),
        timeout: 8000
      });

      if (mistralResponse.ok) {
        const data = await mistralResponse.json();
        tags = formatTags(data?.choices?.[0]?.message?.content);
        model = "mistral-7b";
      }
    } catch (e) {} // Silent fallthrough

    // 2. Secondary: Gemini Flash
    if (!tags) {
      try {
        const geminiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "google/gemini-flash-1.5",
            messages: [{
              role: "user",
              content: `Generate EXACTLY 10 ${platform} tags for: "${prompt}". Separate ONLY by commas. No sentences.`
            }],
            max_tokens: 80
          }),
          timeout: 8000
        });

        if (geminiResponse.ok) {
          const data = await geminiResponse.json();
          tags = formatTags(data?.choices?.[0]?.message?.content);
          model = "gemini-flash";
        }
      } catch (e) {} // Silent fallthrough
    }

    // 3. Local Fallback
    if (!tags) {
      tags = getLocalFallback(platform, prompt);
      model = "local-fallback";
    }

    // Final response (always succeeds)
    return res.status(200).json({ tags, model });

  } catch (error) {
    // Ultimate fallback
    return res.status(200).json({
      tags: ["viral", "trending", "fyp"],
      model: "emergency-fallback"
    });
  }
}

// Formatting helper
function formatTags(rawText) {
  if (!rawText) return [];
  return String(rawText)
    .split(',')
    .map(tag => tag.trim().replace(/^[#.]/, ''))
    .filter(tag => tag.length > 0)
    .slice(0, 10);
}

// Local fallback logic
function getLocalFallback(platform, prompt) {
  const platformTags = localFallbackTags[platform] || localFallbackTags.youtube;
  const promptKeywords = prompt.toLowerCase().split(/\s+/).filter(k => k.length > 2);
  
  return [...new Set([...promptKeywords, ...platformTags])].slice(0, 10);
}
