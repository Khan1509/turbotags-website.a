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
    console.warn('API unavailable, using fallback data:', networkError.message);
    
    // For non-English languages, skip English-only fallback.json to maintain language consistency
    const language = options.language || 'english';
    if (language.toLowerCase() !== 'english' && language.toLowerCase() !== 'en') {
      console.warn(`Skipping English-only fallback for ${language} request - API models unavailable`);
      throw new Error(`Service unavailable for ${language} - API models temporarily down`);
    }
    
    // Fallback to local JSON data when API is unavailable (English only)
    try {
      const fallbackResponse = await fetch('/data/fallback.json');
      const fallbackData = await fallbackResponse.json();
      
      if (task === 'titles') {
        return { titles: fallbackData.titles, fallback: true };
      } else if (task === 'tags_and_hashtags') {
        const platform = options.platform || 'youtube';
        if (platform.toLowerCase() === 'youtube') {
          return { 
            tags: fallbackData.tags, 
            hashtags: fallbackData.hashtags,
            fallback: true 
          };
        } else {
          return { hashtags: fallbackData.hashtags, fallback: true };
        }
      }
      
      return fallbackData;
    } catch (fallbackError) {
      console.error('Fallback data also failed to load:', fallbackError);
      throw new Error('Service unavailable and fallback data could not be loaded.');
    }
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
    console.warn('Trending API unavailable, using fallback data:', networkError.message);
    
    // Fallback to local JSON data when API is unavailable
    try {
      const fallbackResponse = await fetch('/data/fallback-trending.json');
      return await fallbackResponse.json();
    } catch (fallbackError) {
      console.error('Fallback trending data also failed to load:', fallbackError);
      throw new Error('Trending topics service unavailable and fallback data could not be loaded.');
    }
  }
};
