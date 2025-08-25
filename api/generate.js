import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are supported'
    });
  }

  try {
    const { prompt, platform = 'youtube', language = 'english', region = 'global', contentFormat = 'general' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing prompt in request body'
      });
    }

    console.log(`API Request - Platform: ${platform}, Language: ${language}, Region: ${region}, Format: ${contentFormat}`);

    // **CRITICAL FIX**: Dynamically select model priority based on language.
    // Gemini is prioritized for non-English languages for better multilingual support.
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
        "google/gemini-flash-1.5", // Gemini first for non-English
        "mistralai/mistral-7b-instruct", // Mistral as backup
        "meta-llama/llama-3-8b-instruct",
        "anthropic/claude-3-haiku"
      ];
    }

    let generatedText = null;
    let lastError = null;

    const systemPrompt = `You are an expert social media strategist. Your task is to generate SEO-optimized tags and hashtags for a content creator.
- Generate EXACTLY 15-20 items per category.
- Adhere strictly to the requested language.
- For YouTube, provide two lists: 'TAGS' (plain keywords) and 'HASHTAGS' (with #).
- For all other platforms, provide only one list of 'HASHTAGS'.
- Output format for YouTube: TAGS:[tag1,tag2,...]HASHTAGS:[#hashtag1,#hashtag2,...]
- Output format for others: #hashtag1,#hashtag2,...
- Do NOT include any extra text, explanations, or formatting.`;

    const userPrompt = `Platform: ${platform}\nLanguage: ${language}\nRegion: ${region}\nContent Format: ${contentFormat}\nTopic: "${prompt}"`;

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
          break; // Exit loop on success
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
        const tags = (langData.tags || fallbackData.youtube.plain_tags).slice(0, 20);
        const hashtags = (langData.hashtags || fallbackData.youtube.hashtags).slice(0, 20);
        fallbackText = `TAGS:[${tags.join(',')}]HASHTAGS:[${hashtags.join(',')}]`;
      } else {
        const platformKey = `${platform}_hashtags`;
        const hashtags = (fallbackData[platformKey] || langData.hashtags || fallbackData.youtube.hashtags).slice(0, 20);
        fallbackText = hashtags.join(', ');
      }

      return res.status(200).json({
        text: fallbackText,
        fallback: true,
        message: `Using ${language} fallback content due to API unavailability.`
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
