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
    const { prompt, platform = 'youtube', language = 'english' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Bad Request', message: 'Missing prompt in request body' });
    }

    // **ENHANCED MODEL SELECTION LOGIC**
    let modelsToTry;
    if (language.toLowerCase() === 'english') {
      modelsToTry = ["mistralai/mistral-7b-instruct", "google/gemini-flash-1.5"];
    } else {
      modelsToTry = ["google/gemini-flash-1.5", "mistralai/mistral-7b-instruct"];
    }

    // **NEW DYNAMIC & BULLETPROOF SYSTEM PROMPT**
    let jsonStructureExample;
    let mainInstruction;

    if (platform === 'youtube') {
      mainInstruction = "Provide two JSON arrays: 'tags' (for video metadata) and 'hashtags' (for the description).";
      jsonStructureExample = '{"tags": [{"text": "example tag", "trend": 88}, ...], "hashtags": [{"text": "#exampleHashtag", "trend": 92}, ...]}';
    } else {
      mainInstruction = "Provide a single JSON array: 'hashtags'.";
      jsonStructureExample = '{"hashtags": [{"text": "#exampleHashtag", "trend": 92}, ...]}';
    }

    const systemPrompt = `You are an expert social media SEO strategist. Your response MUST be a single, valid JSON object and nothing else. Do not include any introductory text, explanations, or markdown.
- **Task**: Generate content for a ${platform} post about "${prompt}".
- **Language**: All generated text MUST be in ${language}.
- **Instruction**: ${mainInstruction}
- **Quantity**: Generate between 15 and 20 items for each array.
- **Trend Score**: Each item must have a "trend" key with an integer value between 60 and 100.
- **Format**: Your entire response must be ONLY the JSON object, like this example: ${jsonStructureExample}`;

    let generatedText = null;
    let lastError = null;

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
            response_format: { type: "json_object" } // **CRITICAL**: Force JSON output
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
          console.log(`[AI Success] Model ${model} generated content.`);
          break;
        } else {
          throw new Error(`API response from ${model} was empty.`);
        }
      } catch (error) {
        console.error(`Error with model ${model}:`, error.message);
        lastError = error;
      }
    }

    if (generatedText) {
      // **NEW ROBUST PARSING LOGIC**
      try {
        const parsedData = JSON.parse(generatedText);
        
        const tags = (parsedData.tags || []).filter(t => t && typeof t.text === 'string' && typeof t.trend === 'number');
        const hashtags = (parsedData.hashtags || []).filter(h => h && typeof h.text === 'string' && typeof h.trend === 'number');

        if ((platform === 'youtube' && tags.length > 0) || (platform !== 'youtube' && hashtags.length > 0)) {
            console.log(`[Parsing Success] Parsed ${tags.length} tags and ${hashtags.length} hashtags.`);
            return res.status(200).json({ tags, hashtags, fallback: false });
        } else {
            throw new Error("Parsed JSON was empty or had incorrect structure.");
        }
      } catch (e) {
        console.error("Failed to parse AI JSON response:", e, "Raw Text:", generatedText);
      }
    }
    
    // **IMPROVED FALLBACK LOGIC**
    console.warn("All models failed or parsing failed. Using local JSON fallback.", lastError?.message);
    const fallbackPath = path.join(__dirname, 'fallback.json');
    const fallbackContent = fs.readFileSync(fallbackPath, 'utf-8');
    const fallbackData = JSON.parse(fallbackContent);

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
      message: `Using ${language} sample content due to high demand. Please try again.`
    });

  } catch (error) {
    console.error('Fatal error in generate.js:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred.'
    });
  }
}
