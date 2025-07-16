// api/generate.js
// This Vercel Serverless Function acts as a proxy to OpenRouter,
// implementing a failover mechanism: Primary (Mistral 7B Instruct), Fallback (Gemini Flash).

export default async function handler(req, res) {
    console.log("[Serverless Function Log]: Request received for OpenRouter with failover logic.");

    // Only allow POST requests
    if (req.method !== 'POST') {
        console.warn(`[Serverless Function Log]: Method Not Allowed: ${req.method}`);
        return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are supported.' });
    }

    // Get the OpenRouter API key from Vercel environment variables
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
        console.error("[Serverless Function Log]: OPENROUTER_API_KEY environment variable is not set.");
        return res.status(500).json({ error: 'Server Configuration Error', message: 'OpenRouter API key not configured on the server.' });
    } else {
        console.log("[Serverless Function Log]: OPENROUTER_API_KEY is set.");
    }

    // Extract the prompt from the request body
    const { prompt } = req.body;

    if (!prompt) {
        console.error("[Serverless Function Log]: Missing prompt in request body.");
        return res.status(400).json({ error: 'Bad Request', message: 'Missing prompt in request body.' });
    } else {
        console.log(`[Serverless Function Log]: Received prompt: "${prompt.substring(0, 100)}..."`); // Log first 100 chars
    }

    const openRouterApiUrl = "https://openrouter.ai/api/v1/chat/completions";
    let generatedText = '';
    let usedModel = 'none';

    try {
        // --- Attempt PRIMARY Model: mistralai/mistral-7b-instruct-v0.2 ---
        try {
            console.log("[Serverless Function Log]: Attempting primary model: mistralai/mistral-7b-instruct-v0.2");
            const primaryPayload = {
                model: "mistralai/mistral-7b-instruct-v0.2",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 150, // Max tokens for the generated response
                temperature: 0.7, // Controls randomness of the output
            };

            const primaryResponse = await fetch(openRouterApiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(primaryPayload)
            });

            if (!primaryResponse.ok) {
                const errorData = await primaryResponse.json();
                console.warn(`[Serverless Function Log]: Primary model (Mistral) failed: ${primaryResponse.status} - ${JSON.stringify(errorData)}`);
                // Throw to move to the fallback logic
                throw new Error(`Primary model (Mistral) failed with status ${primaryResponse.status}`);
            }

            const primaryResult = await primaryResponse.json();
            if (primaryResult.choices && primaryResult.choices.length > 0 && primaryResult.choices[0].message) {
                generatedText = primaryResult.choices[0].message.content;
                usedModel = 'mistralai/mistral-7b-instruct-v0.2';
                console.log("[Serverless Function Log]: Successfully generated text with primary model (Mistral).");
            } else {
                console.warn('[Serverless Function Log]: Primary model (Mistral) response unexpected structure.');
                throw new Error('Primary model (Mistral) returned unexpected structure.');
            }

        } catch (primaryError) {
            console.error(`[Serverless Function Log]: Primary model (Mistral) error: ${primaryError.message}. Attempting fallback to Gemini Flash.`);

            // --- Attempt FALLBACK Model: google/gemini-flash-1.5 ---
            try {
                const fallbackPayload = {
                    model: "google/gemini-flash-1.5", // Your fallback model
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 150, // Max tokens for the generated response
                    temperature: 0.7, // Controls randomness of the output
                };
                const fallbackResponse = await fetch(openRouterApiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(fallbackPayload)
                });

                if (!fallbackResponse.ok) {
                    const errorData = await fallbackResponse.json();
                    console.error(`[Serverless Function Log]: Fallback model (Gemini Flash) also failed: ${fallbackResponse.status} - ${JSON.stringify(errorData)}`);
                    throw new Error(`Fallback model (Gemini Flash) failed with status ${fallbackResponse.status}`);
                }

                const fallbackResult = await fallbackResponse.json();
                if (fallbackResult.choices && fallbackResult.choices.length > 0 && fallbackResult.choices[0].message) {
                    generatedText = fallbackResult.choices[0].message.content;
                    usedModel = 'google/gemini-flash-1.5';
                    console.log("[Serverless Function Log]: Successfully generated text with fallback model (Gemini Flash).");
                } else {
                    console.warn('[Serverless Function Log]: Fallback model (Gemini Flash) response unexpected structure.');
                    throw new Error('Fallback model (Gemini Flash) returned unexpected structure.');
                }

            } catch (fallbackError) {
                console.error(`[Serverless Function Log]: Both primary and fallback models failed: ${fallbackError.message}`);
                // If both fail, re-throw the error to be caught by the outer catch block
                throw fallbackError;
            }
        }

        // If we reached here, at least one model successfully generated text
        return res.status(200).json({ text: generatedText, modelUsed: usedModel });

    } catch (error) {
        // This catches errors from both primary and fallback attempts
        console.error('[Serverless Function Log]: Final serverless function error:', error.message, error.stack);
        // Provide a generic error message to the client if both models fail
        return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to generate content after multiple attempts.' });
    }
}
