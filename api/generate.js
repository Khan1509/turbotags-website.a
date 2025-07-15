// api/generate.js
// This Vercel Serverless Function handles AI content generation.
// It attempts to use Mistral via OpenRouter first,
// then falls back to Google Gemini 1.5 Flash via OpenRouter,
// and finally provides a hardcoded JSON fallback if all APIs fail.

// No direct GoogleGenerativeAI import needed as all calls go through OpenRouter.

export default async function handler(req, res) {
    // Ensure the request method is POST for security and proper handling.
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are accepted for AI generation.' });
    }

    const { prompt } = req.body; // Extract the prompt from the request body.

    // Validate if the prompt is provided.
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        return res.status(400).json({ error: 'Bad Request', message: 'A valid prompt is required for AI generation.' });
    }

    // --- API Key from Vercel Environment Variables ---
    // The OpenRouter API key is now the primary key for all external LLM calls.
    // This key MUST be set in your Vercel project settings.
    // Go to Project Settings -> Environment Variables.
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    // Hardcoded fallback data in case all API calls fail.
    const fallbackData = {
        text: "Could not generate content from AI services. Here is some fallback data: tag1, tag2, tag3, #hashtag1, #hashtag2, #hashtag3. Please try again later."
    };

    let generatedText = null;
    let apiUsed = 'none';
    let errorDetails = {};

    // Check if OpenRouter API key is available
    if (!openRouterApiKey) {
        console.warn("OPENROUTER_API_KEY is not set. Skipping all OpenRouter API calls.");
        errorDetails.openrouter = "API key not configured for OpenRouter.";
        // Proceed directly to fallback if no OpenRouter key
        return res.status(200).json({
            text: fallbackData.text,
            apiUsed: 'fallback-json',
            warning: "AI generation failed. Using fallback data because OpenRouter API key is missing. Check server logs for details.",
            errors: errorDetails
        });
    }

    // --- Attempt 1: Mistral via OpenRouter ---
    try {
        console.log("Attempting AI generation via OpenRouter (Mistral)...");
        const openRouterMistralResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterApiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "mistralai/mistral-7b-instruct-v0.2", // Specific Mistral model
                "messages": [
                    { "role": "user", "content": prompt }
                ]
            })
        });

        if (!openRouterMistralResponse.ok) {
            const errorBody = await openRouterMistralResponse.json();
            throw new Error(`OpenRouter (Mistral) API error: ${openRouterMistralResponse.status} ${openRouterMistralResponse.statusText} - ${errorBody.message || JSON.stringify(errorBody)}`);
        }

        const openRouterMistralResult = await openRouterMistralResponse.json();
        if (openRouterMistralResult.choices && openRouterMistralResult.choices.length > 0 && openRouterMistralResult.choices[0].message) {
            generatedText = openRouterMistralResult.choices[0].message.content;
            apiUsed = 'openrouter-mistral';
            console.log("OpenRouter (Mistral) API call successful.");
        } else {
            throw new Error("OpenRouter (Mistral) response missing expected content.");
        }
    } catch (error) {
        console.error('Error from OpenRouter (Mistral) API:', error);
        errorDetails.openrouter_mistral = error.message;
    }

    // --- Attempt 2: Google Gemini 1.5 Flash via OpenRouter (if Mistral failed) ---
    if (!generatedText) {
        try {
            console.log("Mistral via OpenRouter failed. Attempting AI generation via OpenRouter (Gemini 1.5 Flash)...");
            const openRouterGeminiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${openRouterApiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "google/gemini-1.5-flash", // Specify Gemini 1.5 Flash model through OpenRouter
                    "messages": [
                        { "role": "user", "content": prompt }
                    ]
                })
            });

            if (!openRouterGeminiResponse.ok) {
                const errorBody = await openRouterGeminiResponse.json();
                throw new Error(`OpenRouter (Gemini) API error: ${openRouterGeminiResponse.status} ${openRouterGeminiResponse.statusText} - ${errorBody.message || JSON.stringify(errorBody)}`);
            }

            const openRouterGeminiResult = await openRouterGeminiResponse.json();
            if (openRouterGeminiResult.choices && openRouterGeminiResult.choices.length > 0 && openRouterGeminiResult.choices[0].message) {
                generatedText = openRouterGeminiResult.choices[0].message.content;
                apiUsed = 'openrouter-gemini-flash';
                console.log("OpenRouter (Gemini 1.5 Flash) API call successful.");
            } else {
                throw new Error("OpenRouter (Gemini) response missing expected content.");
            }
        } catch (error) {
            console.error('Error from OpenRouter (Gemini 1.5 Flash) API:', error);
            errorDetails.openrouter_gemini = error.message;
        }
    }

    // --- Final Fallback: Hardcoded JSON ---
    if (!generatedText) {
        console.warn("Both OpenRouter (Mistral) and OpenRouter (Gemini) APIs failed. Using hardcoded fallback data.");
        generatedText = fallbackData.text;
        apiUsed = 'fallback-json';
        return res.status(200).json({
            text: generatedText,
            apiUsed: apiUsed,
            warning: "AI generation failed. Using fallback data. Check server logs for details.",
            errors: errorDetails
        });
    }

    // Send successful response
    res.status(200).json({
        text: generatedText,
        apiUsed: apiUsed
    });
}
