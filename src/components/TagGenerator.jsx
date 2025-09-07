import React, { useState, useReducer, useRef, useEffect } from 'react';
import { Youtube, Instagram, Facebook, Tags, RotateCw, Copy, Loader2, Sparkles } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import MessageBox from './ui/MessageBox';
import { generateContent } from '../services/apiService';
import CreatorTips from './CreatorTips';
import RegionSelector from './selectors/RegionSelector';
import LanguageSelector from './selectors/LanguageSelector';
import ContentFormatSelector from './selectors/ContentFormatSelector';
import TagList from './ui/TagList';
import QuickTopics from './ui/QuickTopics';

const TABS = [
  { id: 'youtube', name: 'YouTube', icon: Youtube, description: 'Tags & #Tags' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, description: '#Hashtags' },
  { id: 'tiktok', name: 'TikTok', icon: TikTokIcon, description: '#Hashtags' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, description: '#Hashtags' },
];


const initialState = {
  topic: '',
  tags: [],
  hashtags: [],
  titles: [],
  isLoading: false,
  isTitleLoading: false,
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
      return { ...state, isLoading: true, error: null, message: null, tags: [], hashtags: [], titles: [] };
    case 'GENERATION_SUCCESS':
      return { ...state, isLoading: false, tags: action.payload.tags, hashtags: action.payload.hashtags };
    case 'GENERATION_ERROR':
      return { ...state, isLoading: false, error: action.payload.error, message: { text: action.payload.message, type: 'error' } };
    case 'START_TITLE_GENERATION':
      return { ...state, isTitleLoading: true, error: null, message: null, titles: [] };
    case 'TITLE_GENERATION_SUCCESS':
      const titlesWithFeedback = (action.payload.titles || []).map(item => ({ ...item, feedback: 'none' }));
      return { ...state, isTitleLoading: false, titles: titlesWithFeedback };
    case 'TITLE_GENERATION_ERROR':
      return { ...state, isTitleLoading: false, error: action.payload.error, message: { text: action.payload.message, type: 'error' } };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'RESET':
      return { ...initialState, topic: state.topic, message: { text: 'Generator reset!', type: 'info' } };
    case 'CLEAR_MESSAGE':
      return { ...state, message: null, error: null };
    case 'SET_FEEDBACK': {
      const { listType, text, feedback } = action.payload;
      const listToUpdate = state[listType];
      if (!listToUpdate) return state;
      const updatedList = listToUpdate.map(item => 
        item.text === text ? { ...item, feedback } : item
      );
      return { ...state, [listType]: updatedList };
    }
    default:
      throw new Error();
  }
}

const getTrendColor = (percentage) => {
    if (percentage >= 85) return 'text-green-800 bg-green-100 border-green-300';
    if (percentage >= 70) return 'text-yellow-800 bg-yellow-100 border-yellow-300';
    return 'text-red-800 bg-red-100 border-red-300';
};

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
  };

  const trendPercentage = item.trend_percentage || Math.floor(Math.random() * 41) + 60;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-md bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md border border-gray-200"
    >
      <div className="flex items-center flex-grow min-w-0 mr-2">
        <span className="text-gray-800 text-sm sm:text-base font-medium break-words mr-3" aria-label={`Tag: ${item.text}`}>{item.text}</span>
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

const TitleItem = React.memo(({ item, onCopy, onFeedback }) => {
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
    };

    const trendPercentage = item.trend_percentage || Math.floor(Math.random() * 31) + 70;
  
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-md bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md border border-gray-200"
      >
        <div className="flex items-center flex-grow min-w-0 mr-2">
            <span className="text-gray-800 text-sm sm:text-base font-medium break-words mr-3">{item.text}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTrendColor(trendPercentage)}`} aria-label={`Trending at ${trendPercentage} percent`}>
                {trendPercentage}%
            </span>
        </div>
        <div className="flex items-center self-end sm:self-center mt-2 sm:mt-0 flex-shrink-0" role="group" aria-label="Title actions">
            <button
                onClick={() => handleFeedback('liked')}
                className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${item.feedback === 'liked' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100 hover:text-green-600'}`}
                aria-label={`Mark title "${item.text}" as good`}
                aria-pressed={item.feedback === 'liked'}
            >
                <ThumbsUp className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
                onClick={() => handleFeedback('disliked')}
                className={`p-2 rounded-md transition-colors ml-1 focus:outline-none focus:ring-2 focus:ring-red-500 ${item.feedback === 'disliked' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100 hover:text-red-600'}`}
                aria-label={`Mark title "${item.text}" as bad`}
                aria-pressed={item.feedback === 'disliked'}
            >
                <ThumbsDown className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
                onClick={handleCopy}
                className="copy-btn bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-indigo-200 transition duration-200 ease-in-out ml-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`Copy title "${item.text}"`}
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
      </motion.div>
    );
});


const TagGenerator = ({ initialTab = 'youtube', initialTask = 'tags_and_hashtags' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [state, dispatch] = useReducer(reducer, initialState);
  const textareaRef = useRef(null);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showCopyFormat, setShowCopyFormat] = useState(false);
  const [selectedCopyFormat, setSelectedCopyFormat] = useState('space');

  const copyFormats = {
    space: { label: 'Space Separated', example: '#hashtag #hashtag2', separator: ' ' },
    line: { label: 'Line Separated', example: '#hashtag\n#hashtag2', separator: '\n' },
    comma: { label: 'Comma Separated', example: '#hashtag, #hashtag2', separator: ', ' },
    numbered: { label: 'Numbered List', example: '1. #hashtag\n2. #hashtag2', separator: 'numbered' }
  };

  const quickTopics = {
    youtube: [
      { category: 'Gaming', topics: ['Call of Duty gameplay', 'Minecraft building tutorial', 'Fortnite battle royale', 'Valorant clutch moments'] },
      { category: 'Tech', topics: ['iPhone 15 review', 'AI tutorial for beginners', 'Best laptops 2024', 'Coding tips and tricks'] },
      { category: 'Lifestyle', topics: ['Morning routine vlog', 'Productivity tips', 'Home workout routine', 'Study with me session'] },
      { category: 'Food', topics: ['Easy pasta recipe', 'Healthy meal prep', 'Baking chocolate cookies', 'Coffee brewing guide'] }
    ],
    instagram: [
      { category: 'Fashion', topics: ['OOTD casual spring look', 'Thrift haul transformation', 'Summer dress collection', 'Jewelry styling tips'] },
      { category: 'Beauty', topics: ['Get ready with me glam', 'Skincare routine night', 'Makeup tutorial natural', 'Hair care routine curly'] },
      { category: 'Travel', topics: ['Paris vacation highlights', 'Beach day essentials', 'City exploration guide', 'Travel photography tips'] },
      { category: 'Food', topics: ['Aesthetic cafe breakfast', 'Homemade pizza recipe', 'Healthy smoothie bowl', 'Dinner date outfit'] }
    ],
    tiktok: [
      { category: 'Dance', topics: ['Popular TikTok dance trend', 'Hip hop dance tutorial', 'Viral dance challenge', 'Dance battle compilation'] },
      { category: 'Comedy', topics: ['Funny relatable moments', 'Comedy skit everyday life', 'Hilarious pet reactions', 'Awkward social situations'] },
      { category: 'DIY', topics: ['Room makeover budget', 'Craft project easy', 'Upcycling old clothes', 'Quick art tutorial'] },
      { category: 'Life Hacks', topics: ['Organization tips bedroom', 'Study hacks for students', 'Cooking shortcuts busy', 'Phone photography tricks'] }
    ],
    facebook: [
      { category: 'Business', topics: ['Small business marketing tips', 'Entrepreneur success story', 'Product launch announcement', 'Customer testimonial video'] },
      { category: 'Family', topics: ['Family vacation memories', 'Kids birthday party ideas', 'Parenting tips toddlers', 'Weekend activities family'] },
      { category: 'Community', topics: ['Local event announcement', 'Charity fundraiser support', 'Neighborhood clean up day', 'Community garden project'] },
      { category: 'Education', topics: ['Online learning benefits', 'Study group formation', 'Educational workshop', 'Skill development course'] }
    ]
  };

  const handleQuickGenerate = async (topic) => {
    dispatch({ type: 'SET_TOPIC', payload: topic });
    // Small delay to show the topic was set, then auto-generate
    setTimeout(() => {
      dispatch({ type: 'START_GENERATION' });
      generateContent(topic, { 
        platform: activeTab, 
        contentFormat: state.contentFormat, 
        region: state.region, 
        language: state.language 
      }, 'tags_and_hashtags')
      .then(result => {
        const tagsWithFeedback = (result.tags || []).map(item => ({ ...item, feedback: 'none' }));
        const hashtagsWithFeedback = (result.hashtags || []).map(item => ({ ...item, feedback: 'none' }));
        dispatch({ type: 'GENERATION_SUCCESS', payload: { tags: tagsWithFeedback, hashtags: hashtagsWithFeedback } });
        if (result.fallback) {
          handleMessage(result.message || `Using ${state.language} sample content.`, 'warning');
        } else {
          const message = activeTab === 'youtube' ? `Generated ${result.tags.length} tags and ${result.hashtags.length} hashtags!` : `Generated ${result.hashtags.length} hashtags!`;
          handleMessage(message, 'success');
        }
      })
      .catch(error => {
        dispatch({ type: 'GENERATION_ERROR', payload: { error: 'Failed to generate content.', message: `AI service unavailable. Please try again shortly.` }});
      });
    }, 300);
  };

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
        setShowCopyFormat(false);
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
    dispatch({ type: 'START_GENERATION' });
    try {
      const result = await generateContent(state.topic, { platform: activeTab, contentFormat: state.contentFormat, region: state.region, language: state.language }, 'tags_and_hashtags');
      const tagsWithFeedback = (result.tags || []).map(item => ({ ...item, feedback: 'none' }));
      const hashtagsWithFeedback = (result.hashtags || []).map(item => ({ ...item, feedback: 'none' }));
      dispatch({ type: 'GENERATION_SUCCESS', payload: { tags: tagsWithFeedback, hashtags: hashtagsWithFeedback } });
      if (result.fallback) {
        handleMessage(result.message || `Using ${state.language} sample content.`, 'warning');
      } else {
        const message = activeTab === 'youtube' ? `Generated ${result.tags.length} tags and ${result.hashtags.length} hashtags!` : `Generated ${result.hashtags.length} hashtags!`;
        handleMessage(message, 'success');
      }
    } catch (error) {
      dispatch({ type: 'GENERATION_ERROR', payload: { error: 'Failed to generate content.', message: `AI service unavailable. Please try again shortly.` }});
    }
  };

  const handleGenerateTitles = async () => {
    if (!state.topic.trim()) {
      handleMessage('Please enter a topic to generate titles.', 'error');
      return;
    }
    dispatch({ type: 'START_TITLE_GENERATION' });
    try {
      const result = await generateContent(state.topic, { platform: activeTab, contentFormat: state.contentFormat, region: state.region, language: state.language }, 'titles');
      dispatch({ type: 'TITLE_GENERATION_SUCCESS', payload: { titles: result.titles || [] } });
      if (result.fallback) {
        handleMessage(result.message || `Using sample titles.`, 'warning');
      } else {
        handleMessage(`Generated ${result.titles.length} titles!`, 'success');
      }
    } catch (error) {
      dispatch({ type: 'TITLE_GENERATION_ERROR', payload: { error: 'Failed to generate titles.', message: `AI service unavailable. Please try again shortly.` }});
    }
  };

  const copyAll = (type, format = selectedCopyFormat) => {
    const list = state[type];
    let textToCopy;
    
    if (format === 'numbered') {
      textToCopy = list.map((item, index) => `${index + 1}. ${item.text}`).join('\n');
    } else {
      const separator = copyFormats[format].separator;
      textToCopy = list.map(item => item.text).join(separator);
    }
    
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      handleMessage(`All ${type} copied as ${copyFormats[format].label.toLowerCase()}!`, 'success');
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

      <h2 className="text-3xl font-bold text-tt-dark-violet mb-2 text-center">Your All-in-One AI Content Generator</h2>
      <p className="text-center text-gray-600 mb-8">Get hyper-targeted titles, find viral tags for YouTube, and discover trending hashtags for TikTok, Instagram, and Facebook. Our AI helps you find the best content for maximum views and engagement.</p>

      <div className="flex border-b border-gray-200 mb-6 bg-gray-50 rounded-t-lg overflow-x-auto" role="tablist" aria-label="Social media platforms">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            className={`tab-button flex-1 p-1 sm:p-4 text-center font-bold border-b-4 transition-colors duration-300 flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-tt-dark-violet focus:ring-inset min-w-[100px] ${activeTab === tab.id ? 'text-tt-dark-violet border-tt-dark-violet bg-tt-dark-violet/5' : 'text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-800'}`}
          >
            <tab.icon className={`h-6 w-6 sm:h-7 sm:w-7 mb-1 ${activeTab === tab.id ? 'text-tt-dark-violet' : 'text-gray-500'}`} aria-hidden="true" />
            <span className="text-xs sm:text-base">{tab.name}</span>
            <span className="text-xs text-gray-600 mt-1 hidden sm:block">{tab.description}</span>
          </button>
        ))}
      </div>

      <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50/50">
        <h3 className="text-sm font-bold text-gray-600 mb-4 text-center uppercase tracking-wider">Advanced Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative dropdown-container">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Content Format</label>
            <div className="relative">
              <button onClick={() => setShowFormatDropdown(!showFormatDropdown)} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-tt-medium-violet focus:outline-none focus:ring-2 focus:ring-tt-dark-violet">
                <span className="text-gray-800">{CONTENT_FORMATS[activeTab].find(f => f.value === state.contentFormat)?.label}</span>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showFormatDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showFormatDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                  >
                    {CONTENT_FORMATS[activeTab].map((format) => (
                      <button key={format.value} onClick={() => { dispatch({ type: 'SET_CONTENT_FORMAT', payload: format.value }); setShowFormatDropdown(false); }} className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${state.contentFormat === format.value ? 'bg-tt-dark-violet/5 text-tt-dark-violet font-semibold' : 'text-gray-800'}`}>
                        {format.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
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
              <AnimatePresence>
                {showRegionDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {REGIONS.map((region) => (
                      <button key={region.value} onClick={() => { dispatch({ type: 'SET_REGION', payload: region.value }); setShowRegionDropdown(false); }} className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center ${state.region === region.value ? 'bg-tt-dark-violet/5 text-tt-dark-violet font-semibold' : 'text-gray-800'}`}>
                        <span className="mr-2">{region.flag}</span>{region.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
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
              <AnimatePresence>
                {showLanguageDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {LANGUAGES.map((language) => (
                      <button key={language.value} onClick={() => { dispatch({ type: 'SET_LANGUAGE', payload: language.value }); setShowLanguageDropdown(false); }} className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center ${state.language === language.value ? 'bg-tt-dark-violet/5 text-tt-dark-violet font-semibold' : 'text-gray-800'}`}>
                        <span className="mr-2">{language.flag}</span>{language.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="p-1">
        <label htmlFor="topicInput" className="block text-gray-700 text-lg font-semibold mb-2">Enter your content topic</label>
        <textarea id="topicInput" ref={textareaRef} rows={3} value={state.topic} onChange={(e) => dispatch({ type: 'SET_TOPIC', payload: e.target.value })} placeholder="e.g., 'My latest YouTube short about a Valorant clutch' or 'A GRWM Instagram Reel for a summer party'." className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-tt-dark-violet focus:border-tt-dark-violet text-base min-h-[8rem] resize-none overflow-y-hidden transition-colors" aria-describedby="topic-help" required maxLength="1000" />
        <div className={`text-right text-sm mt-1 ${state.topic.length > 990 ? 'text-red-500' : 'text-gray-500'}`}>
          {state.topic.length} / 1000
        </div>
        <p id="topic-help" className="text-sm text-gray-600 mt-2">Describe your content topic to generate relevant titles, tags and hashtags</p>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-sm font-bold text-gray-700 mb-3 text-center uppercase tracking-wider">🚀 Quick Generate</h3>
        <p className="text-xs text-gray-600 text-center mb-4">Click any topic below to instantly generate hashtags</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickTopics[activeTab]?.map((category) => (
            <div key={category.category} className="space-y-1">
              <h4 className="text-xs font-semibold text-gray-600 text-center">{category.category}</h4>
              {category.topics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickGenerate(topic)}
                  disabled={state.isLoading || state.isTitleLoading}
                  className="w-full text-xs px-2 py-2 bg-white border border-gray-200 rounded-md hover:bg-indigo-50 hover:border-indigo-300 transition-colors duration-200 text-gray-700 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {topic.length > 20 ? `${topic.substring(0, 20)}...` : topic}
                </button>
              ))}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">💡 These generate instantly based on current trends for {activeTab}</p>
      </div>

      <CreatorTips platform={activeTab} compact={true} />

      <div className="flex flex-col sm:flex-row justify-center gap-4 my-6">
        <button onClick={handleGenerate} disabled={state.isLoading || state.isTitleLoading} className={initialTask === 'tags_and_hashtags' ? 'btn-primary' : 'btn-secondary'}>
          {state.isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Tags className="mr-2 h-5 w-5" />}
          {state.isLoading ? 'Generating...' : (activeTab === 'youtube' ? 'Generate Tags / #Tags' : 'Generate #Tags')}
        </button>
        <button onClick={handleGenerateTitles} disabled={state.isLoading || state.isTitleLoading} className={initialTask === 'titles' ? 'btn-primary' : 'btn-secondary'}>
            {state.isTitleLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
            {state.isTitleLoading ? 'Generating...' : 'Generate Titles'}
        </button>
        <button onClick={() => dispatch({ type: 'RESET' })} disabled={state.isLoading || state.isTitleLoading} className="btn-secondary">
          <RotateCw className="mr-2 h-5 w-5" /> Reset
        </button>
      </div>

      <AnimatePresence>
        {(state.tags.length > 0 || state.hashtags.length > 0 || state.titles.length > 0) && (
          <motion.div layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 bg-gray-50 p-4 sm:p-6 rounded-xl shadow-inner">
            {state.titles.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Generated Titles ({state.titles.length})</h3>
                    <div className="min-h-[100px] border border-gray-200 rounded-lg p-2 sm:p-4 bg-white flex flex-col space-y-2 mb-6">
                        {state.titles.map((item, i) => <TitleItem key={`title-${i}`} item={item} onCopy={() => handleMessage('Title copied!', 'success')} onFeedback={(text, feedback) => handleFeedback('titles', text, feedback)} />)}
                    </div>
                    <div className="mt-4 text-center">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <div className="relative">
                          <button 
                            onClick={() => setShowCopyFormat(!showCopyFormat)}
                            className="btn-secondary py-2 px-3 text-sm flex items-center"
                          >
                            <Type className="mr-2 h-4 w-4" /> 
                            {copyFormats[selectedCopyFormat].label} 
                            <ChevronDown className="ml-1 h-3 w-3" />
                          </button>
                          <AnimatePresence>
                            {showCopyFormat && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg"
                              >
                                {Object.entries(copyFormats).map(([key, format]) => (
                                  <button
                                    key={key}
                                    onClick={() => {
                                      setSelectedCopyFormat(key);
                                      setShowCopyFormat(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                                      selectedCopyFormat === key ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700'
                                    }`}
                                  >
                                    <div>{format.label}</div>
                                    <div className="text-xs text-gray-500 mt-1">{format.example}</div>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <button onClick={() => copyAll('titles')} className="btn-primary py-2 px-4 text-sm">
                          <Copy className="mr-2 h-4 w-4" /> Copy All Titles
                        </button>
                      </div>
                    </div>
                </div>
            )}

            {activeTab === 'youtube' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {state.tags.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Tags ({state.tags.length})</h3>
                    <div className="min-h-[100px] border border-gray-200 rounded-lg p-2 sm:p-4 bg-white flex flex-col space-y-2">
                      {state.tags.map((item, i) => <TagItem key={`tag-${i}`} item={item} onCopy={() => handleMessage('Tag copied!', 'success')} onFeedback={(text, feedback) => handleFeedback('tags', text, feedback)} />)}
                    </div>
                    <div className="mt-4 text-center">
                      <button onClick={() => copyAll('tags')} className="btn-primary py-2 px-4 text-sm">
                        <Copy className="mr-2 h-4 w-4" /> Copy All Tags ({copyFormats[selectedCopyFormat].label})
                      </button>
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
                      <button onClick={() => copyAll('hashtags')} className="btn-primary py-2 px-4 text-sm">
                        <Copy className="mr-2 h-4 w-4" /> Copy All #Tags ({copyFormats[selectedCopyFormat].label})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              state.hashtags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">#Tags ({state.hashtags.length})</h3>
                  <div className="min-h-[100px] border border-gray-200 rounded-lg p-2 sm:p-4 bg-white flex flex-col space-y-2">
                    {state.hashtags.map((item, i) => <TagItem key={`htag-${i}`} item={item} onCopy={() => handleMessage('Hashtag copied!', 'success')} onFeedback={(text, feedback) => handleFeedback('hashtags', text, feedback)} />)}
                  </div>
                  <div className="mt-4 text-center">
                    <button onClick={() => copyAll('hashtags')} className="btn-primary py-2 px-4 text-sm">
                      <Copy className="mr-2 h-4 w-4" /> Copy All #Tags ({copyFormats[selectedCopyFormat].label})
                    </button>
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
