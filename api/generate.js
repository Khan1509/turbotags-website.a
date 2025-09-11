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

    // Validate prompt length (max 1000 words)
    if (prompt.length > 7000) { // Roughly 1000 words
      return res.status(400).json({ error: 'Prompt too long. Maximum 1000 words allowed.' });
    }

    const isEnglish = language.toLowerCase() === 'english' || language.toLowerCase() === 'en';

    // Define model chains for reliability based on language
    const englishModels = [
      "mistralai/mistral-7b-instruct",
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
    - Task: ${task}
    - User Topic/Prompt: Will be provided separately

    CRITICAL LANGUAGE REQUIREMENT: 
    The ENTIRE response, including ALL generated text (tags, hashtags, titles), MUST be in the specified language: "${language}". 
    If the language is not English, adapt the content to be culturally relevant and linguistically natural for that language and region.

    CONTENT QUALITY REQUIREMENTS:
    - Generate content that is highly relevant, engaging, and trending in ${new Date().getFullYear()}.
    - Consider current trends, viral topics, and platform-specific best practices.
    - Each item must have a "trend_percentage" between 70 and 100 based on its realistic trending potential.
    - Focus on high-engagement, discoverable content for the "${region}" region.

    PLATFORM-SPECIFIC RULES:

    YOUTUBE TITLE RULES:
    - ALL titles MUST be 100 characters or less (strict limit).
    - If contentFormat is 'short' or 'short_video', EVERY title MUST end with " #shorts" (including the space before #).
    - Ensure titles remain under 100 characters even with #shorts added.

    QUANTITY REQUIREMENTS (STRICT):
    
    If the task is 'titles':
    - Generate EXACTLY 7 titles (minimum 5, maximum 10).
    - ALL titles must have trend_percentage between 70-100.
    - For YouTube: titles max 100 characters (including #shorts if applicable).
    - JSON structure: {"titles": [{"text": "Title Here", "trend_percentage": 85}]}
    
    If the task is 'tags_and_hashtags':
      For YOUTUBE:
      - Generate EXACTLY 20 tags (minimum 15, maximum 25).
      - Generate EXACTLY 20 hashtags (minimum 15, maximum 25).
      - ALL items must have trend_percentage between 70-100.
      - JSON structure: {"tags": [{"text": "tag name", "trend_percentage": 85}], "hashtags": [{"text": "#hashtag", "trend_percentage": 92}]}
      
      For INSTAGRAM, TIKTOK, or FACEBOOK:
      - Generate EXACTLY 20 hashtags (minimum 15, maximum 25).
      - ALL hashtags must have trend_percentage between 70-100.
      - JSON structure: {"hashtags": [{"text": "#hashtag", "trend_percentage": 88}]}

    RESPONSE FORMAT:
    - Return ONLY a valid JSON object.
    - NO explanations, markdown, or additional text.
    - Each item must have "text" and "trend_percentage" keys.

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
      console.error(`All models failed. Last error: ${lastError ? lastError.message : 'Unknown error'}. Using static fallback.`);
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
