import { promises as fs } from 'fs';
import path from 'path';

async function callOpenRouter(model, systemPrompt) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'YOUR_API_KEY') {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables.');
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
        { role: "system", content: systemPrompt }
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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const systemPrompt = `You are an expert social media trend analyst with real-time knowledge of global trends. Your task is to identify 5 current, highly relevant trending topic ideas for each of the following platforms: YouTube, Instagram, TikTok, and Facebook.

  CRITICAL REQUIREMENTS:
  - Topics must be CURRENT and trending in ${new Date().getFullYear()}
  - Focus on viral, engaging content that's gaining traction RIGHT NOW
  - Consider global events, pop culture, technology trends, and seasonal relevance
  - Topics should be actionable for content creators
  - Ensure diversity across different content categories (tech, lifestyle, entertainment, education, etc.)

  PLATFORM CONSIDERATIONS:
  - YouTube: Focus on searchable, long-form content potential and trending topics
  - Instagram: Visual-first content, lifestyle trends, and hashtag-worthy topics  
  - TikTok: Viral challenges, quick tips, trending sounds, and micro-content ideas
  - Facebook: Community engagement, longer-form discussions, and shareable content

  Your response MUST be a valid JSON object with this exact structure:
  {
    "trendingTopics": [
      {
        "platform": "YouTube",
        "topics": [
          {
            "title": "Trending Topic Title",
            "description": "A compelling one-sentence description of why this topic is trending and engaging."
          }
        ]
      }
    ]
  }

  Generate exactly 5 topics per platform. Do NOT include any explanations or markdown formatting. Only return the raw JSON object.`;

  // Multiple models for better reliability and fresh content
  const modelsToTry = [
    "google/gemini-flash-1.5", // Best for current trends
    "mistralai/mistral-7b-instruct", 
    "meta-llama/llama-3.1-8b-instruct",
    "anthropic/claude-3-haiku"
  ];

  let result;
  let lastError = null;

  // Try multiple models for more reliable trending content
  for (const model of modelsToTry) {
    try {
      result = await callOpenRouter(model, systemPrompt);
      lastError = null;
      break;
    } catch (error) {
      console.warn(`Model ${model} failed for trending topics: ${error.message}. Trying next model.`);
      lastError = error;
    }
  }

  if (result) {
    // Cache for 24 hours (86400 seconds) with stale-while-revalidate for better performance
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
    return res.status(200).json(result);
  }

  // If all models failed, fall back to static content
  console.error(`All models failed for trending topics. Last error: ${lastError?.message}. Using static fallback.`);
  
  try {
      const fallbackPath = path.join(process.cwd(), 'public', 'data', 'fallback-trending.json');
      const fallbackData = await fs.readFile(fallbackPath, 'utf-8');
      const fallbackJson = JSON.parse(fallbackData);
      
      // Don't cache fallback responses to encourage API retry
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).json({ 
        ...fallbackJson, 
        fallback: true, 
        message: 'AI services are currently unavailable. Using sample trending topics.' 
      });
  } catch (fallbackReadError) {
      console.error('CRITICAL: Could not read trending topics fallback file:', fallbackReadError.message);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(500).json({ 
          trendingTopics: [], 
          fallback: true,
          error: 'An unexpected error occurred and the fallback file could not be read.' 
      });
  }
}
