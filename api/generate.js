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

function generateFallbackTitles(count, platform, contentFormat, language = 'english') {
  // Multilingual fallback titles
  const titlesByLanguage = {
    english: [
      "Amazing Content You Need to See",
      "Incredible Results in Minutes", 
      "The Ultimate Guide You've Been Waiting For",
      "Mind-Blowing Tips That Actually Work",
      "Secret Techniques Revealed",
      "Everything You Need to Know",
      "Life-Changing Methods Exposed"
    ],
    spanish: [
      "Contenido Increíble Que Necesitas Ver",
      "Resultados Increíbles en Minutos",
      "La Guía Definitiva Que Has Estado Esperando", 
      "Consejos Alucinantes Que Realmente Funcionan",
      "Técnicas Secretas Reveladas",
      "Todo Lo Que Necesitas Saber",
      "Métodos Que Cambiarán Tu Vida"
    ],
    french: [
      "Contenu Incroyable Que Vous Devez Voir",
      "Résultats Incroyables en Minutes",
      "Le Guide Ultime Que Vous Attendiez",
      "Conseils Époustouflants Qui Marchent Vraiment",
      "Techniques Secrètes Révélées", 
      "Tout Ce Que Vous Devez Savoir",
      "Méthodes Qui Vont Changer Votre Vie"
    ],
    german: [
      "Erstaunlicher Inhalt Den Sie Sehen Müssen",
      "Unglaubliche Ergebnisse in Minuten",
      "Der Ultimative Guide Auf Den Sie Gewartet Haben",
      "Umwerfende Tipps Die Wirklich Funktionieren", 
      "Geheime Techniken Enthüllt",
      "Alles Was Sie Wissen Müssen",
      "Lebensverändernde Methoden Aufgedeckt"
    ],
    portuguese: [
      "Conteúdo Incrível Que Você Precisa Ver",
      "Resultados Incríveis em Minutos",
      "O Guia Definitivo Que Você Estava Esperando",
      "Dicas Fantásticas Que Realmente Funcionam",
      "Técnicas Secretas Reveladas",
      "Tudo Que Você Precisa Saber", 
      "Métodos Que Vão Mudar Sua Vida"
    ]
  };
  
  const languageKey = language.toLowerCase();
  const fallbackTitles = titlesByLanguage[languageKey] || titlesByLanguage.english;
  
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

function generateFallbackTags(count, language = 'english') {
  // Multilingual fallback tags
  const tagsByLanguage = {
    english: [
      "trending", "viral", "popular", "amazing", "incredible", "awesome", "best",
      "top", "ultimate", "perfect", "stunning", "fantastic", "brilliant", "excellent",
      "outstanding", "remarkable", "extraordinary", "magnificent", "wonderful", "superb"
    ],
    spanish: [
      "tendencia", "viral", "popular", "increíble", "fantástico", "genial", "mejor",
      "top", "definitivo", "perfecto", "impresionante", "fantástico", "brillante", "excelente",
      "sobresaliente", "notable", "extraordinario", "magnífico", "maravilloso", "estupendo"
    ],
    french: [
      "tendance", "viral", "populaire", "incroyable", "fantastique", "génial", "meilleur", 
      "top", "ultime", "parfait", "magnifique", "fantastique", "brillant", "excellent",
      "exceptionnel", "remarquable", "extraordinaire", "magnifique", "merveilleux", "superbe"
    ],
    german: [
      "trending", "viral", "beliebt", "erstaunlich", "unglaublich", "großartig", "beste",
      "top", "ultimativ", "perfekt", "atemberaubend", "fantastisch", "brillant", "ausgezeichnet", 
      "herausragend", "bemerkenswert", "außergewöhnlich", "prächtig", "wunderbar", "hervorragend"
    ],
    portuguese: [
      "tendência", "viral", "popular", "incrível", "fantástico", "incrível", "melhor",
      "top", "definitivo", "perfeito", "deslumbrante", "fantástico", "brilhante", "excelente",
      "excepcional", "notável", "extraordinário", "magnífico", "maravilhoso", "excelente"
    ]
  };
  
  const languageKey = language.toLowerCase();
  const fallbackTags = tagsByLanguage[languageKey] || tagsByLanguage.english;
  
  const tags = [];
  for (let i = 0; i < count; i++) {
    const baseTag = fallbackTags[i % fallbackTags.length];
    const text = i >= fallbackTags.length ? `${baseTag}${Math.floor(i / fallbackTags.length) + 1}` : baseTag;
    tags.push({ text, trend_percentage: Math.floor(Math.random() * 31) + 70 });
  }
  
  return tags;
}

function generateFallbackHashtags(count, language = 'english') {
  // Multilingual fallback hashtags
  const hashtagsByLanguage = {
    english: [
      "#trending", "#viral", "#popular", "#amazing", "#incredible", "#awesome", "#best",
      "#top", "#ultimate", "#perfect", "#stunning", "#fantastic", "#brilliant", "#excellent",
      "#outstanding", "#remarkable", "#extraordinary", "#magnificent", "#wonderful", "#superb"
    ],
    spanish: [
      "#tendencia", "#viral", "#popular", "#increíble", "#fantástico", "#genial", "#mejor",
      "#top", "#definitivo", "#perfecto", "#impresionante", "#fantástico", "#brillante", "#excelente",
      "#sobresaliente", "#notable", "#extraordinario", "#magnífico", "#maravilloso", "#estupendo"
    ],
    french: [
      "#tendance", "#viral", "#populaire", "#incroyable", "#fantastique", "#génial", "#meilleur",
      "#top", "#ultime", "#parfait", "#magnifique", "#fantastique", "#brillant", "#excellent", 
      "#exceptionnel", "#remarquable", "#extraordinaire", "#magnifique", "#merveilleux", "#superbe"
    ],
    german: [
      "#trending", "#viral", "#beliebt", "#erstaunlich", "#unglaublich", "#großartig", "#beste",
      "#top", "#ultimativ", "#perfekt", "#atemberaubend", "#fantastisch", "#brillant", "#ausgezeichnet",
      "#herausragend", "#bemerkenswert", "#außergewöhnlich", "#prächtig", "#wunderbar", "#hervorragend"
    ],
    portuguese: [
      "#tendência", "#viral", "#popular", "#incrível", "#fantástico", "#incrível", "#melhor",
      "#top", "#definitivo", "#perfeito", "#deslumbrante", "#fantástico", "#brilhante", "#excelente",
      "#excepcional", "#notável", "#extraordinário", "#magnífico", "#maravilhoso", "#excelente"
    ]
  };
  
  const languageKey = language.toLowerCase();
  const fallbackHashtags = hashtagsByLanguage[languageKey] || hashtagsByLanguage.english;
  
  const hashtags = [];
  for (let i = 0; i < count; i++) {
    const baseHashtag = fallbackHashtags[i % fallbackHashtags.length];
    const text = i >= fallbackHashtags.length ? `${baseHashtag}${Math.floor(i / fallbackHashtags.length) + 1}` : baseHashtag;
    hashtags.push({ text, trend_percentage: Math.floor(Math.random() * 31) + 70 });
  }
  
  return hashtags;
}

function processAndValidateResponse(response, task, platform, contentFormat, language = 'english') {
  const processed = {};
  
  if (task === 'titles') {
    // Titles: 5-10 items
    let titles = response.titles || [];
    titles = trimAndPadArray(titles, 5, 10, (index) => generateFallbackTitles(1, platform, contentFormat, language)[0]);
    
    if (platform.toLowerCase() === 'youtube') {
      titles = enforceYouTubeTitleLimits(titles, contentFormat);
    }
    
    processed.titles = titles;
    
  } else if (task === 'tags_and_hashtags') {
    if (platform.toLowerCase() === 'youtube') {
      // YouTube: 15-20 tags and 15-20 hashtags
      let tags = response.tags || [];
      let hashtags = response.hashtags || [];
      
      tags = trimAndPadArray(tags, 15, 20, (index) => generateFallbackTags(1, language)[0]);
      hashtags = trimAndPadArray(hashtags, 15, 20, (index) => generateFallbackHashtags(1, language)[0]);
      
      processed.tags = tags;
      processed.hashtags = hashtags;
      
    } else {
      // Instagram/TikTok/Facebook: 15-20 hashtags only
      let hashtags = response.hashtags || [];
      hashtags = trimAndPadArray(hashtags, 15, 20, (index) => generateFallbackHashtags(1, language)[0]);
      processed.hashtags = hashtags;
    }
  }
  
  return processed;
}

// Helper to validate if response is in correct language - strengthened for consistency
function validateLanguage(response, expectedLanguage) {
  if (expectedLanguage.toLowerCase() === 'english' || expectedLanguage.toLowerCase() === 'en') {
    return true; // Skip validation for English as it's the default
  }
  
  // For non-English languages, use stricter validation to ensure language consistency
  const responseText = JSON.stringify(response).toLowerCase();
  
  // Extract all text content from the response for analysis
  let allTextContent = '';
  if (response.titles) {
    allTextContent += response.titles.map(item => item.text || '').join(' ');
  }
  if (response.tags) {
    allTextContent += ' ' + response.tags.map(item => item.text || '').join(' ');
  }
  if (response.hashtags) {
    allTextContent += ' ' + response.hashtags.map(item => item.text || '').join(' ');
  }
  
  allTextContent = allTextContent.toLowerCase().trim();
  
  // If no meaningful content, allow it to pass
  if (allTextContent.length < 20) {
    return true;
  }
  
  // Count common English words with a more comprehensive pattern
  const commonEnglishPatterns = /\b(the|and|or|but|in|on|at|to|for|of|with|by|this|that|these|those|from|into|about|after|before|during|what|when|where|why|how|can|will|would|should|could|have|has|had|is|are|was|were|be|been|being|do|does|did|done|get|got|make|made|take|took|come|came|go|went|see|saw|know|knew|think|thought|say|said|tell|told|give|gave|find|found|use|used|work|worked|feel|felt|seem|seemed|become|became|leave|left|put|put|mean|meant|keep|kept|let|let|begin|began|help|helped|talk|talked|turn|turned|start|started|show|showed|hear|heard|play|played|run|ran|move|moved|live|lived|believe|believed|bring|brought|happen|happened|write|wrote|provide|provided|sit|sat|stand|stood|lose|lost|pay|paid|meet|met|include|included|continue|continued|set|set|learn|learned|change|changed|lead|led|understand|understood|watch|watched|follow|followed|stop|stopped|create|created|speak|spoke|read|read|allow|allowed|add|added|spend|spent|grow|grew|open|opened|walk|walked|win|won|offer|offered|remember|remembered|love|loved|consider|considered|appear|appeared|buy|bought|wait|waited|serve|served|die|died|send|sent|expect|expected|build|built|stay|stayed|fall|fell|cut|cut|reach|reached|kill|killed|remain|remained|suggest|suggested|raise|raised|pass|passed|sell|sold|require|required|report|reported|decide|decided|pull|pulled|amazing|incredible|awesome|best|top|ultimate|perfect|stunning|fantastic|brilliant|excellent|outstanding|remarkable|extraordinary|magnificent|wonderful|superb|trending|viral|popular|content|you|need|see|results|minutes|guide|tips|techniques|secrets|methods|life|changing)\b/g;
  
  const englishMatches = (allTextContent.match(commonEnglishPatterns) || []).length;
  const totalWords = allTextContent.split(/\s+/).filter(word => word.length > 2).length;
  const englishRatio = totalWords > 0 ? englishMatches / totalWords : 0;
  
  // Stricter validation: fail if more than 60% of meaningful content is common English words
  // This ensures better language consistency while allowing some international terms
  if (englishRatio > 0.6 && expectedLanguage.toLowerCase() !== 'english') {
    console.warn(`Language validation failed: ${englishMatches}/${totalWords} English words (${(englishRatio * 100).toFixed(1)}%) for expected language: ${expectedLanguage}`);
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
async function callOpenRouter(model, systemPrompt, userPrompt, maxTokens = 800, timeout = 6000) {
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
        "Content-Type": "application/json",
        "HTTP-Referer": "https://turbotags.app",
        "X-Title": "TurboTags - AI Hashtag Generator"
      },
      body: JSON.stringify({
        model: model,
        response_format: { type: "json_object" },
        max_tokens: maxTokens, // Dynamic token allocation
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
    // Optimized order: most reliable models first, then specialized ones
    const modernModels = [
      "google/gemini-2.5-flash-lite",          // Primary: Most reliable and fast
      "google/gemini-2.0-flash-001",           // Secondary: Latest capabilities when available
      "google/gemma-2-27b-it",                 // Tertiary: Stable multilingual model 
      "anthropic/claude-3-haiku"               // Quaternary: Reliable fallback
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

    const systemPrompt = `You are an expert social media content strategist specialized in fast, accurate generation across all languages and platforms.

    CRITICAL REQUIREMENTS:
    1. TOPIC FOCUS: Generate content STRICTLY about the userTopic provided. Stay on-topic and relevant.
    
    2. LANGUAGE: Generate ALL content (tags, hashtags, titles) in ${validatedLanguage}. 
    ${validatedLanguage.toLowerCase() !== 'english' && validatedLanguage.toLowerCase() !== 'en' ? 
      `IMPORTANT: You must write ALL tags and hashtags in ${validatedLanguage} language. Do NOT use English words unless they are commonly used international terms in that language. Use native ${validatedLanguage} terms for all content.` : 
      'Use natural English for all content.'
    }
    
    3. PLATFORM OPTIMIZATION: 
    - Platform: ${validatedPlatform}
    - Content Format: ${validatedContentFormat}
    - Target Region: ${validatedRegion}
    
    4. SPEED & RELIABILITY: Generate high-quality content quickly. Focus on trending potential and discoverability.

    CONTENT SPECIFICATIONS:
    - Each item must have "trend_percentage" between 70-100
    - Focus on discoverability for the specified platform and region

    YOUTUBE TITLE RULES:
    - ALL titles MUST be 100 characters or less (strict limit)
    - If contentFormat is 'short' or 'short_video', EVERY title MUST end with " #shorts"
    - Ensure titles remain under 100 characters even with #shorts added

    QUANTITY REQUIREMENTS:
    
    If task is 'titles':
    - Generate 5-10 titles related to userTopic in ${validatedLanguage}
    - ALL titles must have trend_percentage between 70-100
    - JSON structure: {"titles": [{"text": "Title Here", "trend_percentage": 85}]}
    
    If task is 'tags_and_hashtags':
      For YOUTUBE:
      - Generate 15-20 tags related to userTopic in ${validatedLanguage}
      - Generate 15-20 hashtags related to userTopic in ${validatedLanguage}
      - JSON structure: {"tags": [{"text": "tag name", "trend_percentage": 85}], "hashtags": [{"text": "#hashtag", "trend_percentage": 92}]}
      
      For INSTAGRAM, TIKTOK, or FACEBOOK:
      - Generate 15-20 hashtags related to userTopic in ${validatedLanguage}
      - JSON structure: {"hashtags": [{"text": "#hashtag", "trend_percentage": 88}]}

    LANGUAGE CONSISTENCY: Ensure ALL generated content (titles, tags, hashtags) uses the same language: ${validatedLanguage}

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
        const maxTokens = validatedTask === 'titles' ? 400 : 800; // Dynamic token allocation
        rawResult = await callOpenRouter(model, systemPrompt, structuredPrompt, maxTokens, 6000); // Optimized timeout for faster response
        
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
          validatedContentFormat,
          validatedLanguage
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
      // For non-English languages, skip JSON fallback and use localized programmatic fallback
      // JSON fallback only contains English content and would break language consistency
      if (validatedLanguage.toLowerCase() !== 'english' && validatedLanguage.toLowerCase() !== 'en') {
        console.log(`[FALLBACK] Skipping English-only fallback.json for language: ${validatedLanguage}. Using localized programmatic fallback.`);
        throw new Error('Skipping English JSON fallback for non-English request');
      }
      
      // Try to load enhanced fallback.json for English requests only
      const fallbackPath = path.join(process.cwd(), 'public', 'data', 'fallback.json');
      const fallbackData = await fs.readFile(fallbackPath, 'utf-8');
      const parsedFallback = JSON.parse(fallbackData);
      
      // Process fallback data according to the request
      let fallbackResponse = {};
      
      if (validatedTask === 'titles') {
        fallbackResponse.titles = parsedFallback.titles || generateFallbackTitles(7, validatedPlatform, validatedContentFormat, validatedLanguage);
      } else if (validatedTask === 'tags_and_hashtags') {
        if (validatedPlatform.toLowerCase() === 'youtube') {
          fallbackResponse.tags = parsedFallback.tags || generateFallbackTags(20, validatedLanguage);
          fallbackResponse.hashtags = parsedFallback.hashtags || generateFallbackHashtags(20, validatedLanguage);
        } else {
          // Instagram/TikTok/Facebook: hashtags only
          fallbackResponse.hashtags = parsedFallback.hashtags || generateFallbackHashtags(20, validatedLanguage);
        }
      }
      
      // Process through validation system for consistency
      const processedFallback = processAndValidateResponse(
        fallbackResponse, 
        validatedTask, 
        validatedPlatform, 
        validatedContentFormat,
        validatedLanguage
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
        emergencyResponse.titles = generateFallbackTitles(7, validatedPlatform, validatedContentFormat, validatedLanguage);
      } else if (validatedTask === 'tags_and_hashtags') {
        if (validatedPlatform.toLowerCase() === 'youtube') {
          emergencyResponse.tags = generateFallbackTags(20, validatedLanguage);
          emergencyResponse.hashtags = generateFallbackHashtags(20, validatedLanguage);
        } else {
          emergencyResponse.hashtags = generateFallbackHashtags(20, validatedLanguage);
        }
      }
      
      const processedEmergency = processAndValidateResponse(
        emergencyResponse, 
        validatedTask, 
        validatedPlatform, 
        validatedContentFormat,
        validatedLanguage
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
        emergencyFallback.titles = generateFallbackTitles(7, safePlatform, safeContentFormat, language || 'english');
      } else {
        if (safePlatform.toLowerCase() === 'youtube') {
          emergencyFallback.tags = generateFallbackTags(20, language || 'english');
          emergencyFallback.hashtags = generateFallbackHashtags(20, language || 'english');
        } else {
          emergencyFallback.hashtags = generateFallbackHashtags(20, language || 'english');
        }
      }
      
      const processedEmergency = processAndValidateResponse(
        emergencyFallback, 
        safeTask, 
        safePlatform, 
        safeContentFormat,
        language || 'english'
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
