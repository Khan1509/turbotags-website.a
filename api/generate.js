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

// Main handler function for Vercel
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, platform, contentFormat, region, language, task } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const isEnglish = language === 'english';

    // Define model chains for reliability based on language
    const englishModels = [
      "mistralai/mistral-7b-instruct", // Primary for English
      "google/gemini-flash-1.5",
      "anthropic/claude-3-haiku",
      "meta-llama/llama-3.1-8b-instruct"
    ];
    const nonEnglishModels = [
      "google/gemini-flash-1.5", // Primary for non-English
      "mistralai/mistral-7b-instruct",
      "meta-llama/llama-3.1-8b-instruct",
      "anthropic/claude-3-haiku"
    ];
    const modelsToTry = isEnglish ? englishModels : nonEnglishModels;
    
    const systemPrompt = `You are an expert social media content strategist and trend analyst. Your task is to generate highly optimized, trending content based on the user's prompt.

    TARGET SPECIFICATIONS:
    - Platform: ${platform}
    - Content Format: ${contentFormat}
    - Target Region: ${region}
    - Language: ${language}
    - User Topic/Prompt: Will be provided separately

    CRITICAL LANGUAGE REQUIREMENT: 
    The ENTIRE response, including ALL generated text (tags, hashtags, titles), MUST be in the specified language: ${language}. 
    If the language is not English, adapt the content to be culturally relevant and linguistically natural for that language and region.

    CONTENT QUALITY REQUIREMENTS:
    - Generate content that is highly relevant, engaging, and trending in ${new Date().getFullYear()}
    - Consider current trends, viral topics, and platform-specific best practices
    - Each item must have a "trend_percentage" between 70 and 100 based on actual trending potential
    - Focus on high-engagement, discoverable content for the ${region} region

    PLATFORM-SPECIFIC RULES:

    YOUTUBE TITLE RULES:
    - ALL titles MUST be 100 characters or less (strict limit)
    - If contentFormat is 'short', EVERY title MUST end with " #shorts" (include the space)
    - Titles should be click-worthy and SEO-optimized for YouTube search

    QUANTITY REQUIREMENTS (STRICT):
    
    For TITLES (all platforms):
    - Generate 5-7 titles (minimum 5, maximum 10)
    - JSON structure: {"titles": [{"text": "Title Here", "trend_percentage": 85}]}
    
    For TAGS AND HASHTAGS on YOUTUBE:
    - Generate 15-20 tags (minimum 15, maximum 25)
    - Generate 15-20 hashtags (minimum 15, maximum 25)  
    - JSON structure: {"tags": [{"text": "tag name", "trend_percentage": 85}], "hashtags": [{"text": "#hashtag", "trend_percentage": 92}]}
    
    For HASHTAGS on INSTAGRAM/TIKTOK/FACEBOOK:
    - Generate 15-20 hashtags (minimum 15, maximum 25)
    - JSON structure: {"hashtags": [{"text": "#hashtag", "trend_percentage": 88}]}

    RESPONSE FORMAT:
    - Return ONLY a valid JSON object
    - NO explanations, markdown, or additional text
    - Each item must have "text" and "trend_percentage" keys
    - Trend percentages must realistically reflect trending potential (70-100)

    Remember: Quality over quantity, but meet the minimum requirements. Focus on trending, discoverable content for ${platform} in ${region}.`;

    let result;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        result = await callOpenRouter(model, systemPrompt, prompt);
        lastError = null; // Clear last error on success
        break; // Exit loop on success
      } catch (error) {
        console.warn(`Model ${model} failed: ${error.message}. Trying next model.`);
        lastError = error;
      }
    }

    if (!result) {
      console.error(`All models failed. Last error: ${lastError.message}. Using static fallback.`);
      const fallbackPath = path.join(process.cwd(), 'public', 'data', 'fallback.json');
      result = JSON.parse(await fs.readFile(fallbackPath, 'utf-8'));
    }
    
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(200).json(result);

  } catch (error) {
    console.error('Critical error in generate handler:', error.message);
    try {
        const fallbackPath = path.join(process.cwd(), 'public', 'data', 'fallback.json');
        const fallbackData = await fs.readFile(fallbackPath, 'utf-8');
        return res.status(500).json(JSON.parse(fallbackData));
    } catch (fallbackReadError) {
        return res.status(500).json({ error: 'An unexpected error occurred and the fallback file could not be read.' });
    }
  }
}
