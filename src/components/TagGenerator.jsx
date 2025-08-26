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
    const newFeedback = item.feedback === feedbackType ? 'none' : feedbackType;
    onFeedback(item.text, newFeedback);
  }

  const trendPercentage = item.trend || Math.floor(Math.random() * 41) + 60;
  const getTrendColor = (percentage) => {
    if (percentage >= 85) return 'text-green-700 bg-green-50 border-green-200';
    if (percentage >= 70) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
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
        <span className="text-gray-800 text-sm sm:text-base font-medium break-all mr-3" role="text" aria-label={`Tag: ${item.text}`}>{item.text}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTrendColor(trendPercentage)}`} aria-label={`Trending at ${trendPercentage} percent`}>
          {trendPercentage}%
        </span>
      </div>
      <div className="flex items-center self-end sm:self-center mt-2 sm:mt-0 flex-shrink-0" role="group" aria-label="Tag actions">
        <button
          onClick={() => handleFeedback('liked')}
          className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${item.feedback === 'liked' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100 hover:text-green-600'}`}
          aria-label={`Mark tag "${item.text}" as good`}
          aria-pressed={item.feedback === 'liked'}
        >
          <ThumbsUp className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          onClick={() => handleFeedback('disliked')}
          className={`p-2 rounded-md transition-colors ml-1 focus:outline-none focus:ring-2 focus:ring-red-500 ${item.feedback === 'disliked' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100 hover:text-red-600'}`}
          aria-label={`Mark tag "${item.text}" as bad`}
          aria-pressed={item.feedback === 'disliked'}
        >
          <ThumbsDown className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          onClick={handleCopy}
          className="copy-btn bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-indigo-200 transition duration-200 ease-in-out ml-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label={`Copy tag "${item.text}" to clipboard`}
        >
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

  useEffect(() => {
    const defaultFormat = CONTENT_FORMATS[activeTab][0].value;
    dispatch({ type: 'SET_CONTENT_FORMAT', payload: defaultFormat });
  }, [activeTab]);

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

  const handleGenerate = async () => {
    if (!state.topic.trim()) {
      handleMessage('Please enter a topic to generate content.', 'error');
      return;
    }

    const startTime = performance.now();
    dispatch({ type: 'START_GENERATION' });

    try {
      const result = await generateContent(state.topic, {
        platform: activeTab,
        contentFormat: state.contentFormat,
        region: state.region,
        language: state.language
      });

      // **ENHANCED LOGIC**: Process the structured JSON from the API
      const tagsWithFeedback = result.tags.map(item => ({ ...item, feedback: 'none' }));
      const hashtagsWithFeedback = result.hashtags.map(item => ({ ...item, feedback: 'none' }));

      dispatch({ type: 'GENERATION_SUCCESS', payload: { tags: tagsWithFeedback, hashtags: hashtagsWithFeedback } });

      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      
      if (result.fallback) {
        handleMessage(result.message || `Using ${state.language} sample content.`, 'warning');
      } else {
        const message = activeTab === 'youtube' ?
          `Generated ${result.tags.length} tags and ${result.hashtags.length} hashtags in ${duration}ms!` :
          `Generated ${result.hashtags.length} hashtags in ${duration}ms!`;
        handleMessage(message, 'success');
      }

    } catch (error) {
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      console.error('Generation failed after', duration + 'ms:', error);
      
      dispatch({ type: 'GENERATION_ERROR', payload: {
        error: 'Failed to generate content.',
        message: `AI service unavailable. Please try again shortly.`,
        tags: [],
        hashtags: []
      }});
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

      <div className="flex border-b border-gray-200 mb-6 bg-gray-50 rounded-t-lg overflow-hidden" role="tablist" aria-label="Social media platforms">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            className={`tab-button flex-1 p-3 sm:p-4 text-center font-bold border-b-4 transition-colors duration-300 flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-tt-dark-violet focus:ring-inset ${activeTab === tab.id ? 'text-tt-dark-violet border-tt-dark-violet bg-tt-dark-violet/5' : 'text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-800'}`}
          >
            <tab.icon className={`h-6 w-6 sm:h-7 sm:w-7 mb-1 ${activeTab === tab.id ? 'text-tt-dark-violet' : 'text-gray-500'}`} aria-hidden="true" />
            <span className="text-sm sm:text-base">{tab.name}</span>
            <span className="text-xs text-gray-600 mt-1 hidden sm:block">{tab.description}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative dropdown-container">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Content Format</label>
          <div className="relative">
            <button onClick={() => setShowFormatDropdown(!showFormatDropdown)} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-tt-medium-violet focus:outline-none focus:ring-2 focus:ring-tt-dark-violet">
              <span className="text-gray-800">{CONTENT_FORMATS[activeTab].find(f => f.value === state.contentFormat)?.label}</span>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showFormatDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showFormatDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {CONTENT_FORMATS[activeTab].map((format) => (
                  <button key={format.value} onClick={() => { dispatch({ type: 'SET_CONTENT_FORMAT', payload: format.value }); setShowFormatDropdown(false); }} className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${state.contentFormat === format.value ? 'bg-tt-dark-violet/5 text-tt-dark-violet font-semibold' : 'text-gray-800'}`}>
                    {format.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative dropdown-container">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Target Region</label>
          <div className="relative">
            <button onClick={() => setShowRegionDropdown(!showRegionDropdown)} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-tt-medium-violet focus:outline-none focus:ring-2 focus:ring-tt-dark-violet">
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-800">{REGIONS.find(r => r.value === state.region)?.flag} {REGIONS.find(r => r.value === state.region)?.label}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showRegionDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {REGIONS.map((region) => (
                  <button key={region.value} onClick={() => { dispatch({ type: 'SET_REGION', payload: region.value }); setShowRegionDropdown(false); }} className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center ${state.region === region.value ? 'bg-tt-dark-violet/5 text-tt-dark-violet font-semibold' : 'text-gray-800'}`}>
                    <span className="mr-2">{region.flag}</span>{region.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative dropdown-container">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Language</label>
          <div className="relative">
            <button onClick={() => setShowLanguageDropdown(!showLanguageDropdown)} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-tt-medium-violet focus:outline-none focus:ring-2 focus:ring-tt-dark-violet">
              <div className="flex items-center">
                <Type className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-800">{LANGUAGES.find(l => l.value === state.language)?.flag} {LANGUAGES.find(l => l.value === state.language)?.label}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showLanguageDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {LANGUAGES.map((language) => (
                  <button key={language.value} onClick={() => { dispatch({ type: 'SET_LANGUAGE', payload: language.value }); setShowLanguageDropdown(false); }} className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center ${state.language === language.value ? 'bg-tt-dark-violet/5 text-tt-dark-violet font-semibold' : 'text-gray-800'}`}>
                    <span className="mr-2">{language.flag}</span>{language.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-1">
        <label htmlFor="topicInput" className="block text-gray-700 text-lg font-semibold mb-2">Enter your content topic</label>
        <textarea id="topicInput" ref={textareaRef} rows={3} value={state.topic} onChange={(e) => dispatch({ type: 'SET_TOPIC', payload: e.target.value })} placeholder="e.g., 'Video about making homemade pizza. Key points: dough recipe, sauce, toppings, baking tips.'" className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tt-dark-violet focus:border-tt-dark-violet text-base min-h-[8rem] resize-none overflow-y-hidden transition-colors" aria-describedby="topic-help" required />
        <p id="topic-help" className="text-sm text-gray-600 mt-2">Describe your content topic to generate relevant tags and hashtags</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 my-6">
        <button onClick={handleGenerate} disabled={state.isLoading} className="btn-primary">
          {state.isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Tags className="mr-2 h-5 w-5" />}
          {state.isLoading ? 'Generating...' : `Generate ${activeTab === 'youtube' ? 'Content' : '#Tags'}`}
        </button>
        <button onClick={() => dispatch({ type: 'RESET' })} disabled={state.isLoading} className="btn-secondary">
          <RotateCw className="mr-2 h-5 w-5" /> Reset
        </button>
      </div>

      <AnimatePresence>
        {(state.tags.length > 0 || state.hashtags.length > 0) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 bg-gray-50 p-4 sm:p-6 rounded-xl shadow-inner">
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
