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
    if (lowerCasePrompt.includes(nicheKey.split('_')[0])) {
      console.log(`Fallback niche found: ${nicheKey}`);
      return niches[nicheKey];
    }
  }
  console.log('No specific fallback niche found, using default.');
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
    return res.status(405).json({
      error: 'Method Not Allowed'
    });
  }

  try {
    const { prompt, platform = 'youtube', language = 'english' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing prompt in request body'
      });
    }

    let modelsToTry;
    if (language.toLowerCase() === 'english') {
      modelsToTry = ["mistralai/mistral-7b-instruct", "google/gemini-flash-1.5", "meta-llama/llama-3-8b-instruct"];
    } else {
      modelsToTry = ["google/gemini-flash-1.5", "mistralai/mistral-7b-instruct", "meta-llama/llama-3-8b-instruct"];
    }

    let generatedText = null;
    let lastError = null;

    const systemPrompt = `You are a world-class social media strategist and SEO expert. Your task is to generate highly relevant, trending, and SEO-optimized tags and hashtags for a content creator.
- **Quantity**: Generate EXACTLY 15-20 items per category. You can generate up to a maximum of 25 if they are highly relevant.
- **Language**: Adhere strictly to the requested language: ${language}.
- **Formatting**:
  - For YouTube: Provide two lists in this exact format: TAGS:[tag1,tag2,...]HASHTAGS:[#hashtag1,#hashtag2,...]
  - For all other platforms: Provide a single comma-separated list of hashtags: #hashtag1,#hashtag2,...
- **Rules**:
  - Do NOT include any extra text, explanations, apologies, or formatting.
  - Tags are plain keywords (e.g., 'cooking tips').
  - Hashtags must start with a '#' (e.g., '#CookingTips').
  - Do not use markdown or code blocks.`;

    const userPrompt = `Platform: ${platform}\nTopic: "${prompt}"`;

    for (const model of modelsToTry) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
            temperature: 0.7,
            max_tokens: 1000
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`API error with ${model}: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (content && content.trim()) {
          generatedText = content;
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
      // **ROBUST PARSING LOGIC MOVED TO BACKEND**
      let tags = [];
      let hashtags = [];

      if (platform === 'youtube') {
        const tagsMatch = generatedText.match(/TAGS\s*:\s*\[(.*?)]/is);
        if (tagsMatch && tagsMatch[1]) {
          tags = tagsMatch[1].split(',').map(t => t.trim().replace(/^["'\[\]#]+|["'\[\]#]+$/g, '')).filter(Boolean);
        }

        const hashtagsMatch = generatedText.match(/HASHTAGS\s*:\s*\[(.*?)]/is);
        if (hashtagsMatch && hashtagsMatch[1]) {
          hashtags = hashtagsMatch[1].split(',').map(h => {
            const cleaned = h.trim().replace(/^["'\[\]]+|["'\[\]]+$/g, '');
            return cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
          }).filter(Boolean);
        }
      } else {
        hashtags = generatedText.split(',').map(h => {
          const cleaned = h.trim().replace(/^["'\[\]]+|["'\[\]]+$/g, '');
          return cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
        }).filter(Boolean);
      }

      // Final check to ensure we have some data if parsing was weird
      if (platform === 'youtube' && tags.length === 0 && hashtags.length === 0 && generatedText.length > 5) {
          hashtags = generatedText.split(',').map(h => {
            const cleaned = h.trim().replace(/^["'\[\]]+|["'\[\]]+$/g, '');
            return cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
          }).filter(Boolean);
      }
      
      if (tags.length === 0 && hashtags.length === 0) {
        console.warn("AI response was generated but parsing failed. Falling back.", { generatedText });
        // Fall through to the main fallback logic
      } else {
        // **SEND CLEAN JSON TO FRONTEND**
        return res.status(200).json({ tags, hashtags, fallback: false });
      }
    }
    
    // **IMPROVED FALLBACK LOGIC**
    console.warn("All models failed or parsing failed. Using local JSON fallback.", lastError?.message);
    const fallbackPath = path.join(__dirname, 'fallback.json');
    const fallbackContent = fs.readFileSync(fallbackPath, 'utf-8');
    const fallbackData = JSON.parse(fallbackContent);

    let fallbackTags = [];
    let fallbackHashtags = [];
    const langData = fallbackData.multilingual[language] || fallbackData.multilingual['english'];

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
        fallbackHashtags = (langData.hashtags).slice(0, 25);
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
