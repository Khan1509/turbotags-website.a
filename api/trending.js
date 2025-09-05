import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

// Use /tmp for Vercel serverless functions, fallback to os.tmpdir() for local dev
const CACHE_FILE = process.env.VERCEL ? '/tmp/trending_cache.json' : path.join(os.tmpdir(), 'trending_cache.json');
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

const fallbackTopics = {
  "topics": [
    {
      "platform": "YouTube",
      "icon": "Youtube",
      "color": "text-red-500",
      "topics": [
        { "title": "AI Tools Explained", "description": "Deep dives into new AI tools and their impact on productivity." },
        { "title": "Sustainable Living Hacks", "description": "Videos on eco-friendly habits and zero-waste lifestyles." },
        { "title": "Retro Gaming Revival", "description": "Long-form documentaries on classic video games and consoles." }
      ]
    },
    {
      "platform": "Instagram",
      "icon": "Instagram",
      "color": "text-pink-500",
      "topics": [
        { "title": "'Day in the Life' Reels", "description": "Authentic, less-polished glimpses into daily routines." },
        { "title": "30-Second Recipes", "description": "Quick, visually appealing cooking tutorials for Reels." },
        { "title": "Thrift-Flipping Fashion", "description": "Transforming second-hand clothes into trendy outfits." }
      ]
    },
    {
      "platform": "TikTok",
      "icon": "TikTokIcon",
      "color": "text-black",
      "topics": [
        { "title": "Niche History Facts", "description": "Quick, surprising facts about obscure historical events." },
        { "title": "'CoreCore' Aesthetic Edits", "description": "Artistic, abstract video collages with a specific mood." },
        { "title": "Hyper-Local 'Hidden Gems'", "description": "Showcasing unique spots in your city or neighborhood." }
      ]
    },
    {
      "platform": "Global Film & TV",
      "icon": "Globe",
      "color": "text-blue-500",
      "topics": [
        { "title": "New Streaming Series Theories", "description": "Breakdowns and predictions for popular new shows." },
        { "title": "Comparing Book vs. Adaptation", "description": "Analyzing the differences between novels and their screen versions." },
        { "title": "Hidden Meanings in Movie Endings", "description": "Explainer videos on complex or ambiguous film conclusions." }
      ]
    }
  ]
};

async function getFreshTopics() {
  // **FIX**: Check for valid API key before attempting to fetch
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'YOUR_API_KEY' || process.env.OPENROUTER_API_KEY === 'API_KEY_ADDED') {
    console.warn('[API/Trending] OPENROUTER_API_KEY is missing or a placeholder. Using fallback topics.');
    return fallbackTopics;
  }

  console.log('[API/Trending] Fetching fresh topics from AI...');
  const systemPrompt = `You are an expert social media trend analyst with real-time knowledge of global content trends. Generate current, actionable trending content ideas for content creators.

- **Task**: Create a JSON object with key "topics" containing 4 platform objects.
- **Platforms**: YouTube, Instagram, TikTok, and "Global Film & TV"
- **Structure**: Each platform object must have:
  - "platform" (string): Platform name
  - "icon" (string): Icon name (Youtube, Instagram, TikTokIcon, Globe)  
  - "color" (string): Tailwind color class (text-red-500, text-pink-500, text-black, text-blue-500)
  - "topics" (array): 4-5 trending topic objects, each with:
    - "title" (string): Specific, actionable trending topic
    - "description" (string): Brief description of why it's trending and how to create content

- **Content Guidelines**:
  - Focus on current viral trends and emerging content formats
  - Include platform-specific optimizations (YouTube Shorts, Instagram Reels, TikTok trends)
  - Topics should be globally relevant but include region-specific trends
  - Provide actionable insights for content creators
  - Each topic should have viral potential and be timely

- **Format**: Your entire response must be ONLY the valid JSON object. No explanatory text.

Example structure: {"topics": [{"platform": "YouTube", "icon": "Youtube", "color": "text-red-500", "topics": [{"title": "AI Tools Explained", "description": "Deep dives into new AI tools and their impact on productivity."}]}]}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "google/gemini-flash-1.5",
        messages: [{ role: "system", content: systemPrompt }],
        temperature: 0.8,
        max_tokens: 2048,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsedContent = JSON.parse(content);

    // Validate the AI response structure
    if (!parsedContent.topics || parsedContent.topics.length < 4) {
      throw new Error("AI response has invalid structure.");
    }
    
    // Ensure each platform has the required fields and 4-5 topics
    for (const platform of parsedContent.topics) {
      if (!platform.platform || !platform.icon || !platform.color || !platform.topics || platform.topics.length < 3) {
        throw new Error("AI response missing required platform fields or insufficient topics.");
      }
    }
    
    console.log('[API/Trending] Successfully fetched fresh topics.');
    return parsedContent;

  } catch (error) {
    console.error('[API/Trending] Failed to fetch fresh topics from AI:', error);
    return fallbackTopics; // Return fallback on error
  }
}

export default async function handler(req, res) {
  console.log('[API/Trending] Handler called on Vercel:', !!process.env.VERCEL);
  console.log('[API/Trending] Request method:', req.method);
  console.log('[API/Trending] API Key present:', !!process.env.OPENROUTER_API_KEY);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    console.log('[API/Trending] Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const cachedData = await fs.readFile(CACHE_FILE, 'utf-8').catch(() => null);

    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION_MS) {
        console.log('[API/Trending] Serving from cache.');
        return res.status(200).json(data);
      }
    }

    console.log('[API/Trending] Cache stale or not found. Fetching new data.');
    const freshData = await getFreshTopics();
    const cachePayload = JSON.stringify({ timestamp: Date.now(), data: freshData });
    await fs.writeFile(CACHE_FILE, cachePayload, 'utf-8');
    
    return res.status(200).json(freshData);

  } catch (error) {
    console.error('Fatal error in trending.js:', error);
    return res.status(500).json(fallbackTopics); // Serve fallback on any catastrophic failure
  }
}
