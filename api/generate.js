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
    // Titles: 5-10 items
    let titles = response.titles || [];
    titles = trimAndPadArray(titles, 5, 10, (index) => generateFallbackTitles(1, platform, contentFormat)[0]);
    
    if (platform.toLowerCase() === 'youtube') {
      titles = enforceYouTubeTitleLimits(titles, contentFormat);
    }
    
    processed.titles = titles;
    
  } else if (task === 'tags_and_hashtags') {
    if (platform.toLowerCase() === 'youtube') {
      // YouTube: 15-25 tags and 15-25 hashtags
      let tags = response.tags || [];
      let hashtags = response.hashtags || [];
      
      tags = trimAndPadArray(tags, 15, 25, (index) => generateFallbackTags(1)[0]);
      hashtags = trimAndPadArray(hashtags, 15, 25, (index) => generateFallbackHashtags(1)[0]);
      
      processed.tags = tags;
      processed.hashtags = hashtags;
      
    } else {
      // Instagram/TikTok/Facebook: 15-25 hashtags only
      let hashtags = response.hashtags || [];
      hashtags = trimAndPadArray(hashtags, 15, 25, (index) => generateFallbackHashtags(1)[0]);
      processed.hashtags = hashtags;
    }
  }
  
  return processed;
}

// Helper to validate if response is in correct language
function validateLanguage(response, expectedLanguage) {
  if (expectedLanguage.toLowerCase() === 'english' || expectedLanguage.toLowerCase() === 'en') {
    return true; // Skip validation for English as it's the default
  }
  
  // For non-English languages, be more lenient with validation
  // Many hashtags and content naturally contain English words (brands, tech terms, etc.)
  const responseText = JSON.stringify(response).toLowerCase();
  
  // Simple heuristic: only fail if response is OVERWHELMINGLY English
  const englishPatterns = /\b(the|and|or|but|in|on|at|to|for|of|with|by|this|that|these|those|from|into|about|after|before|during)\b/g;
  const englishMatches = (responseText.match(englishPatterns) || []).length;
  
  // Count total words to get a ratio
  const totalWords = responseText.split(/\s+/).length;
  const englishRatio = totalWords > 0 ? englishMatches / totalWords : 0;
  
  // Only fail if more than 70% of content appears to be English
  // This allows for mixed content, brand names, and international terms
  if (englishRatio > 0.7 && expectedLanguage.toLowerCase() !== 'english') {
    console.warn(`Language validation: ${englishMatches}/${totalWords} English words (${(englishRatio * 100).toFixed(1)}%) for expected language: ${expectedLanguage}`);
    return false;
  }
  
  return true;
}

// Helper to validate if response is on-topic
function validateTopicRelevance(response, userTopic, expectedLanguage = 'english') {
  const responseText = JSON.stringify(response).toLowerCase();
  const topicWords = userTopic.toLowerCase().split(/\W+/).filter(word => word.length > 3);
  
  // For cross-language generation (English topic → non-English content), 
  // skip literal keyword matching as translated content won't contain original words
  if (expectedLanguage.toLowerCase() !== 'english' && expectedLanguage.toLowerCase() !== 'en') {
    console.log(`[Topic Validation] Skipping keyword validation for cross-language generation: ${expectedLanguage}`);
    return true; // Trust the AI model's adherence to the system prompt for non-English
  }
  
  if (topicWords.length === 0) {
    return true; // No meaningful topic words to validate against
  }
  
  // For English content, check if at least some topic keywords appear in the response
  let relevantWords = 0;
  topicWords.forEach(word => {
    if (responseText.includes(word)) {
      relevantWords++;
    }
  });
  
  // Lenient validation for English - require at least 10% word match or minimum 1 word
  // This allows for creative hashtags and synonyms while catching completely off-topic content
  const minRequiredWords = Math.max(1, Math.ceil(topicWords.length * 0.1));
  const isRelevant = relevantWords >= minRequiredWords;
  
  if (!isRelevant) {
    console.warn(`Topic relevance check: Found ${relevantWords}/${topicWords.length} topic words. Topic: "${userTopic}". Needed: ${minRequiredWords}. Language: ${expectedLanguage}`);
  }
  
  return isRelevant;
}

// Helper to call OpenRouter API with timeout and optimization  
// Optimized for fast generation with reduced timeout for better user experience
async function callOpenRouter(model, systemPrompt, userPrompt, timeout = 6000) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.startsWith('YOUR_')) {
    throw new Error('OPENROUTER_API_KEY is not set or is a placeholder.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        response_format: { type: "json_object" },
        max_tokens: 600,
        temperature: 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenRouter API error for model ${model}: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout for model ${model}`);
    }
    throw error;
  }
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

    // Define new high-quality model chain for robust 4-model fallback system
    // Updated with latest fast models for optimal performance and language support
    const modernModels = [
      "google/gemini-2.0-flash-001",           // Primary: Latest Gemini 2.0 Flash - fastest and most capable
      "google/gemini-2.5-flash-lite",          // Secondary: Reliable and fast generation
      "google/gemma-3-27b-it",                 // Tertiary: Excellent multilingual support
      "x-ai/grok-4-fast:free"                  // Quaternary: Free fast model for ultimate fallback
    ];
    
    // Use the same models for both English and non-English for consistency
    // These models support multiple languages effectively
    const modelsToTry = modernModels;
    
    // Create structured user prompt for better topic anchoring
    const structuredPrompt = JSON.stringify({
      userTopic: prompt,
      platform: validatedPlatform,
      contentFormat: validatedContentFormat, 
      targetRegion: validatedRegion,
      language: validatedLanguage,
      task: validatedTask,
      instructions: "Generate content that is STRICTLY about the userTopic. Do NOT create generic trending content unrelated to the specific topic provided."
    });

    const systemPrompt = `You are an expert social media content strategist. Your task is to generate content that is STRICTLY RELEVANT to the user's specific topic.

    CRITICAL TOPIC ADHERENCE:
    - You MUST stay strictly focused on the user's exact topic/keywords provided in userTopic
    - Do NOT generate generic trending content unrelated to the userTopic
    - Do NOT substitute the topic with broader trends unless directly related
    - If you cannot generate relevant content for the userTopic, return {"error": "TOPIC_TOO_BROAD"}

    CRITICAL LANGUAGE REQUIREMENT: 
    - The ENTIRE response, including ALL generated text (tags, hashtags, titles), MUST be in the specified language: "${validatedLanguage}"
    - If language is not English, adapt content to be culturally relevant for that language/region
    - If you cannot generate in the specified language, return {"error": "LANGUAGE_NOT_SUPPORTED"}

    PLATFORM SPECIFICATIONS:
    - Platform: ${validatedPlatform}
    - Content Format: ${validatedContentFormat}
    - Target Region: ${validatedRegion}
    - Language: ${validatedLanguage}
    - Task: ${validatedTask}

    CONTENT REQUIREMENTS:
    - Generate content highly relevant to the userTopic AND trending potential
    - Each item must have "trend_percentage" between 70-100
    - Focus on discoverability for the specified platform and region

    YOUTUBE TITLE RULES:
    - ALL titles MUST be 100 characters or less (strict limit)
    - If contentFormat is 'short' or 'short_video', EVERY title MUST end with " #shorts"
    - Ensure titles remain under 100 characters even with #shorts added

    QUANTITY REQUIREMENTS:
    
    If task is 'titles':
    - Generate 5-10 titles related to userTopic
    - ALL titles must have trend_percentage between 70-100
    - JSON structure: {"titles": [{"text": "Title Here", "trend_percentage": 85}]}
    
    If task is 'tags_and_hashtags':
      For YOUTUBE:
      - Generate 15-25 tags related to userTopic
      - Generate 15-25 hashtags related to userTopic  
      - JSON structure: {"tags": [{"text": "tag name", "trend_percentage": 85}], "hashtags": [{"text": "#hashtag", "trend_percentage": 92}]}
      
      For INSTAGRAM, TIKTOK, or FACEBOOK:
      - Generate 15-25 hashtags related to userTopic
      - JSON structure: {"hashtags": [{"text": "#hashtag", "trend_percentage": 88}]}

    RESPONSE FORMAT:
    - Return ONLY a valid JSON object
    - NO explanations, markdown, or additional text
    - Each item must have "text" and "trend_percentage" keys

    Remember: Stay ON-TOPIC. Generate content specifically about the userTopic, not generic trending content.`;

    let rawResult;
    let lastError = null;

    // Robust 4-model fallback system: model1 → model2 → model3 → model4 → fallback.json
    for (let i = 0; i < modelsToTry.length; i++) {
      const model = modelsToTry[i];
      try {
        console.log(`[API] Attempting model ${i + 1}/4: ${model} for language: ${validatedLanguage}`);
        rawResult = await callOpenRouter(model, systemPrompt, structuredPrompt, 6000); // Optimized timeout for faster response
        
        // Check for API-level errors
        if (rawResult.error) {
          console.warn(`[API] Model ${model} returned error: ${rawResult.error}`);
          lastError = new Error(rawResult.error);
          continue; // Try next model
        }
        
        // Validate language if not English
        if (!validateLanguage(rawResult, validatedLanguage)) {
          console.warn(`[API] Model ${model} failed language validation for: ${validatedLanguage}`);
          lastError = new Error('Language validation failed');
          continue; // Try next model
        }
        
        // Validate topic relevance
        if (!validateTopicRelevance(rawResult, prompt, validatedLanguage)) {
          console.warn(`[API] Model ${model} failed topic relevance validation for language: ${validatedLanguage}`);
          lastError = new Error('Topic relevance validation failed');
          continue; // Try next model
        }
        
        // Process and validate the response structure
        const processedResult = processAndValidateResponse(
          rawResult, 
          validatedTask, 
          validatedPlatform, 
          validatedContentFormat
        );
        
        // Successful processing - return result
        console.log(`[API] SUCCESS: Model ${model} (attempt ${i + 1}/4) succeeded for language: ${validatedLanguage}`);
        res.setHeader('Cache-Control', 'no-cache');
        return res.status(200).json({
          ...processedResult,
          model_used: model,
          generation_source: 'api',
          language: validatedLanguage,
          platform: validatedPlatform,
          region: validatedRegion
        });
        
      } catch (error) {
        console.warn(`[API] Model ${model} (attempt ${i + 1}/4) failed: ${error.message}`);
        lastError = error;
        // Continue to next model
      }
    }

    // All 4 models failed - use comprehensive fallback.json as final backup
    console.error(`[FALLBACK] All 4 models failed for language: ${validatedLanguage}. Last error: ${lastError ? lastError.message : 'Unknown error'}. Using fallback.json as final backup.`);
    
    try {
      // Try to load enhanced fallback.json first
      const fallbackPath = path.join(process.cwd(), 'public', 'data', 'fallback.json');
      const fallbackData = await fs.readFile(fallbackPath, 'utf-8');
      const parsedFallback = JSON.parse(fallbackData);
      
      // Process fallback data according to the request
      let fallbackResponse = {};
      
      if (validatedTask === 'titles') {
        fallbackResponse.titles = parsedFallback.titles || generateFallbackTitles(7, validatedPlatform, validatedContentFormat);
      } else if (validatedTask === 'tags_and_hashtags') {
        if (validatedPlatform.toLowerCase() === 'youtube') {
          fallbackResponse.tags = parsedFallback.tags || generateFallbackTags(20);
          fallbackResponse.hashtags = parsedFallback.hashtags || generateFallbackHashtags(20);
        } else {
          // Instagram/TikTok/Facebook: hashtags only
          fallbackResponse.hashtags = parsedFallback.hashtags || generateFallbackHashtags(20);
        }
      }
      
      // Process through validation system for consistency
      const processedFallback = processAndValidateResponse(
        fallbackResponse, 
        validatedTask, 
        validatedPlatform, 
        validatedContentFormat
      );
      
      console.log(`[FALLBACK] Using fallback.json data successfully`);
      res.setHeader('Cache-Control', 'no-cache');
      return res.status(200).json({
        ...processedFallback,
        generation_source: 'fallback_json',
        message: 'Using reliable fallback data - all AI models temporarily unavailable'
      });
      
    } catch (fallbackError) {
      // If fallback.json fails, generate programmatic fallback
      console.error(`[EMERGENCY] Fallback.json failed: ${fallbackError.message}. Using programmatic fallback.`);
      
      let emergencyResponse = {};
      
      if (validatedTask === 'titles') {
        emergencyResponse.titles = generateFallbackTitles(7, validatedPlatform, validatedContentFormat);
      } else if (validatedTask === 'tags_and_hashtags') {
        if (validatedPlatform.toLowerCase() === 'youtube') {
          emergencyResponse.tags = generateFallbackTags(20);
          emergencyResponse.hashtags = generateFallbackHashtags(20);
        } else {
          emergencyResponse.hashtags = generateFallbackHashtags(20);
        }
      }
      
      const processedEmergency = processAndValidateResponse(
        emergencyResponse, 
        validatedTask, 
        validatedPlatform, 
        validatedContentFormat
      );
      
      res.setHeader('Cache-Control', 'no-cache');
      return res.status(200).json({
        ...processedEmergency,
        generation_source: 'programmatic_fallback',
        message: 'Service temporarily unavailable - using emergency content generation'
      });
    }

  } catch (error) {
    console.error('Critical error in generate handler:', error.message);
    
    // Use our validation system for emergency fallback
    try {
      let emergencyFallback = {};
      const safeTask = task || 'tags_and_hashtags';
      const safePlatform = platform || 'youtube';
      const safeContentFormat = contentFormat || 'long_video';
      
      if (safeTask === 'titles') {
        emergencyFallback.titles = generateFallbackTitles(7, safePlatform, safeContentFormat);
      } else {
        if (safePlatform.toLowerCase() === 'youtube') {
          emergencyFallback.tags = generateFallbackTags(20);
          emergencyFallback.hashtags = generateFallbackHashtags(20);
        } else {
          emergencyFallback.hashtags = generateFallbackHashtags(20);
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
