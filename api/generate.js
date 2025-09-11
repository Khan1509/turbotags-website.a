import { promises as fs } from 'fs';
import path from 'path';

// Validation and processing functions
function validateAndFixTrendPercentage(item) {
  if (!item.trend_percentage || typeof item.trend_percentage !== 'number') {
    item.trend_percentage = Math.floor(Math.random() * 31) + 70; // 70-100
  } else {
    item.trend_percentage = Math.max(70, Math.min(100, item.trend_percentage));
  }
  return item;
}

function enforceYouTubeTitleLimits(titles, contentFormat) {
  return titles.map(title => {
    let text = title.text || '';
    
    // Handle #shorts for YouTube short videos
    const isShortVideo = contentFormat === 'short' || contentFormat === 'short_video';
    const needsShorts = isShortVideo && !text.includes('#shorts');
    
    if (needsShorts) {
      // Add #shorts but ensure total length is under 100 chars
      const shortsTag = ' #shorts';
      if (text.length + shortsTag.length > 100) {
        text = text.substring(0, 100 - shortsTag.length).trim();
      }
      text += shortsTag;
    } else if (text.length > 100) {
      // Truncate to 100 characters
      text = text.substring(0, 100).trim();
    }
    
    return { ...title, text: text };
  });
}

function trimAndPadArray(array, minCount, maxCount, fallbackGenerator) {
  if (!Array.isArray(array)) {
    array = [];
  }
  
  // Remove invalid items
  array = array.filter(item => item && item.text && typeof item.text === 'string');
  
  // Validate and fix trend percentages
  array = array.map(validateAndFixTrendPercentage);
  
  // Trim to maxCount if too many
  if (array.length > maxCount) {
    array = array.slice(0, maxCount);
  }
  
  // Pad to minCount if too few
  while (array.length < minCount) {
    const fallbackItem = fallbackGenerator(array.length);
    array.push(validateAndFixTrendPercentage(fallbackItem));
  }
  
  return array;
}

function generateFallbackTitles(count, platform, contentFormat) {
  const fallbackTitles = [
    "Amazing Content You Need to See",
    "Incredible Results in Minutes",
    "The Ultimate Guide You've Been Waiting For",
    "Mind-Blowing Tips That Actually Work",
    "Secret Techniques Revealed",
    "Everything You Need to Know",
    "Life-Changing Methods Exposed"
  ];
  
  const titles = [];
  for (let i = 0; i < count; i++) {
    let text = fallbackTitles[i % fallbackTitles.length];
    
    // Add variation
    if (i >= fallbackTitles.length) {
      text = `${text} (Part ${Math.floor(i / fallbackTitles.length) + 1})`;
    }
    
    titles.push({ text, trend_percentage: Math.floor(Math.random() * 31) + 70 });
  }
  
  // Apply YouTube title limits if needed
  if (platform.toLowerCase() === 'youtube') {
    return enforceYouTubeTitleLimits(titles, contentFormat);
  }
  
  return titles;
}

function generateFallbackTags(count) {
  const fallbackTags = [
    "trending", "viral", "popular", "amazing", "incredible", "awesome", "best",
    "top", "ultimate", "perfect", "stunning", "fantastic", "brilliant", "excellent",
    "outstanding", "remarkable", "extraordinary", "magnificent", "wonderful", "superb"
  ];
  
  const tags = [];
  for (let i = 0; i < count; i++) {
    const baseTag = fallbackTags[i % fallbackTags.length];
    const text = i >= fallbackTags.length ? `${baseTag}${Math.floor(i / fallbackTags.length) + 1}` : baseTag;
    tags.push({ text, trend_percentage: Math.floor(Math.random() * 31) + 70 });
  }
  
  return tags;
}

function generateFallbackHashtags(count) {
  const fallbackHashtags = [
    "#trending", "#viral", "#popular", "#amazing", "#incredible", "#awesome", "#best",
    "#top", "#ultimate", "#perfect", "#stunning", "#fantastic", "#brilliant", "#excellent",
    "#outstanding", "#remarkable", "#extraordinary", "#magnificent", "#wonderful", "#superb"
  ];
  
  const hashtags = [];
  for (let i = 0; i < count; i++) {
    const baseHashtag = fallbackHashtags[i % fallbackHashtags.length];
    const text = i >= fallbackHashtags.length ? `${baseHashtag}${Math.floor(i / fallbackHashtags.length) + 1}` : baseHashtag;
    hashtags.push({ text, trend_percentage: Math.floor(Math.random() * 31) + 70 });
  }
  
  return hashtags;
}

function processAndValidateResponse(response, task, platform, contentFormat) {
  const processed = {};
  
  if (task === 'titles') {
    // Titles: 5-7 items
    let titles = response.titles || [];
    titles = trimAndPadArray(titles, 5, 7, (index) => generateFallbackTitles(1, platform, contentFormat)[0]);
    
    if (platform.toLowerCase() === 'youtube') {
      titles = enforceYouTubeTitleLimits(titles, contentFormat);
    }
    
    processed.titles = titles;
    
  } else if (task === 'tags_and_hashtags') {
    if (platform.toLowerCase() === 'youtube') {
      // YouTube: 15-20 tags and 15-20 hashtags
      let tags = response.tags || [];
      let hashtags = response.hashtags || [];
      
      tags = trimAndPadArray(tags, 15, 20, (index) => generateFallbackTags(1)[0]);
      hashtags = trimAndPadArray(hashtags, 15, 20, (index) => generateFallbackHashtags(1)[0]);
      
      processed.tags = tags;
      processed.hashtags = hashtags;
      
    } else {
      // Instagram/TikTok/Facebook: 15-20 hashtags only
      let hashtags = response.hashtags || [];
      hashtags = trimAndPadArray(hashtags, 15, 20, (index) => generateFallbackHashtags(1)[0]);
      processed.hashtags = hashtags;
    }
  }
  
  return processed;
}

// Helper to call OpenRouter API
async function callOpenRouter(model, systemPrompt, userPrompt) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.startsWith('YOUR_')) {
    throw new Error('OPENROUTER_API_KEY is not set or is a placeholder.');
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error for model ${model}: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// Main handler function for Vercel
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, platform, contentFormat, region, language, task } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Validate prompt length (max 1000 words)
    if (prompt.length > 7000) { // Roughly 1000 words
      return res.status(400).json({ error: 'Prompt too long. Maximum 1000 words allowed.' });
    }

    // Add input validation with defaults
    const validatedLanguage = language || 'english';
    const validatedPlatform = platform || 'youtube';
    const validatedContentFormat = contentFormat || 'long_video';
    const validatedRegion = region || 'global';
    const validatedTask = task || 'tags_and_hashtags';

    const isEnglish = validatedLanguage.toLowerCase() === 'english' || validatedLanguage.toLowerCase() === 'en';

    // Define model chains for reliability based on language
    const englishModels = [
      "mistralai/mistral-7b-instruct",
      "google/gemini-flash-1.5",
      "anthropic/claude-3-haiku",
      "meta-llama/llama-3.1-8b-instruct"
    ];
    const nonEnglishModels = [
      "google/gemini-flash-1.5", // Primary for non-English
      "mistralai/mistral-7b-instruct",
      "meta-llama/llama-3.1-8b-instruct",
      "anthropic/claude-3-haiku"
    ];
    const modelsToTry = isEnglish ? englishModels : nonEnglishModels;
    
    const systemPrompt = `You are an expert social media content strategist and trend analyst. Your task is to generate highly optimized, trending content based on the user's prompt.

    TARGET SPECIFICATIONS:
    - Platform: ${validatedPlatform}
    - Content Format: ${validatedContentFormat}
    - Target Region: ${validatedRegion}
    - Language: ${validatedLanguage}
    - Task: ${validatedTask}
    - User Topic/Prompt: Will be provided separately

    CRITICAL LANGUAGE REQUIREMENT: 
    The ENTIRE response, including ALL generated text (tags, hashtags, titles), MUST be in the specified language: "${validatedLanguage}". 
    If the language is not English, adapt the content to be culturally relevant and linguistically natural for that language and region.

    CONTENT QUALITY REQUIREMENTS:
    - Generate content that is highly relevant, engaging, and trending in ${new Date().getFullYear()}.
    - Consider current trends, viral topics, and platform-specific best practices.
    - Each item must have a "trend_percentage" between 70 and 100 based on its realistic trending potential.
    - Focus on high-engagement, discoverable content for the "${validatedRegion}" region.

    PLATFORM-SPECIFIC RULES:

    YOUTUBE TITLE RULES:
    - ALL titles MUST be 100 characters or less (strict limit).
    - If contentFormat is 'short' or 'short_video', EVERY title MUST end with " #shorts" (including the space before #).
    - Ensure titles remain under 100 characters even with #shorts added.

    QUANTITY REQUIREMENTS (STRICT):
    
    If the task is 'titles':
    - Generate 5-7 titles for optimal variety and quality.
    - ALL titles must have trend_percentage between 70-100.
    - For YouTube: titles max 100 characters (including #shorts if applicable).
    - JSON structure: {"titles": [{"text": "Title Here", "trend_percentage": 85}]}
    
    If the task is 'tags_and_hashtags':
      For YOUTUBE:
      - Generate 15-20 tags for optimal coverage.
      - Generate 15-20 hashtags for optimal coverage.
      - ALL items must have trend_percentage between 70-100.
      - JSON structure: {"tags": [{"text": "tag name", "trend_percentage": 85}], "hashtags": [{"text": "#hashtag", "trend_percentage": 92}]}
      
      For INSTAGRAM, TIKTOK, or FACEBOOK:
      - Generate 15-20 hashtags for optimal coverage.
      - ALL hashtags must have trend_percentage between 70-100.
      - JSON structure: {"hashtags": [{"text": "#hashtag", "trend_percentage": 88}]}

    RESPONSE FORMAT:
    - Return ONLY a valid JSON object.
    - NO explanations, markdown, or additional text.
    - Each item must have "text" and "trend_percentage" keys.

    Remember: Quality over quantity, but meet the minimum requirements. Focus on trending, discoverable content for ${validatedPlatform} in ${validatedRegion}.`;

    let rawResult;
    let lastError = null;
    let validationAttempts = 0;
    const maxValidationAttempts = 2;

    // Try LLM models with retry logic for validation failures
    for (const model of modelsToTry) {
      for (let attempt = 0; attempt <= maxValidationAttempts; attempt++) {
        try {
          rawResult = await callOpenRouter(model, systemPrompt, prompt);
          
          // Always process and validate the response
          const processedResult = processAndValidateResponse(
            rawResult, 
            validatedTask, 
            validatedPlatform, 
            validatedContentFormat
          );
          
          // Successful processing - return result
          res.setHeader('Cache-Control', 'no-cache');
          return res.status(200).json(processedResult);
          
        } catch (error) {
          console.warn(`Model ${model} attempt ${attempt + 1} failed: ${error.message}`);
          lastError = error;
          
          // If this was the last attempt for this model, try next model
          if (attempt === maxValidationAttempts) {
            break;
          }
          
          // Add slight delay before retry
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }

    // All models failed - generate fallback response using our validation system
    console.error(`All models failed. Last error: ${lastError ? lastError.message : 'Unknown error'}. Generating validated fallback.`);
    
    let fallbackResponse = {};
    
    if (validatedTask === 'titles') {
      fallbackResponse.titles = generateFallbackTitles(6, validatedPlatform, validatedContentFormat); // Middle of 5-7 range
    } else if (validatedTask === 'tags_and_hashtags') {
      if (validatedPlatform.toLowerCase() === 'youtube') {
        fallbackResponse.tags = generateFallbackTags(18); // Middle of 15-20 range
        fallbackResponse.hashtags = generateFallbackHashtags(18);
      } else {
        fallbackResponse.hashtags = generateFallbackHashtags(18);
      }
    }
    
    // Process the fallback through our validation system for consistency
    const processedFallback = processAndValidateResponse(
      fallbackResponse, 
      validatedTask, 
      validatedPlatform, 
      validatedContentFormat
    );
    
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(200).json(processedFallback);

  } catch (error) {
    console.error('Critical error in generate handler:', error.message);
    
    // Use our validation system for emergency fallback
    try {
      let emergencyFallback = {};
      const safeTask = task || 'tags_and_hashtags';
      const safePlatform = platform || 'youtube';
      const safeContentFormat = contentFormat || 'long_video';
      
      if (safeTask === 'titles') {
        emergencyFallback.titles = generateFallbackTitles(6, safePlatform, safeContentFormat);
      } else {
        if (safePlatform.toLowerCase() === 'youtube') {
          emergencyFallback.tags = generateFallbackTags(18);
          emergencyFallback.hashtags = generateFallbackHashtags(18);
        } else {
          emergencyFallback.hashtags = generateFallbackHashtags(18);
        }
      }
      
      const processedEmergency = processAndValidateResponse(
        emergencyFallback, 
        safeTask, 
        safePlatform, 
        safeContentFormat
      );
      
      return res.status(500).json({
        ...processedEmergency,
        error: 'Service temporarily unavailable, using fallback content',
        fallback: true
      });
    } catch (fallbackError) {
      return res.status(500).json({ 
        error: 'Service unavailable', 
        fallback: true,
        titles: [{ text: "Content unavailable", trend_percentage: 70 }]
      });
    }
  }
}
