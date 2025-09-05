import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get a fallback niche based on keywords
const getFallbackNiche = (prompt, niches) => {
  const lowerCasePrompt = prompt.toLowerCase();
  for (const nicheKey in niches) {
    if (nicheKey !== 'default' && lowerCasePrompt.includes(nicheKey.split('_')[0])) {
      console.log(`[Fallback] Niche found: ${nicheKey}`);
      return niches[nicheKey];
    }
  }
  console.log('[Fallback] No specific niche found, using default.');
  return niches.default;
};

export default async function handler(req, res) {
  console.log('[API/Generate] Handler called on Vercel:', !!process.env.VERCEL);
  console.log('[API/Generate] Request method:', req.method);
  console.log('[API/Generate] API Key present:', !!process.env.OPENROUTER_API_KEY);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, platform = 'youtube', language = 'english', contentFormat = 'default', region = 'global', task = 'tags_and_hashtags' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Bad Request', message: 'Missing prompt in request body' });
    }

    let modelsToTry;
    if (language.toLowerCase() === 'english') {
      // For English: Mistral first, then Gemini Flash as fallback
      modelsToTry = ["mistralai/mistral-7b-instruct", "google/gemini-flash-1.5", "anthropic/claude-3-haiku", "meta-llama/llama-3.1-8b-instruct"];
    } else {
      // For other languages: Gemini Flash first (better multilingual), then other models
      modelsToTry = ["google/gemini-flash-1.5", "anthropic/claude-3-haiku", "mistralai/mistral-7b-instruct", "meta-llama/llama-3.1-8b-instruct"];
    }

    let systemPrompt;
    let jsonStructureExample;
    let mainInstruction;

    if (task === 'titles') {
      mainInstruction = "Provide a single JSON array: 'titles'. Each title object must include a 'text' (string) and a 'trend_percentage' (integer between 70 and 100).";
      jsonStructureExample = '{"titles": [{"text": "Example Title 1 #shorts", "trend_percentage": 85}, {"text": "Example Title 2", "trend_percentage": 91}]}';
      // SEO: Enhanced prompt for better titles with strict language rule and trend analysis
      systemPrompt = `You are a world-class social media copywriter and SEO strategist with deep knowledge of ${platform} trends and ${region} audience preferences. Your response MUST be a single, valid JSON object and nothing else. Do not include any introductory text, explanations, or markdown.
- **Task**: Generate 5 highly engaging, SEO-optimized, and click-worthy titles for a ${platform} post.
- **Topic**: "${prompt}"
- **Content Format**: Optimize specifically for a "${contentFormat}" format.
- **Target Region**: Focus on trends popular in "${region}" and adapt cultural nuances.
- **Platform**: Consider ${platform} algorithm preferences and user behavior patterns.
- **CRITICAL LANGUAGE RULE**: All generated text MUST be exclusively in the specified language: **${language}**. Do NOT use English or any other language unless it is the one specified. This is the most important rule.
- **Instruction**: ${mainInstruction}
- **Trend Analysis**: Each title must have a trend_percentage between 70-100 based on current viral potential, regional relevance, and platform-specific trending factors.
- **SEO Goal**: Titles should be emotionally engaging (using curiosity, urgency, or value) while being clear, descriptive, and keyword-rich for ${platform}.
- **Constraint for YouTube**: If the platform is 'youtube', titles MUST be 100 characters or less.
- **Constraint for YouTube Shorts**: If the platform is 'youtube' and content format is 'short', the title text MUST end with the hashtag '#shorts'.
- **Format**: Your entire response must be ONLY the JSON object, like this example: ${jsonStructureExample}`;
    } else { // Default to tags_and_hashtags
      if (platform === 'youtube') {
        mainInstruction = "Provide two JSON arrays: 'tags' (for video metadata) and 'hashtags' (for the description).";
        jsonStructureExample = '{"tags": [{"text": "example tag", "trend_percentage": 88}], "hashtags": [{"text": "#exampleHashtag", "trend_percentage": 92}]}';
      } else {
        mainInstruction = "Provide a single JSON array: 'hashtags'.";
        jsonStructureExample = '{"hashtags": [{"text": "#exampleHashtag", "trend_percentage": 92}]}';
      }
      // SEO: Enhanced prompt for better tags/hashtags with strict language rule and comprehensive trend analysis
      systemPrompt = `You are a world-class social media SEO strategist with expertise in ${platform} algorithm optimization and ${region} market trends. Your response MUST be a single, valid JSON object and nothing else. Do not include any introductory text, explanations, or markdown.
- **Task**: Generate highly relevant and engaging content for a ${platform} post based on current trends and platform-specific optimization.
- **Topic**: "${prompt}"
- **Content Format**: Optimize specifically for a "${contentFormat}" format on ${platform}.
- **Target Region**: Focus on trends popular in "${region}" and adapt to local search behaviors and cultural preferences.
- **Platform Analysis**: Consider ${platform}-specific algorithm preferences, user engagement patterns, and content discovery mechanisms.
- **CRITICAL LANGUAGE RULE**: All generated text MUST be exclusively in the specified language: **${language}**. Do NOT use English or any other language unless it is the one specified. This is the most important rule.
- **Instruction**: ${mainInstruction}
- **SEO Strategy**: Ensure a balanced mix of:
  1. High-traffic, broad keywords with strong search volume
  2. Specific, long-tail keywords for niche targeting
  3. Trending keywords specific to ${region} and ${platform}
  4. Content format-specific optimization keywords
- **Quantity**: Generate between 15 and 20 items for each array (max 25).
- **Trend Analysis**: Each item must have a "trend_percentage" key with an integer value between 70 and 100, representing:
  - Current viral potential on ${platform}
  - Regional relevance in ${region}  
  - Content format alignment with "${contentFormat}"
  - Real-time trending status and growth potential
- **Format**: Your entire response must be ONLY the JSON object, like this example: ${jsonStructureExample}`;
    }

    let generatedText = null;
    let lastError = null;

    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'YOUR_API_KEY' || process.env.OPENROUTER_API_KEY === 'API_KEY_ADDED') {
      console.warn('[AI Generate] OPENROUTER_API_KEY is missing or a placeholder. Skipping AI fetch and using fallback.');
      lastError = new Error('API key not configured in .env file.');
    } else {
      for (const model of modelsToTry) {
        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: model,
              messages: [{ role: "system", content: systemPrompt }],
              temperature: 0.7,
              max_tokens: 2048,
              response_format: { type: "json_object" }
            })
          });

          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`API error with ${model}: ${response.status} - ${errorData}`);
          }

          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;

          if (content && content.trim()) {
            generatedText = content.trim();
            console.log(`[AI Success] Model ${model} generated content for task: ${task}.`);
            break;
          } else {
            throw new Error(`API response from ${model} was empty.`);
          }
        } catch (error) {
          console.error(`Error with model ${model}:`, error.message);
          lastError = error;
        }
      }
    }

    if (generatedText) {
      try {
        const parsedData = JSON.parse(generatedText);
        if (task === 'titles') {
          const titles = (parsedData.titles || []).filter(t => t && typeof t.text === 'string' && typeof t.trend_percentage === 'number');
          if (titles.length > 0) {
            console.log(`[Parsing Success] Parsed ${titles.length} titles.`);
            return res.status(200).json({ titles, fallback: false });
          }
        } else {
          const tags = (parsedData.tags || []).filter(t => t && typeof t.text === 'string' && typeof t.trend_percentage === 'number');
          const hashtags = (parsedData.hashtags || []).filter(h => h && typeof h.text === 'string' && typeof h.trend_percentage === 'number');
          if ((platform === 'youtube' && tags.length > 0) || (platform !== 'youtube' && hashtags.length > 0)) {
            console.log(`[Parsing Success] Parsed ${tags.length} tags and ${hashtags.length} hashtags.`);
            return res.status(200).json({ tags, hashtags, fallback: false });
          }
        }
        throw new Error("Parsed JSON was empty or had incorrect structure.");
      } catch (e) {
        console.error("Failed to parse AI JSON response:", e, "Raw Text:", generatedText);
      }
    }
    
    console.warn(`AI generation for task '${task}' did not succeed. Using local JSON fallback.`, lastError?.message);
    const fallbackPath = path.join(__dirname, 'fallback.json');
    const fallbackContent = fs.readFileSync(fallbackPath, 'utf-8');
    const fallbackData = JSON.parse(fallbackContent);

    if (task === 'titles') {
      const nicheData = getFallbackNiche(prompt, fallbackData[platform]?.niches || fallbackData.youtube.niches);
      const fallbackTitles = (nicheData.titles || fallbackData.youtube.niches.default.titles).slice(0, 5);
      return res.status(200).json({
        titles: fallbackTitles,
        fallback: true,
        message: `Using sample titles. To enable live AI generation, please add your OpenRouter API key to the .env file.`
      });
    } else {
      let fallbackTags = [];
      let fallbackHashtags = [];
      const langData = fallbackData.multilingual[language.toLowerCase()] || fallbackData.multilingual['english'];

      if (platform === 'youtube') {
        const nicheData = getFallbackNiche(prompt, fallbackData.youtube.niches);
        fallbackTags = (nicheData.tags || langData.tags).slice(0, 25);
        fallbackHashtags = (nicheData.hashtags || langData.hashtags).slice(0, 25);
      } else {
        const platformNiches = fallbackData[platform]?.niches;
        if (platformNiches) {
          const nicheData = getFallbackNiche(prompt, platformNiches);
          fallbackHashtags = (nicheData.hashtags || langData.hashtags).slice(0, 25);
        } else {
          fallbackHashtags = (langData.hashtags || []).slice(0, 25);
        }
      }
      return res.status(200).json({
        tags: fallbackTags,
        hashtags: fallbackHashtags,
        fallback: true,
        message: `Using sample content. To enable live AI generation, please add your OpenRouter API key to the .env file.`
      });
    }

  } catch (error) {
    console.error('Fatal error in generate.js:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred.'
    });
  }
}
