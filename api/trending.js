import { promises as fs } from 'fs';
import path from 'path';

// Helper to call OpenRouter API
async function callOpenRouter(model, systemPrompt, userPrompt) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.startsWith('YOUR_')) {
    throw new Error('OPENROUTER_API_KEY is not set or is a placeholder.');
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error for model ${model}: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

export default async function handler(req, res) {
  const systemPrompt = `You are a social media trend analyst with expertise in 2025 trends. Generate 4 current, viral, and highly engaging content ideas for each platform: YouTube, Instagram, TikTok, and Facebook. Focus on trending topics, viral challenges, current events, and popular culture relevant to ${new Date().toDateString()}. Each topic must be realistic and trending with high engagement potential. The output must be a valid JSON object in the following format: {"trendingTopics": [{"platform": "YouTube", "topics": [{"title": "Trending Topic", "description": "One-sentence description of why it's trending"}]}]}. Do not include any other text, markdown, or explanations.`;

  // Use the same robust 3-model fallback system as main generation API
  const trendingModels = [
    "google/gemini-2.5-flash-lite",           // Primary: Fast and efficient
    "openai/gpt-4.1-nano",                   // Secondary: High quality reasoning  
    "google/gemini-2.5-flash-lite-preview-06-17"  // Tertiary: Latest preview features
  ];
  
  const userPrompt = `Generate trending topics for today, ${new Date().toDateString()}.`;
  let result;
  let lastError = null;

  try {
    // Try each model in sequence with robust fallback
    for (let i = 0; i < trendingModels.length; i++) {
      const model = trendingModels[i];
      try {
        console.log(`[TRENDING] Attempting model ${i + 1}/3: ${model}`);
        result = await callOpenRouter(model, systemPrompt, userPrompt);
        
        // Validate the response has required structure
        if (result && result.trendingTopics && Array.isArray(result.trendingTopics)) {
          console.log(`[TRENDING] SUCCESS: Model ${model} succeeded`);
          res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400, max-age=3600'); // Cache for 24 hours, refresh every hour
          return res.status(200).json({
            ...result,
            model_used: model,
            generation_source: 'api',
            last_updated: new Date().toISOString()
          });
        } else {
          console.warn(`[TRENDING] Model ${model} returned invalid structure`);
          lastError = new Error('Invalid response structure');
          continue;
        }
        
      } catch (error) {
        console.warn(`[TRENDING] Model ${model} (attempt ${i + 1}/3) failed: ${error.message}`);
        lastError = error;
        continue; // Try next model
      }
    }

    // All models failed, use fallback
    throw lastError || new Error('All models failed');

  } catch (error) {
    console.error(`[TRENDING] All 3 models failed. Last error: ${error.message}. Using fallback data.`);
    
    // If API fails, serve the static fallback file  
    try {
      const fallbackPath = path.join(process.cwd(), 'public', 'data', 'fallback-trending.json');
      const data = await fs.readFile(fallbackPath, 'utf-8');
      const fallbackData = JSON.parse(data);
      
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=3600, max-age=1800'); // Shorter cache for fallback
      return res.status(200).json({
        ...fallbackData,
        generation_source: 'fallback_json',
        message: 'Using reliable fallback trending data - AI models temporarily unavailable',
        last_updated: new Date().toISOString()
      });
      
    } catch (fallbackError) {
      console.error('[TRENDING] Error reading trending topics fallback:', fallbackError);
      return res.status(500).json({ 
        error: 'Failed to load trending topics from both API and fallback.',
        generation_source: 'error' 
      });
    }
  }
}
