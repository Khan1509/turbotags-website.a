import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are supported'
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

    console.log(`API Request - Platform: ${platform}, Language: ${language}`);

    // **CRITICAL FIX**: Dynamically select model priority based on language.
    // Mistral is prioritized for English, Gemini for all other languages.
    let modelsToTry;
    if (language.toLowerCase() === 'english') {
      console.log('Language is English, prioritizing Mistral.');
      modelsToTry = [
        "mistralai/mistral-7b-instruct",
        "google/gemini-flash-1.5",
        "meta-llama/llama-3-8b-instruct",
        "anthropic/claude-3-haiku"
      ];
    } else {
      console.log(`Language is ${language}, prioritizing Gemini for multilingual generation.`);
      modelsToTry = [
        "google/gemini-flash-1.5",
        "mistralai/mistral-7b-instruct",
        "meta-llama/llama-3-8b-instruct",
        "anthropic/claude-3-haiku"
      ];
    }

    let generatedText = null;
    let lastError = null;

    // **ENHANCED SYSTEM PROMPT**
    const systemPrompt = `You are a world-class social media strategist and SEO expert. Your task is to generate highly relevant, trending, and SEO-optimized tags and hashtags for a content creator.
- **Quantity**: Generate EXACTLY 15-20 items per category. You can generate up to a maximum of 25 if they are highly relevant and add significant value.
- **Quality**: The generated items must be trending and relevant to the user's topic. Mix popular (high volume) and niche (high intent) terms.
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
        console.log(`Attempting to generate content with model: ${model}`);

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
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
          console.log(`Successfully generated content with model: ${model}`);
          break;
        } else {
          throw new Error(`API response from ${model} was empty or malformed.`);
        }
      } catch (error) {
        console.error(`Error with model ${model}:`, error.message);
        lastError = error;
      }
    }

    if (generatedText) {
      return res.status(200).json({
        text: generatedText
      });
    } else {
      console.warn("All OpenRouter models failed. Falling back to local JSON.", lastError?.message);
      const fallbackPath = path.join(__dirname, 'fallback.json');
      const fallbackContent = fs.readFileSync(fallbackPath, 'utf-8');
      const fallbackData = JSON.parse(fallbackContent);

      let fallbackText = "";
      const langData = fallbackData.multilingual[language] || fallbackData.multilingual['english'];

      if (platform === 'youtube') {
        const niches = fallbackData.youtube.niches;
        const randomNicheKey = Object.keys(niches)[Math.floor(Math.random() * Object.keys(niches).length)];
        const nicheData = niches[randomNicheKey];

        const tags = (langData.tags || nicheData.tags).slice(0, 25);
        const hashtags = (langData.hashtags || nicheData.hashtags).slice(0, 25);
        fallbackText = `TAGS:[${tags.join(',')}]HASHTAGS:[${hashtags.join(',')}]`;
      } else {
        const platformNiches = fallbackData[platform]?.niches;
        if (platformNiches) {
            const randomNicheKey = Object.keys(platformNiches)[Math.floor(Math.random() * Object.keys(platformNiches).length)];
            const nicheData = platformNiches[randomNicheKey];
            const hashtags = nicheData.hashtags.slice(0, 25);
            fallbackText = hashtags.join(', ');
        } else {
            // Default fallback if platform structure is missing
            const hashtags = (langData.hashtags || fallbackData.youtube.niches.default.hashtags).slice(0, 25);
            fallbackText = hashtags.join(', ');
        }
      }

      return res.status(200).json({
        text: fallbackText,
        fallback: true,
        message: `Using ${language} sample content due to high demand. Please try again shortly.`
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
