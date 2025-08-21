import fs from 'node:fs';
import path from 'node:path';

export default async function handler(req, res) {
  // Immediately set JSON content-type
  res.setHeader('Content-Type', 'application/json');

  // Block non-POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are supported'
    });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing prompt in request body'
      });
    }

    // Define the list of models to try in order of preference
    const modelsToTry = [
      "mistralai/mistral-7b-instruct",
      "meta-llama/llama-3-8b-instruct",
      "google/gemini-flash-1.5",
      "anthropic/claude-3-haiku"
    ];

    let generatedText = null;
    let lastError = null;

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
            messages: [{ role: "user", content: prompt }]
          })
        });

        if (!response.ok) {
          const errorData = await response.text(); // Use .text() for better error details
          throw new Error(`API error with ${model}: ${response.status} ${response.statusText} - ${errorData}`);
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
          generatedText = data.choices[0].message.content;
          console.log(`Successfully generated content with model: ${model}`);
          break; // Exit loop if successful
        } else {
          throw new Error(`API response from ${model} missing content or unexpected structure.`);
        }
      } catch (error) {
        console.error(`Error with model ${model}:`, error.message);
        lastError = error; // Store the last error
      }
    }

    if (generatedText) {
      return res.status(200).json({
        text: generatedText
      });
    } else {
      // If all models fail, fall back to the local JSON file
      console.warn("All OpenRouter models failed. Falling back to local fallback.json.");
      const fallbackPath = path.resolve(process.cwd(), 'api', 'fallback.json');
      const fallbackContent = fs.readFileSync(fallbackPath, 'utf-8');
      const fallbackData = JSON.parse(fallbackContent);
      
      const defaultResponse = "No content could be generated.";
      
      let fallbackText = defaultResponse;
      if (prompt.toLowerCase().includes('youtube')) {
        fallbackText = [...fallbackData.youtube.plain_tags, ...fallbackData.youtube.hashtags].join(', ');
      } else if (prompt.toLowerCase().includes('instagram')) {
        fallbackText = fallbackData.instagram_hashtags.join(', ');
      } else if (prompt.toLowerCase().includes('tiktok')) {
        fallbackText = fallbackData.tiktok_hashtags.join(', ');
      } else {
        fallbackText = fallbackData.youtube.plain_tags.join(', ');
      }
      
      return res.status(200).json({
        text: fallbackText || defaultResponse
      });
    }

  } catch (error) {
    console.error('Final error in generate.js:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred during content generation.'
    });
  }
}
