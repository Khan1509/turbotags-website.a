import React, { useState, useReducer, useRef, useEffect } from 'react';
import { Youtube, Instagram, Facebook, Tags, RotateCw, Copy, Loader2, Sparkles, Type, ChevronDown } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import MessageBox from './ui/MessageBox';
import { motion, AnimatePresence } from 'framer-motion';
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

  const handleQuickGenerate = async (topic) => {
    dispatch({ type: 'SET_TOPIC', payload: topic });
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
      {state.message && (
        <MessageBox
          message={state.message.text}
          type={state.message.type}
          onDismiss={() => dispatch({ type: 'CLEAR_MESSAGE' })}
        />
      )}

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
          <ContentFormatSelector
            platform={activeTab}
            value={state.contentFormat}
            onChange={(value) => dispatch({ type: 'SET_CONTENT_FORMAT', payload: value })}
            showDropdown={showFormatDropdown}
            setShowDropdown={setShowFormatDropdown}
          />
          <RegionSelector
            value={state.region}
            onChange={(value) => dispatch({ type: 'SET_REGION', payload: value })}
            showDropdown={showRegionDropdown}
            setShowDropdown={setShowRegionDropdown}
          />
          <LanguageSelector
            value={state.language}
            onChange={(value) => dispatch({ type: 'SET_LANGUAGE', payload: value })}
            showDropdown={showLanguageDropdown}
            setShowDropdown={setShowLanguageDropdown}
          />
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

      <QuickTopics platform={activeTab} onTopicSelect={handleQuickGenerate} />

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
                        <TagList items={state.titles} type="titles" onFeedback={handleFeedback} onCopy={() => handleMessage('Title copied!', 'success')} />
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
                      <TagList items={state.tags} type="tags" onFeedback={handleFeedback} onCopy={() => handleMessage('Tag copied!', 'success')} />
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
                      <TagList items={state.hashtags} type="hashtags" onFeedback={handleFeedback} onCopy={() => handleMessage('Hashtag copied!', 'success')} />
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
                    <TagList items={state.hashtags} type="hashtags" onFeedback={handleFeedback} onCopy={() => handleMessage('Hashtag copied!', 'success')} />
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
