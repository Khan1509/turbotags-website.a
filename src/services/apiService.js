/**
 * Calls the backend API to generate tags and hashtags with enhanced parameters.
 * @param {string} prompt - The prompt to send to the AI model.
 * @param {Object} options - Additional generation options.
 * @param {string} options.platform - Platform (youtube, instagram, tiktok, facebook).
 * @param {string} options.contentFormat - Content format (long-form, short, reel, etc.).
 * @param {string} options.region - Target region (global, usa, uk, etc.).
 * @param {string} options.language - Content language (english, spanish, etc.).
 * @returns {Promise<string>} The generated text from the API.
 * @throws {Error} If the network response is not ok.
 */
export const generateContent = async (prompt, options = {}) => {
  const requestBody = {
    prompt,
    platform: options.platform || 'youtube',
    contentFormat: options.contentFormat || 'long-form',
    region: options.region || 'global',
    language: options.language || 'english',
    version: '2.1.0' // API versioning for future compatibility
  };

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Version': '2.1.0',
      'Accept': 'application/json'
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
    console.error('API Error:', errorBody);
    throw new Error(errorBody.message || 'Network response was not ok.');
  }

  const data = await response.json();
  return data.text;
};
