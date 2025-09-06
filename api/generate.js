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
    // FIX: Use the explicit free-tier model for Mistral, which is more reliable.
    const primaryModel = isEnglish ? "mistralai/mistral-7b-instruct:free" : "google/gemini-flash-1.5";
    const fallbackModel = isEnglish ? "google/gemini-flash-1.5" : "mistralai/mistral-7b-instruct:free";
    
    const systemPrompt = `You are an expert social media content strategist. Your task is to generate SEO-optimized content based on a user's prompt.
    The user is targeting:
    - Platform: ${platform}
    - Content Format: ${contentFormat}
    - Region: ${region}
    - Language: ${language}

    Analyze the user's prompt and generate content that is highly relevant, engaging, and likely to trend.
    For each item (tag, hashtag, or title), you MUST provide a "trend_percentage" between 70 and 100.

    Your response MUST be a valid JSON object.
    If the task is 'tags_and_hashtags', the JSON should have two keys: "tags" (an array of objects) and "hashtags" (an array of objects). For platforms other than YouTube, the "tags" array can be empty.
    If the task is 'titles', the JSON should have one key: "titles" (an array of 5 objects).

    Each object in the arrays must have two keys: "text" (the generated content as a string) and "trend_percentage" (a number between 70 and 100).
    Example for 'tags_and_hashtags' task: {"tags": [{"text": "example tag", "trend_percentage": 85}], "hashtags": [{"text": "#exampleHashtag", "trend_percentage": 92}]}
    Example for 'titles' task: {"titles": [{"text": "This is an Example Title", "trend_percentage": 88}]}
    Do NOT include any explanations or markdown formatting. Only the raw JSON object.`;

    let result;
    try {
      result = await callOpenRouter(primaryModel, systemPrompt, prompt);
    } catch (primaryError) {
      console.warn(`Primary model (${primaryModel}) failed: ${primaryError.message}. Trying fallback.`);
      try {
        result = await callOpenRouter(fallbackModel, systemPrompt, prompt);
      } catch (fallbackError) {
        console.error(`Fallback model (${fallbackModel}) also failed: ${fallbackError.message}. Using static fallback.`);
        const fallbackPath = path.join(process.cwd(), 'public', 'data', 'fallback.json');
        const fallbackData = await fs.readFile(fallbackPath, 'utf-8');
        result = JSON.parse(fallbackData);
      }
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
