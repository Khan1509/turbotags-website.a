// api/generate.js
// This Vercel Serverless Function handles AI content generation.
// It attempts to use Mistral via OpenRouter first,
// then falls back to Google Gemini 1.5 Flash,
// and finally provides a hardcoded JSON fallback if all APIs fail.

// Import necessary libraries.
// For OpenRouter, we'll use a standard fetch.
// For Gemini, we'll use the official @google/generative-ai SDK.
import { GoogleGenerativeAI } from '@google/generative-ai';

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

    // --- API Keys from Vercel Environment Variables ---
    // These keys MUST be set in your Vercel project settings.
    // Go to Project Settings -> Environment Variables.
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    // Hardcoded fallback data in case all API calls fail.
    const fallbackData = {
        text: "Could not generate content from AI services. Here is some fallback data: tag1, tag2, tag3, #hashtag1, #hashtag2, #hashtag3. Please try again later."
    };

    let generatedText = null;
    let apiUsed = 'none';
    let errorDetails = {};

    // --- Attempt 1: Mistral via OpenRouter ---
    if (openRouterApiKey) {
        try {
            console.log("Attempting AI generation via OpenRouter (Mistral)...");
            const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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

            if (!openRouterResponse.ok) {
                const errorBody = await openRouterResponse.json();
                throw new Error(`OpenRouter API error: ${openRouterResponse.status} ${openRouterResponse.statusText} - ${errorBody.message || JSON.stringify(errorBody)}`);
            }

            const openRouterResult = await openRouterResponse.json();
            if (openRouterResult.choices && openRouterResult.choices.length > 0 && openRouterResult.choices[0].message) {
                generatedText = openRouterResult.choices[0].message.content;
                apiUsed = 'openrouter-mistral';
                console.log("OpenRouter (Mistral) API call successful.");
            } else {
                throw new Error("OpenRouter response missing expected content.");
            }
        } catch (error) {
            console.error('Error from OpenRouter (Mistral) API:', error);
            errorDetails.openrouter = error.message;
        }
    } else {
        console.warn("OPENROUTER_API_KEY is not set. Skipping OpenRouter (Mistral) API call.");
        errorDetails.openrouter = "API key not configured.";
    }

    // --- Attempt 2: Google Gemini 1.5 Flash (if Mistral failed or key missing) ---
    if (!generatedText && geminiApiKey) {
        try {
            console.log("OpenRouter failed or key missing. Attempting AI generation via Google Gemini 1.5 Flash...");
            const genAI = new GoogleGenerativeAI(geminiApiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            if (text) {
                generatedText = text;
                apiUsed = 'gemini-1.5-flash';
                console.log("Google Gemini 1.5 Flash API call successful.");
            } else {
                throw new Error("Gemini API response missing text.");
            }
        } catch (error) {
            console.error('Error from Google Gemini 1.5 Flash API:', error);
            errorDetails.gemini = error.message;
        }
    } else if (!geminiApiKey) {
        console.warn("GEMINI_API_KEY is not set. Skipping Google Gemini API call.");
        errorDetails.gemini = "API key not configured.";
    }

    // --- Final Fallback: Hardcoded JSON ---
    if (!generatedText) {
        console.warn("Both OpenRouter and Gemini APIs failed or keys missing. Using hardcoded fallback data.");
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
