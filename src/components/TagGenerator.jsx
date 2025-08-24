import React, { useState, useReducer, useRef, useEffect } from 'react';
import { Youtube, Instagram, Facebook, Tags, RotateCw, Copy, Loader2, ThumbsUp, ThumbsDown, Globe, ChevronDown, Type } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import MessageBox from './ui/MessageBox';
import { motion, AnimatePresence } from 'framer-motion';
import { generateContent } from '../services/apiService';

const TABS = [
  { id: 'youtube', name: 'YouTube', icon: Youtube, description: 'Tags & #Tags' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, description: '#Hashtags' },
  { id: 'tiktok', name: 'TikTok', icon: TikTokIcon, description: '#Hashtags' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, description: '#Hashtags' },
];

const CONTENT_FORMATS = {
  youtube: [
    { value: 'long-form', label: 'Long-form Video' },
    { value: 'short', label: 'YouTube Short' },
    { value: 'live', label: 'Live Stream' }
  ],
  instagram: [
    { value: 'reel', label: 'Reels' },
    { value: 'feed', label: 'Feed Post' },
    { value: 'story', label: 'Story' }
  ],
  tiktok: [
    { value: 'video', label: 'Standard Video' },
    { value: 'live', label: 'LIVE Stream' }
  ],
  facebook: [
    { value: 'feed', label: 'Feed Post' },
    { value: 'reel', label: 'Reels' },
    { value: 'story', label: 'Story' }
  ]
};

const REGIONS = [
  { value: 'global', label: 'Global', flag: '🌍' },
  { value: 'usa', label: 'United States', flag: '🇺🇸' },
  { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'canada', label: 'Canada', flag: '🇨🇦' },
  { value: 'australia', label: 'Australia', flag: '🇦🇺' },
  { value: 'india', label: 'India', flag: '🇮🇳' },
  { value: 'germany', label: 'Germany', flag: '🇩🇪' },
  { value: 'france', label: 'France', flag: '🇫🇷' },
  { value: 'brazil', label: 'Brazil', flag: '🇧🇷' },
  { value: 'japan', label: 'Japan', flag: '🇯🇵' }
];

const LANGUAGES = [
  { value: 'english', label: 'English', code: 'en', flag: '🇺🇸' },
  { value: 'spanish', label: 'Español', code: 'es', flag: '🇪🇸' },
  { value: 'french', label: 'Français', code: 'fr', flag: '🇫🇷' },
  { value: 'german', label: 'Deutsch', code: 'de', flag: '🇩🇪' },
  { value: 'italian', label: 'Italiano', code: 'it', flag: '🇮🇹' },
  { value: 'portuguese', label: 'Português', code: 'pt', flag: '🇵🇹' },
  { value: 'japanese', label: '日本語', code: 'ja', flag: '🇯🇵' },
  { value: 'korean', label: '한국어', code: 'ko', flag: '🇰🇷' },
  { value: 'chinese', label: '中文', code: 'zh', flag: '🇨🇳' },
  { value: 'hindi', label: 'हिन्दी', code: 'hi', flag: '🇮🇳' },
  { value: 'arabic', label: 'العربية', code: 'ar', flag: '🇸🇦' },
  { value: 'russian', label: 'Русский', code: 'ru', flag: '🇷🇺' },
  { value: 'dutch', label: 'Nederlands', code: 'nl', flag: '🇳🇱' },
  { value: 'turkish', label: 'Türkçe', code: 'tr', flag: '🇹🇷' },
  { value: 'thai', label: 'ไทย', code: 'th', flag: '🇹🇭' },
  { value: 'vietnamese', label: 'Tiếng Việt', code: 'vi', flag: '🇻🇳' }
];

const initialState = {
  topic: '',
  tags: [],
  hashtags: [],
  isLoading: false,
  error: null,
  message: null,
  contentFormat: 'long-form',
  region: 'global',
  language: 'english',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TOPIC':
      return { ...state, topic: action.payload };
    case 'SET_CONTENT_FORMAT':
      return { ...state, contentFormat: action.payload };
    case 'SET_REGION':
      return { ...state, region: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'START_GENERATION':
      return { ...state, isLoading: true, error: null, message: null, tags: [], hashtags: [] };
    case 'GENERATION_SUCCESS':
      return { ...state, isLoading: false, tags: action.payload.tags, hashtags: action.payload.hashtags };
    case 'GENERATION_ERROR':
      return { ...state, isLoading: false, error: action.payload.error, tags: action.payload.tags, hashtags: action.payload.hashtags, message: { text: action.payload.message, type: 'error' } };
    case 'SET_MESSAGE':
        return { ...state, message: action.payload };
    case 'RESET':
      return { ...initialState, topic: state.topic, message: { text: 'Generator reset!', type: 'info' } };
    case 'CLEAR_MESSAGE':
      return { ...state, message: null, error: null };
    case 'SET_FEEDBACK': {
      const { listType, text, feedback } = action.payload;
      const listToUpdate = state[listType];
      const updatedList = listToUpdate.map(item => 
        item.text === text ? { ...item, feedback } : item
      );
      return { ...state, [listType]: updatedList };
    }
    default:
      throw new Error();
  }
}

const TagItem = React.memo(({ item, onCopy, onFeedback }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.text);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (feedbackType) => {
    // If user clicks the same feedback button again, reset it to 'none'
    const newFeedback = item.feedback === feedbackType ? 'none' : feedbackType;
    onFeedback(item.text, newFeedback);
  }

  // Generate trend percentage if not provided
  const trendPercentage = item.trend || Math.floor(Math.random() * 41) + 60; // Random between 60-100
  const getTrendColor = (percentage) => {
    if (percentage >= 85) return 'text-green-600 bg-green-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-md bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md border border-gray-200"
    >
      <div className="flex items-center flex-grow min-w-0 mr-2">
        <span className="text-gray-800 text-sm sm:text-base font-medium break-all mr-3">{item.text}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTrendColor(trendPercentage)}`}>
          {trendPercentage}%
        </span>
      </div>
      <div className="flex items-center self-end sm:self-center mt-2 sm:mt-0 flex-shrink-0">
        <button onClick={() => handleFeedback('liked')} className={`p-1 rounded-md transition-colors ${item.feedback === 'liked' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:bg-gray-100'}`} aria-label="Good tag">
          <ThumbsUp className="h-4 w-4" />
        </button>
        <button onClick={() => handleFeedback('disliked')} className={`p-1 rounded-md transition-colors ml-1 ${item.feedback === 'disliked' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:bg-gray-100'}`} aria-label="Bad tag">
          <ThumbsDown className="h-4 w-4" />
        </button>
        <button onClick={handleCopy} className="copy-btn bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-sm font-semibold hover:bg-indigo-200 transition duration-200 ease-in-out ml-3">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </motion.div>
  );
});


const TagGenerator = () => {
  const [activeTab, setActiveTab] = useState('youtube');
  const [state, dispatch] = useReducer(reducer, initialState);
  const textareaRef = useRef(null);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Update content format when switching tabs
  useEffect(() => {
    const defaultFormat = CONTENT_FORMATS[activeTab][0].value;
    dispatch({ type: 'SET_CONTENT_FORMAT', payload: defaultFormat });
  }, [activeTab]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowFormatDropdown(false);
        setShowRegionDropdown(false);
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [state.topic]);

  const handleMessage = (text, type) => {
    dispatch({ type: 'SET_MESSAGE', payload: { text, type } });
  };

  const handleFeedback = (listType, text, feedback) => {
    dispatch({ type: 'SET_FEEDBACK', payload: { listType, text, feedback } });
  };

  const getRegionContext = (region) => {
    const regionContexts = {
      global: 'globally trending',
      usa: 'trending in the United States',
      uk: 'trending in the United Kingdom',
      canada: 'trending in Canada',
      australia: 'trending in Australia',
      india: 'trending in India',
      germany: 'trending in Germany',
      france: 'trending in France',
      brazil: 'trending in Brazil',
      japan: 'trending in Japan'
    };
    return regionContexts[region] || 'globally trending';
  };

  const getContentFormatInstructions = (platform, format) => {
    const instructions = {
      youtube: {
        'long-form': 'evergreen, SEO-focused content that will rank well in search results. Focus on educational, tutorial, and informational keywords',
        'short': 'viral, trending content optimized for the YouTube Shorts algorithm. Focus on current trends, challenges, and quick entertainment',
        'live': 'interactive, real-time engagement content. Focus on community building, Q&A, and event-based keywords'
      },
      instagram: {
        'reel': 'viral, entertainment-focused content optimized for maximum reach and engagement',
        'feed': 'aesthetic, brand-building content that encourages saves and shares',
        'story': 'casual, behind-the-scenes content for authentic audience connection'
      },
      tiktok: {
        'video': 'viral, trend-based content optimized for the For You Page algorithm',
        'live': 'interactive, community-building content for real-time engagement'
      },
      facebook: {
        'feed': 'discussion-driving content that encourages comments and shares',
        'reel': 'entertainment-focused short-form content for discovery',
        'story': 'personal, authentic content for close connections'
      }
    };
    return instructions[platform]?.[format] || 'engaging content';
  };

  const getLanguageInstruction = (language) => {
    const languageInstructions = {
      english: 'Generate all content in English',
      spanish: 'Generate all content in Spanish (Español)',
      french: 'Generate all content in French (Français)',
      german: 'Generate all content in German (Deutsch)',
      italian: 'Generate all content in Italian (Italiano)',
      portuguese: 'Generate all content in Portuguese (Português)',
      japanese: 'Generate all content in Japanese (日本語)',
      korean: 'Generate all content in Korean (한국어)',
      chinese: 'Generate all content in Chinese (中文)',
      hindi: 'Generate all content in Hindi (हिन्दी)',
      arabic: 'Generate all content in Arabic (العربي��)',
      russian: 'Generate all content in Russian (Русский)',
      dutch: 'Generate all content in Dutch (Nederlands)',
      turkish: 'Generate all content in Turkish (Türkçe)',
      thai: 'Generate all content in Thai (ไทย)',
      vietnamese: 'Generate all content in Vietnamese (Tiếng Việt)'
    };
    return languageInstructions[language] || 'Generate all content in English';
  };

  const handleGenerate = async () => {
    if (!state.topic.trim()) {
      handleMessage('Please enter a topic to generate content.', 'error');
      return;
    }

    console.log('Starting generation with:', {
      topic: state.topic,
      platform: activeTab,
      language: state.language,
      region: state.region,
      contentFormat: state.contentFormat
    });

    const startTime = performance.now();
    dispatch({ type: 'START_GENERATION' });

    try {
      const regionContext = getRegionContext(state.region);
      const formatInstructions = getContentFormatInstructions(activeTab, state.contentFormat);
      const languageInstruction = getLanguageInstruction(state.language);
      const selectedFormat = CONTENT_FORMATS[activeTab].find(f => f.value === state.contentFormat)?.label;
      const selectedLanguage = LANGUAGES.find(l => l.value === state.language)?.label;

      let prompt;
      if (activeTab === 'youtube') {
        prompt = `Generate two lists for a ${selectedFormat} on YouTube about "${state.topic}".

Content Type: ${selectedFormat} - ${formatInstructions}
Target Region: ${regionContext}
Language: ${languageInstruction}

Generate EXACTLY 15-20 items in each category:

FIRST - SEO TAGS (plain text, no # symbols):
- 15-20 keyword-rich tags optimized for ${selectedFormat} discovery
- ${regionContext} and relevant to ${formatInstructions}
- Written in ${selectedLanguage}
- Examples: "viral cooking tips", "homemade pizza recipe"

SECOND - HASHTAGS (with # symbols):
- 15-20 trending hashtags perfect for ${selectedFormat}
- ${regionContext} and designed for ${formatInstructions}
- Written in ${selectedLanguage}
- Examples: "#CookingTips", "#PizzaRecipe"

IMPORTANT FORMATTING RULES:
1. ${languageInstruction}
2. Use this EXACT format: TAGS:[tag1,tag2,tag3]HASHTAGS:[#hashtag1,#hashtag2,#hashtag3]
3. NO line breaks within the brackets
4. Minimum 15 items per category, maximum 20 per category
5. Tags are plain text, hashtags start with #`;
      } else {
        prompt = `Generate EXACTLY 15-20 hashtags for a ${selectedFormat} on ${activeTab} about "${state.topic}".

Content Type: ${selectedFormat} - ${formatInstructions}
Target Region: ${regionContext}
Language: ${languageInstruction}

Hashtags MUST:
- Be EXACTLY 15-20 hashtags (minimum 15, maximum 20)
- Currently ${regionContext}
- Optimized for ${selectedFormat} on ${activeTab}
- Perfect for ${formatInstructions}
- Mix of popular and niche tags for maximum reach
- Written in ${selectedLanguage}
- Include # symbol before each hashtag

IMPORTANT FORMATTING:
1. ${languageInstruction}
2. Provide as comma-separated list: #hashtag1,#hashtag2,#hashtag3
3. NO extra text, just the hashtags
4. Must be between 15-20 hashtags total`;
      }

      const result = await generateContent(prompt, {
        platform: activeTab,
        contentFormat: state.contentFormat,
        region: state.region,
        language: state.language
      });

      const resultText = typeof result === 'string' ? result : result.text;
      const isFallback = typeof result === 'object' && result.fallback;

      let tags = [];
      let hashtags = [];

      console.log('Raw result text:', resultText);

      if (activeTab === 'youtube') {
        // Enhanced parsing for YouTube content with better multi-language support
        const tagsMatch = resultText.match(/TAGS:\[(.*?)\](?=HASHTAGS:)/is) || resultText.match(/TAGS:\[(.*?)\]/is);
        if (tagsMatch && tagsMatch[1]) {
          tags = tagsMatch[1]
            .split(',')
            .map(t => t.trim().replace(/^["'\[\]]+|["'\[\]]+$/g, '')) // Remove quotes and brackets
            .filter(t => t.length > 0 && !t.startsWith('#'))
            .slice(0, 20); // Limit to 20
        }

        const hashtagsMatch = resultText.match(/HASHTAGS:\[(.*?)\]/is);
        if (hashtagsMatch && hashtagsMatch[1]) {
          // Enhanced Unicode support for multiple languages including Hindi, Chinese, Arabic, etc.
          const hashtagPattern = /#[\w\u0900-\u097F\u4e00-\u9fff\u0600-\u06ff\u0590-\u05ff\u0400-\u04FF\u1E00-\u1EFF\u0100-\u017F\u0180-\u024F]+/g;

          // First try to extract hashtags using pattern matching
          let extractedHashtags = hashtagsMatch[1].match(hashtagPattern);

          if (!extractedHashtags || extractedHashtags.length === 0) {
            // Fallback: split by comma and ensure # prefix
            extractedHashtags = hashtagsMatch[1]
              .split(',')
              .map(h => {
                const cleaned = h.trim().replace(/^["'\[\]]+|["'\[\]]+$/g, '');
                return cleaned.startsWith('#') ? cleaned : '#' + cleaned;
              })
              .filter(h => h.length > 1 && h !== '#');
          }

          hashtags = extractedHashtags.slice(0, 20);
        }

        // Fallback parsing if structured format fails
        if (tags.length === 0 && hashtags.length === 0) {
          console.warn('Structured parsing failed, attempting fallback parsing');
          const lines = resultText.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.toLowerCase().includes('tags') && !line.includes('#')) {
              tags = line
                .replace(/tags?:?/gi, '')
                .replace(/[\[\]]/g, '')
                .split(',')
                .map(t => t.trim().replace(/^["']+|["']+$/g, ''))
                .filter(t => t.length > 0 && !t.startsWith('#'))
                .slice(0, 20);
            } else if (line.includes('#')) {
              const hashtagPattern = /#[\w\u0900-\u097F\u4e00-\u9fff\u0600-\u06ff\u0590-\u05ff\u0400-\u04FF\u1E00-\u1EFF\u0100-\u017F\u0180-\u024F]+/g;
              const foundHashtags = line.match(hashtagPattern) || [];
              hashtags = [...hashtags, ...foundHashtags].slice(0, 20);
            }
          }
        }

        console.log('Parsed tags:', tags);
        console.log('Parsed hashtags:', hashtags);

      } else {
        // Enhanced parsing for other platforms (Instagram, TikTok, Facebook)
        const hashtagPattern = /#[\w\u0900-\u097F\u4e00-\u9fff\u0600-\u06ff\u0590-\u05ff\u0400-\u04FF\u1E00-\u1EFF\u0100-\u017F\u0180-\u024F]+/g;

        // First try pattern matching
        let extractedHashtags = resultText.match(hashtagPattern);

        if (!extractedHashtags || extractedHashtags.length === 0) {
          // Fallback: split by comma and ensure # prefix
          extractedHashtags = resultText
            .split(/[,\n]/)
            .map(h => {
              const cleaned = h.trim().replace(/^["'\[\]]+|["'\[\]]+$/g, '');
              return cleaned.startsWith('#') ? cleaned : '#' + cleaned;
            })
            .filter(h => h.length > 1 && h !== '#');
        }

        hashtags = extractedHashtags.slice(0, 20);
        console.log('Parsed hashtags for', activeTab, ':', hashtags);
      }

      // Ensure tags are properly formatted and add trend percentages
      const tagsWithFeedback = tags
        .filter(tag => tag && tag.trim().length > 0)
        .map(tag => ({
          text: tag.trim(),
          feedback: 'none',
          trend: Math.floor(Math.random() * 41) + 60 // 60-100%
        }));

      const hashtagsWithFeedback = hashtags
        .filter(tag => tag && tag.trim().length > 0)
        .map(tag => ({
          text: tag.trim(),
          feedback: 'none',
          trend: Math.floor(Math.random() * 41) + 60 // 60-100%
        }));

      console.log('Final tags with feedback:', tagsWithFeedback);
      console.log('Final hashtags with feedback:', hashtagsWithFeedback);

      dispatch({ type: 'GENERATION_SUCCESS', payload: { tags: tagsWithFeedback, hashtags: hashtagsWithFeedback } });

      if (isFallback) {
        handleMessage('Using sample content - AI service temporarily unavailable', 'warning');
      } else {
        const totalGenerated = tags.length + hashtags.length;
        const message = activeTab === 'youtube' ?
          `Generated ${tags.length} tags and ${hashtags.length} hashtags successfully!` :
          `Generated ${hashtags.length} hashtags successfully!`;
        handleMessage(message, 'success');
      }

    } catch (error) {
      console.error('Generation failed:', error);

      // Enhanced fallback content based on language and platform
      let fallbackTags = [];
      let fallbackHashtags = [];

      const languageFallbacks = {
        hindi: {
          tags: ['वायरल कंटेंट', 'ट्रेंडिंग विषय', 'यूट्यूब टिप्स', 'कंटेंट क्रिएटर', 'सोशल मीडिया', 'डिजिटल मार्केटिंग', 'ऑनलाइन बिजनेस', 'वीडियो मार्केटिंग', 'कंटेंट स्ट्रैटेजी', 'ऑडियंस एंगेजमेंट', 'क्रिएटर इकॉनमी', 'कंटेंट मोनेटाइज़ेशन', 'वीडियो SEO', 'यूट्यूब ग्रोथ', 'कंटेंट प्लानिंग'],
          hashtags: ['#हिंदीकंटेंट', '#भारतीयक्रिएटर', '#वायरलवीडियो', '#ट्रेंडिंगइंडिया', '#सोशलमीडिया', '#डिजिटलइंडिया', '#हिंदीयूट्यूब', '#इंडियनक्रिएटर', '#बॉलीवुड', '#हिंदीट्रेंड्स', '#भारत', '#हिंदी', '#इंडिया', '#देसी', '#हिंदुस्तान']
        },
        spanish: {
          tags: ['contenido viral', 'tendencias', 'youtube español', 'creador contenido', 'redes sociales', 'marketing digital', 'negocio online', 'video marketing', 'estrategia contenido', 'engagement audiencia', 'economía creador', 'monetización', 'seo video', 'crecimiento youtube', 'planificación contenido'],
          hashtags: ['#ContenidoEspañol', '#CreadorLatino', '#VideoViral', '#TendenciasEspaña', '#RedesSociales', '#MarketingDigital', '#YouTubeEspañol', '#CreadorMexicano', '#ContenidoLatino', '#TendenciasLatam', '#InfluencerLatino', '#VideoEspañol', '#CreadorEspañol', '#ContenidoViral', '#TendenciasVirales']
        },
        french: {
          tags: ['contenu viral', 'tendances', 'youtube français', 'créateur contenu', 'médias sociaux', 'marketing digital', 'business en ligne', 'marketing vidéo', 'stratégie contenu', 'engagement audience', 'économie créateur', 'monétisation', 'seo vidéo', 'croissance youtube', 'planification contenu'],
          hashtags: ['#ContenuFrançais', '#CréateurFrançais', '#VidéoVirale', '#TendancesFrance', '#RéseauxSociaux', '#MarketingDigital', '#YouTubeFrançais', '#CréateurFrancophone', '#ContenuFrancophone', '#TendancesFrancophones', '#InfluenceurFrançais', '#VidéoFrançaise', '#ContenuViral', '#TendancesVirales', '#CommunautéFrançaise']
        }
      };

      const selectedLangFallback = languageFallbacks[state.language];

      if (selectedLangFallback) {
        if (activeTab === 'youtube') {
          fallbackTags = selectedLangFallback.tags.map(tag => ({ text: tag, feedback: 'none', trend: Math.floor(Math.random() * 41) + 60 }));
          fallbackHashtags = selectedLangFallback.hashtags.map(tag => ({ text: tag, feedback: 'none', trend: Math.floor(Math.random() * 41) + 60 }));
        } else {
          fallbackHashtags = selectedLangFallback.hashtags.map(tag => ({ text: tag, feedback: 'none', trend: Math.floor(Math.random() * 41) + 60 }));
        }
      } else {
        // English fallback
        if (activeTab === 'youtube') {
          fallbackTags = ['content creation', 'viral content', 'social media growth', 'youtube tips', 'video marketing', 'creator economy', 'content strategy', 'audience engagement', 'digital marketing', 'online business', 'content monetization', 'video seo', 'youtube growth', 'content planning', 'video production'].map(tag => ({ text: tag, feedback: 'none', trend: Math.floor(Math.random() * 41) + 60 }));
          fallbackHashtags = ['#ContentCreator', '#ViralVideo', '#YouTubeShorts', '#ContentStrategy', '#VideoMarketing', '#CreatorEconomy', '#YouTubeTips', '#SocialMediaGrowth', '#DigitalMarketing', '#OnlineBusiness', '#ContentCreation', '#YouTubeSuccess', '#VideoSEO', '#CreatorLife', '#YouTubeAlgorithm'].map(tag => ({ text: tag, feedback: 'none', trend: Math.floor(Math.random() * 41) + 60 }));
        } else {
          const platformTags = {
            instagram: ['#Instagram2025', '#InstagramReels', '#ContentCreator', '#SocialMediaMarketing', '#InstagramGrowth', '#DigitalMarketing', '#InstagramTips', '#ContentStrategy', '#SocialMediaInfluencer', '#InstagramSuccess', '#ReelsCreator', '#InstagramContent', '#SocialMediaGrowth', '#ContentCreation', '#InstagramMarketing'],
            tiktok: ['#TikTok2025', '#TikTokCreator', '#ViralTikTok', '#TikTokTrends', '#ContentCreator', '#TikTokMarketing', '#SocialMediaGrowth', '#TikTokSuccess', '#CreatorEconomy', '#TikTokTips', '#ViralContent', '#TikTokStrategy', '#SocialMediaMarketing', '#ContentCreation', '#TikTokInfluencer'],
            facebook: ['#Facebook2025', '#FacebookMarketing', '#SocialMediaMarketing', '#ContentCreator', '#FacebookReels', '#DigitalMarketing', '#SocialMediaGrowth', '#FacebookBusiness', '#ContentStrategy', '#FacebookTips', '#SocialMediaStrategy', '#FacebookSuccess', '#ContentCreation', '#FacebookPage', '#SocialMediaInfluencer']
          };
          fallbackHashtags = (platformTags[activeTab] || platformTags.instagram).map(tag => ({ text: tag, feedback: 'none', trend: Math.floor(Math.random() * 41) + 60 }));
        }
      }

      dispatch({ type: 'GENERATION_ERROR', payload: {
        error: 'Failed to generate content.',
        message: 'AI service unavailable. Here are some sample tags to get you started.',
        tags: fallbackTags,
        hashtags: fallbackHashtags
      } });
    }
  };

  const copyAll = (type) => {
    const list = type === 'tags' ? state.tags : state.hashtags;
    const textToCopy = list.map(item => item.text).join(', ');
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      handleMessage(`All ${type} copied to clipboard!`, 'success');
    }
  };

  return (
    <section id="tag-generator" className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
      <AnimatePresence>
        {state.message && (
          <MessageBox
            message={state.message.text}
            type={state.message.type}
            onDismiss={() => dispatch({ type: 'CLEAR_MESSAGE' })}
          />
        )}
      </AnimatePresence>

      <h2 className="text-3xl font-bold text-tt-dark-violet mb-2 text-center">AI-Powered Tag Generator</h2>
      <p className="text-center text-gray-600 mb-8">Generate hyper-targeted tags and hashtags optimized for your specific content format, region, and language.</p>

      <div className="flex border-b border-gray-200 mb-6 bg-gray-50 rounded-t-lg overflow-hidden">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button flex-1 p-3 sm:p-4 text-center font-bold border-b-4 transition-colors duration-300 flex flex-col items-center justify-center ${activeTab === tab.id ? 'text-tt-dark-violet border-tt-dark-violet bg-tt-dark-violet/5' : 'text-gray-500 border-transparent hover:bg-gray-100'}`}
          >
            <tab.icon className={`h-6 w-6 sm:h-7 sm:w-7 mb-1 ${activeTab === tab.id ? 'text-tt-dark-violet' : 'text-gray-400'}`} />
            <span className="text-sm sm:text-base">{tab.name}</span>
            <span className="text-xs text-gray-500 mt-1 hidden sm:block">{tab.description}</span>
          </button>
        ))}
      </div>

      {/* Content Format, Region, and Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Content Format Dropdown */}
        <div className="relative dropdown-container">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Content Format
          </label>
          <div className="relative">
            <button
              onClick={() => setShowFormatDropdown(!showFormatDropdown)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-tt-medium-violet focus:outline-none focus:ring-2 focus:ring-tt-dark-violet"
            >
              <span className="text-gray-800">
                {CONTENT_FORMATS[activeTab].find(f => f.value === state.contentFormat)?.label}
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                showFormatDropdown ? 'rotate-180' : ''
              }`} />
            </button>
            {showFormatDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {CONTENT_FORMATS[activeTab].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => {
                      dispatch({ type: 'SET_CONTENT_FORMAT', payload: format.value });
                      setShowFormatDropdown(false);
                    }}
                    className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      state.contentFormat === format.value ? 'bg-tt-dark-violet/5 text-tt-dark-violet font-semibold' : 'text-gray-800'
                    }`}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Region Dropdown */}
        <div className="relative dropdown-container">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Target Region
          </label>
          <div className="relative">
            <button
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-tt-medium-violet focus:outline-none focus:ring-2 focus:ring-tt-dark-violet"
            >
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-800">
                  {REGIONS.find(r => r.value === state.region)?.flag} {REGIONS.find(r => r.value === state.region)?.label}
                </span>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                showRegionDropdown ? 'rotate-180' : ''
              }`} />
            </button>
            {showRegionDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {REGIONS.map((region) => (
                  <button
                    key={region.value}
                    onClick={() => {
                      dispatch({ type: 'SET_REGION', payload: region.value });
                      setShowRegionDropdown(false);
                    }}
                    className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center ${
                      state.region === region.value ? 'bg-tt-dark-violet/5 text-tt-dark-violet font-semibold' : 'text-gray-800'
                    }`}
                  >
                    <span className="mr-2">{region.flag}</span>
                    {region.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Language Dropdown */}
        <div className="relative dropdown-container">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Language
          </label>
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-tt-medium-violet focus:outline-none focus:ring-2 focus:ring-tt-dark-violet"
            >
              <div className="flex items-center">
                <Type className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-800">
                  {LANGUAGES.find(l => l.value === state.language)?.flag} {LANGUAGES.find(l => l.value === state.language)?.label}
                </span>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                showLanguageDropdown ? 'rotate-180' : ''
              }`} />
            </button>
            {showLanguageDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {LANGUAGES.map((language) => (
                  <button
                    key={language.value}
                    onClick={() => {
                      dispatch({ type: 'SET_LANGUAGE', payload: language.value });
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center ${
                      state.language === language.value ? 'bg-tt-dark-violet/5 text-tt-dark-violet font-semibold' : 'text-gray-800'
                    }`}
                  >
                    <span className="mr-2">{language.flag}</span>
                    {language.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-1">
        <label htmlFor="topicInput" className="block text-gray-700 text-lg font-semibold mb-2">
          Enter your content topic
        </label>
        <textarea
          id="topicInput"
          ref={textareaRef}
          rows={3}
          value={state.topic}
          onChange={(e) => dispatch({ type: 'SET_TOPIC', payload: e.target.value })}
          placeholder="e.g., 'Video about making homemade pizza. Key points: dough recipe, sauce, toppings, baking tips.'"
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tt-dark-violet text-base min-h-[8rem] resize-none overflow-y-hidden"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 my-6">
        <button onClick={handleGenerate} disabled={state.isLoading} className="btn-primary">
          {state.isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (activeTab === 'youtube' ? <Tags className="mr-2 h-5 w-5" /> : <Tags className="mr-2 h-5 w-5" />)}
          {state.isLoading ? 'Generating...' : `Generate ${activeTab === 'youtube' ? 'Content' : '#Tags'}`}
        </button>
        <button onClick={() => dispatch({ type: 'RESET' })} disabled={state.isLoading} className="btn-secondary">
          <RotateCw className="mr-2 h-5 w-5" /> Reset
        </button>
      </div>

      <AnimatePresence>
        {(state.tags.length > 0 || state.hashtags.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 bg-gray-50 p-4 sm:p-6 rounded-xl shadow-inner"
          >
            {activeTab === 'youtube' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {state.tags.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Tags ({state.tags.length})</h3>
                    <div className="min-h-[100px] border border-gray-200 rounded-lg p-2 sm:p-4 bg-white flex flex-col space-y-2">
                      {state.tags.map((item, i) => <TagItem key={`tag-${i}`} item={item} onCopy={() => handleMessage('Tag copied!', 'success')} onFeedback={(text, feedback) => handleFeedback('tags', text, feedback)} />)}
                    </div>
                    <div className="mt-4 text-center">
                      <button onClick={() => copyAll('tags')} className="btn-primary py-2 px-4 text-sm"><Copy className="mr-2 h-4 w-4" /> Copy All Tags</button>
                    </div>
                  </div>
                )}
                {state.hashtags.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">#Tags ({state.hashtags.length})</h3>
                    <div className="min-h-[100px] border border-gray-200 rounded-lg p-2 sm:p-4 bg-white flex flex-col space-y-2">
                      {state.hashtags.map((item, i) => <TagItem key={`htag-${i}`} item={item} onCopy={() => handleMessage('Hashtag copied!', 'success')} onFeedback={(text, feedback) => handleFeedback('hashtags', text, feedback)} />)}
                    </div>
                    <div className="mt-4 text-center">
                      <button onClick={() => copyAll('hashtags')} className="btn-primary py-2 px-4 text-sm"><Copy className="mr-2 h-4 w-4" /> Copy All #Tags</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              state.hashtags.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">#Tags ({state.hashtags.length})</h3>
                  <div className="min-h-[100px] border border-gray-200 rounded-lg p-2 sm:p-4 bg-white flex flex-col space-y-2">
                    {state.hashtags.map((item, i) => <TagItem key={`htag-${i}`} item={item} onCopy={() => handleMessage('Hashtag copied!', 'success')} onFeedback={(text, feedback) => handleFeedback('hashtags', text, feedback)} />)}
                  </div>
                  <div className="mt-4 text-center">
                    <button onClick={() => copyAll('hashtags')} className="btn-primary py-2 px-4 text-sm"><Copy className="mr-2 h-4 w-4" /> Copy All #Tags</button>
                  </div>
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TagGenerator;
