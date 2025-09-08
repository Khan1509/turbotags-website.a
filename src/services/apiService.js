/**
 * Calls the backend API to generate tags and hashtags with enhanced parameters.
 * @param {string} prompt - The prompt to send to the AI model.
 * @param {Object} options - Additional generation options.
 * @param {string} options.platform - Platform (youtube, instagram, tiktok, facebook).
 * @param {string} options.contentFormat - Content format (long-form, short, reel, etc.).
 * @param {string} options.region - Target region (global, usa, uk, etc.).
 * @param {string} options.language - Content language (english, spanish, etc.).
 * @param {string} task - The type of content to generate ('tags_and_hashtags' or 'titles').
 * @returns {Promise<object>} The generated content from the API as a structured object.
 * @throws {Error} If the network response is not ok.
 */
export const generateContent = async (prompt, options = {}, task) => {
  const requestBody = {
    prompt,
    platform: options.platform || 'youtube',
    contentFormat: options.contentFormat || 'long-form',
    region: options.region || 'global',
    language: options.language || 'english',
    task: task || 'tags_and_hashtags',
  };

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  } catch (networkError) {
    if (networkError.name === 'TypeError' || networkError.message.includes('fetch')) {
      console.error('Network connection failed:', networkError);
      throw new Error('Network connection failed. Please check your internet connection.');
    }
    throw networkError; // Re-throw other errors
  }
};

/**
 * Fetches the latest trending topics from the backend API.
 * @returns {Promise<object>} The trending topics data.
 * @throws {Error} If the network response is not ok.
 */
export const getTrendingTopics = async () => {
  try {
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
  } catch (networkError) {
    if (networkError.name === 'TypeError' || networkError.message.includes('fetch')) {
      console.error('Network connection failed:', networkError);
      throw new Error('Network connection failed. Please check your internet connection.');
    }
    throw networkError; // Re-throw other errors
  }
};
