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
      "mistralai/mistral-7b-instruct-v0.2",
      "google/gemini-flash-1.5",
      "anthropic/claude-3-haiku",
      "huggingfaceh4/zephyr-7b-beta"
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
          const errorData = await response.json();
          throw new Error(`API error with ${model}: ${response.status} ${response.statusText} - ${errorData.error || 'Unknown error'}`);
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
      const fallbackResponse = await fetch('/fallback.json');
      if (!fallbackResponse.ok) {
        throw new Error(`Failed to load fallback.json: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
      }
      const fallbackData = await fallbackResponse.json();
      return res.status(200).json({
        text: fallbackData.defaultResponse || "No content could be generated."
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