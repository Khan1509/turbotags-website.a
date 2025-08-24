import React, { useState, useReducer, useRef, useEffect } from 'react';
import { Youtube, Instagram, Facebook, Tags, RotateCw, Copy, Loader2, ThumbsUp, ThumbsDown, Globe, ChevronDown } from 'lucide-react';
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

const initialState = {
  topic: '',
  tags: [],
  hashtags: [],
  isLoading: false,
  error: null,
  message: null,
  contentFormat: 'long-form',
  region: 'global',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TOPIC':
      return { ...state, topic: action.payload };
    case 'SET_CONTENT_FORMAT':
      return { ...state, contentFormat: action.payload };
    case 'SET_REGION':
      return { ...state, region: action.payload };
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-md bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md"
    >
      <span className="text-gray-800 text-sm sm:text-base font-medium flex-grow min-w-0 break-all mr-2">{item.text}</span>
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

  // Update content format when switching tabs
  useEffect(() => {
    const defaultFormat = CONTENT_FORMATS[activeTab][0].value;
    dispatch({ type: 'SET_CONTENT_FORMAT', payload: defaultFormat });
  }, [activeTab]);

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
      let prompt;
      if (activeTab === 'youtube') {
        prompt = `Generate two lists for a YouTube video about "${state.topic}". First, a list of 15 to 20 SEO-friendly tags. Second, a list of 15 to 20 trending hashtags. The total number of tags and hashtags combined should not exceed 25. IMPORTANT: You MUST format the response exactly as follows, with comma-separated values: TAGS:[tag one,tag two,another tag]HASHTAGS:[#hashtag1,#hashtag2,#hashtag3]`;
      } else {
        prompt = `Generate a list of 15 to 20 concise, relevant, and trending hashtags for a ${activeTab} post about "${state.topic}" (max 25). IMPORTANT: You MUST provide them as a single comma-separated list, with each item starting with '#'. Example: #hashtag1,#hashtag2,#hashtag3`;
      }

      const resultText = await generateContent(prompt);

      let tags = [];
      let hashtags = [];

      if (activeTab === 'youtube') {
        const tagsMatch = resultText.match(/TAGS:\[(.*?)\]/is);
        tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean) : [];

        const hashtagsBlockMatch = resultText.match(/HASHTAGS:\[(.*?)\]/is);
        if (hashtagsBlockMatch && hashtagsBlockMatch[1]) {
            const foundHashtags = hashtagsBlockMatch[1].match(/#[\w_]+/g);
            hashtags = foundHashtags ? foundHashtags.map(h => h.trim()).filter(Boolean) : [];
        }
        
        if (tags.length === 0 && hashtags.length === 0) {
            const parts = resultText.split(/HASHTAGS:/i);
            tags = parts[0].replace(/TAGS:/i, '').replace(/[\[\]]/g, '').split(',').map(t => t.trim()).filter(Boolean);
            if (parts[1]) {
                const foundHashtags = parts[1].match(/#[\w_]+/g);
                hashtags = foundHashtags ? foundHashtags.map(h => h.trim()).filter(Boolean) : [];
            }
        }
      } else {
        const foundHashtags = resultText.match(/#[\w_]+/g);
        hashtags = foundHashtags ? foundHashtags.map(h => h.trim()).filter(Boolean) : [];
      }

      const tagsWithFeedback = tags.map(tag => ({ text: tag, feedback: 'none' }));
      const hashtagsWithFeedback = hashtags.map(tag => ({ text: tag, feedback: 'none' }));

      dispatch({ type: 'GENERATION_SUCCESS', payload: { tags: tagsWithFeedback, hashtags: hashtagsWithFeedback } });
      handleMessage('Content generated successfully!', 'success');

    } catch (error) {
      console.error('Generation failed:', error);
      dispatch({ type: 'GENERATION_ERROR', payload: { error: 'Failed to generate content.', message: 'Service is busy. Using fallback data.', tags: [], hashtags: [] } });
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
      <p className="text-center text-gray-600 mb-8">Generate high-converting tags and hashtags for maximum global reach.</p>

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
