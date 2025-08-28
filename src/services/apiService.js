/**
 * Calls the backend API to generate tags and hashtags with enhanced parameters.
 * @param {string} prompt - The prompt to send to the AI model.
 * @param {Object} options - Additional generation options.
 * @param {string} options.platform - Platform (youtube, instagram, tiktok, facebook).
 * @param {string} options.contentFormat - Content format (long-form, short, reel, etc.).
 * @param {string} options.region - Target region (global, usa, uk, etc.).
 * @param {string} options.language - Content language (english, spanish, etc.).
 * @returns {Promise<object>} The generated content from the API as a structured object: { tags: [], hashtags: [], fallback: boolean, message?: string }.
 * @throws {Error} If the network response is not ok.
 */
export const generateContent = async (prompt, options = {}) => {
  const requestBody = {
    prompt,
    platform: options.platform || 'youtube',
    contentFormat: options.contentFormat || 'long-form',
    region: options.region || 'global',
    language: options.language || 'english',
    version: '2.2.0' // API versioning for future compatibility
  };

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Version': '2.2.0',
      'Accept': 'application/json'
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
    console.error('API Error:', errorBody);
    throw new Error(errorBody.message || 'Network response was not ok.');
  }

  return await response.json();
};

/**
 * Fetches the latest trending topics from the backend API.
 * @returns {Promise<object>} The trending topics data.
 * @throws {Error} If the network response is not ok.
 */
export const getTrendingTopics = async () => {
  const response = await fetch('/api/trending', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
    console.error('Trending Topics API Error:', errorBody);
    throw new Error(errorBody.message || 'Failed to fetch trending topics.');
  }

  return await response.json();
};
