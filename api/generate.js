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

    // Define model chains for reliability
    const englishModels = [
      "mistralai/mistral-7b-instruct:free",
      "google/gemini-flash-1.5",
      "anthropic/claude-3-haiku-20240307"
    ];
    const nonEnglishModels = [
      "google/gemini-flash-1.5",
      "anthropic/claude-3-haiku-20240307",
      "mistralai/mistral-7b-instruct:free" // Last resort for non-english
    ];
    const modelsToTry = isEnglish ? englishModels : nonEnglishModels;
    
    const systemPrompt = `You are an expert social media content strategist. Your task is to generate SEO-optimized content based on a user's prompt.
    The user is targeting:
    - Platform: ${platform}
    - Content Format: ${contentFormat}
    - Region: ${region}
    - Language: ${language}

    CRITICAL: The entire response, including all generated text, MUST be in the specified language: ${language}.

    Analyze the user's prompt and generate content that is highly relevant, engaging, and likely to trend.
    For each item (tag, hashtag, or title), you MUST provide a "trend_percentage" between 70 and 100.

    Your response MUST be a valid JSON object. Do NOT include any explanations or markdown formatting. Only the raw JSON object.

    SPECIFIC RULES:
    - If the platform is 'youtube' and the task is 'titles', all generated titles MUST be 100 characters or less.
    - If the platform is 'youtube', the contentFormat is 'short', and the task is 'titles', every generated title MUST end with the exact text " #shorts".

    QUANTITY RULES:
    - If the task is 'titles', the JSON must have one key: "titles" (an array of 5 to 7 objects, max 10).
    - If the task is 'tags_and_hashtags' for 'youtube', the JSON must have two keys: "tags" (an array of 15 to 20 objects, max 25) and "hashtags" (an array of 15 to 20 objects, max 25).
    - If the task is 'tags_and_hashtags' for 'instagram', 'tiktok', or 'facebook', the JSON must have one key: "hashtags" (an array of 15 to 20 objects, max 25). The "tags" array must be empty.

    JSON STRUCTURE:
    - Each object in the arrays must have two keys: "text" (the generated content as a string) and "trend_percentage" (a number between 70 and 100).
    - Example for 'tags_and_hashtags' task on YouTube: {"tags": [{"text": "example tag", "trend_percentage": 85}], "hashtags": [{"text": "#exampleHashtag", "trend_percentage": 92}]}
    - Example for 'titles' task: {"titles": [{"text": "This is an Example Title", "trend_percentage": 88}]}`;

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
