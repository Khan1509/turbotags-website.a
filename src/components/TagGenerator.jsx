import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Instagram, Facebook, Type, Hash, Zap, RotateCcw } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import ContentFormatSelector from './selectors/ContentFormatSelector';
import LanguageSelector from './selectors/LanguageSelector';
import RegionSelector from './selectors/RegionSelector';
import { generateContent } from '../services/apiService';
import MessageBox from './ui/MessageBox';
import TagList from './ui/TagList';
import ResultsSkeleton from './ui/ResultsSkeleton';

const platformTabs = [
  { id: 'youtube', name: 'YouTube', icon: Youtube },
  { id: 'instagram', name: 'Instagram', icon: Instagram },
  { id: 'tiktok', name: 'TikTok', icon: TikTokIcon },
  { id: 'facebook', name: 'Facebook', icon: Facebook },
];

const TagGenerator = ({ initialTab = 'youtube', initialTask = 'tags_and_hashtags' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [prompt, setPrompt] = useState('');
  const [task, setTask] = useState(initialTask);
  const [contentFormat, setContentFormat] = useState('long-form');
  const [language, setLanguage] = useState('english');
  const [region, setRegion] = useState('global');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const generateButtonRef = useRef(null);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setGeneratedContent(null);
    switch (tabId) {
      case 'youtube': setContentFormat('long-form'); break;
      case 'instagram': setContentFormat('reel'); break;
      case 'tiktok': setContentFormat('video'); break;
      case 'facebook': setContentFormat('feed'); break;
      default: setContentFormat('long-form');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only short-circuit if another submitter exists and isn't the Generate button
    const submitter = e?.nativeEvent?.submitter;
    if (submitter && submitter !== generateButtonRef.current) {
      return;
    }
    
    if (!prompt.trim()) {
      setError('Please enter a topic or keyword.');
      return;
    }
    setIsLoading(true);
    setGeneratedContent(null);
    setError(null);
    try {
      const options = { platform: activeTab, contentFormat, language, region };
      const data = await generateContent(prompt, options, task);
      setGeneratedContent(data);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setTask(initialTask);
    setActiveTab(initialTab);
    setContentFormat('long-form');
    setLanguage('english');
    setRegion('global');
    setGeneratedContent(null);
    setError(null);
    setOpenDropdown(null);
  };

  const closeDropdowns = useCallback((e) => {
    if (!e.target.closest('.dropdown-container')) {
      setOpenDropdown(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', closeDropdowns);
    return () => document.removeEventListener('click', closeDropdowns);
  }, [closeDropdowns]);

  return (
    <section id="tag-generator" className="relative p-4 sm:p-6 rounded-2xl" style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(229, 231, 235, 0.5)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
    }}>
      <div className="relative z-10">
      {error && <MessageBox message={error} type="error" onDismiss={() => setError(null)} />}
      
      <div className="relative flex border-b mb-6 overflow-x-auto" style={{borderColor: 'rgba(52, 73, 115, 0.3)'}}>

        {platformTabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className="relative flex-shrink-0 flex items-center gap-2 px-4 py-3 font-semibold transition-all duration-300 focus:outline-none rounded-lg"
            style={{
              color: activeTab === tab.id ? '#1f2937' : '#4b5563',
              background: activeTab === tab.id 
                ? 'rgba(255, 255, 255, 0.25)' 
                : 'rgba(255, 255, 255, 0.1)',
              border: activeTab === tab.id 
                ? '1px solid rgba(255, 255, 255, 0.3)' 
                : '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: activeTab === tab.id 
                ? '0 4px 15px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 255, 255, 0.2)' 
                : 'none',
              backdropFilter: 'blur(10px)'
            }}
            whileHover={{ 
              scale: 1.02,
              color: '#1f2937',
              boxShadow: activeTab === tab.id 
                ? '0 6px 20px rgba(0, 0, 0, 0.15), 0 0 25px rgba(255, 255, 255, 0.3)' 
                : '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="h-5 w-5 relative z-10" />
            <span className="relative z-10">{tab.name}</span>
          </motion.button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Settings Section - Clearly separated */}
        <motion.div 
          className="relative p-5 rounded-xl transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(209, 213, 219, 0.5)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.06)',
            backdropFilter: 'blur(10px)'
          }}
          whileHover={{
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), 0 0 20px rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3 className="text-lg font-bold mb-4 relative z-10" style={{color: '#1f2937'}}>Content Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            <ContentFormatSelector platform={activeTab} value={contentFormat} onChange={setContentFormat} showDropdown={openDropdown === 'format'} setShowDropdown={(show) => setOpenDropdown(show ? 'format' : null)} />
            <LanguageSelector value={language} onChange={setLanguage} showDropdown={openDropdown === 'language'} setShowDropdown={(show) => setOpenDropdown(show ? 'language' : null)} />
            <RegionSelector value={region} onChange={setRegion} showDropdown={openDropdown === 'region'} setShowDropdown={(show) => setOpenDropdown(show ? 'region' : null)} />
          </div>
        </motion.div>

        <div>
          <label htmlFor="prompt-input" className="block text-base font-bold mb-3" style={{color: '#1f2937'}}>
            Enter your content topic or keywords
          </label>
          <input
            id="prompt-input"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'unboxing the new iPhone' or 'vegan chocolate cake recipe'"
            className="w-full p-4 rounded-lg focus:outline-none transition-all duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(209, 213, 219, 0.6)',
              backdropFilter: 'blur(10px)',
              color: '#1f2937',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
            }}
            required
          />
        </div>
        
        {/* Content Type Selection - Clearly separated */}
        <motion.div 
          className="relative p-5 rounded-xl transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(209, 213, 219, 0.5)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.06)',
            backdropFilter: 'blur(10px)'
          }}
          whileHover={{
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), 0 0 20px rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3 className="text-lg font-bold mb-4 relative z-10" style={{color: '#1f2937'}}>What would you like to generate?</h3>
          <div className="flex flex-col sm:flex-row gap-3 relative z-10">
            <button type="button" onClick={() => setTask('tags_and_hashtags')} className={`flex-1 btn ${task === 'tags_and_hashtags' ? 'btn-primary' : 'btn-accent'}`}>
                <Hash className="mr-2 h-5 w-5" /> Generate Tags & Hashtags
            </button>
            <button type="button" onClick={() => setTask('titles')} className={`flex-1 btn ${task === 'titles' ? 'btn-primary' : 'btn-accent'}`}>
                <Type className="mr-2 h-5 w-5" /> Generate Titles
            </button>
          </div>
        </motion.div>

        {/* Action Buttons - Side by side layout */}
        <div className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              ref={generateButtonRef}
              type="submit"
              disabled={isLoading}
              className="flex-1 btn btn-primary text-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Generate Now
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="flex-1 btn btn-reset text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Form
            </button>
          </div>
          <p className="text-center text-xs mt-2" style={{
            color: '#374151',
            padding: '8px 16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            ✨ 100% Free & Unlimited Generations ✨
          </p>
        </div>
      </form>

      {(isLoading || generatedContent) && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4" style={{color: '#1f2937'}}>Generated Content</h2>
          {isLoading ? (
            <ResultsSkeleton />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {generatedContent.message && <p className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">{generatedContent.message}</p>}
              {generatedContent.titles && <TagList title="Titles" items={generatedContent.titles} icon={Type} />}
              {generatedContent.tags && <TagList title="Tags" items={generatedContent.tags} icon={Hash} />}
              {generatedContent.hashtags && <TagList title="Hashtags" items={generatedContent.hashtags} icon={Hash} />}
            </motion.div>
          )}
        </div>
      )}
      </div>
    </section>
  );
};

export default TagGenerator;
