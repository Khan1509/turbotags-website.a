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

  try {
    const model = "google/gemini-flash-1.5"; // This model is fast and good for creative generation.
    const result = await callOpenRouter(model, systemPrompt, `Generate trending topics for today, ${new Date().toDateString()}.`);
    
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400, max-age=3600'); // Cache for 24 hours, refresh every hour
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error fetching dynamic trending topics:', error.message);
    // If API fails, serve the static fallback file
    try {
      const fallbackPath = path.join(process.cwd(), 'public', 'data', 'fallback-trending.json');
      const data = await fs.readFile(fallbackPath, 'utf-8');
      return res.status(200).json(JSON.parse(data));
    } catch (fallbackError) {
      console.error('Error reading trending topics fallback:', fallbackError);
      return res.status(500).json({ error: 'Failed to load trending topics from both API and fallback.' });
    }
  }
}
