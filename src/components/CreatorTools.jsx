import React, { useState } from 'react';
import { Hash, Scissors, Clock, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const platformLimits = {
  'YouTube Title': 100,
  'Instagram Caption': 2200,
  'Twitter': 280,
  'TikTok Caption': 150,
  'Facebook Post': 63206,
};

const CharacterCounter = () => {
  const [text, setText] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('YouTube Title');

  const charCount = text.length;
  const limit = platformLimits[selectedPlatform];
  const isOverLimit = charCount > limit;

  return (
    <div className="rounded-xl shadow-lg border border-opacity-30 p-6" style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
      borderColor: '#e5e7eb',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 15px rgba(22, 32, 89, 0.05)'
    }}>
      <div className="flex items-center mb-4">
        <Hash className="h-6 w-6 mr-3" style={{ color: '#4a90e2' }} />
        <h3 className="text-xl font-bold" style={{ color: '#1f2937' }}>Character Counter</h3>
      </div>
      <p className="mb-4" style={{ color: '#6b7280' }}>Count characters for different platforms with their limits</p>
      
      <textarea
        className="w-full p-3 rounded-lg mb-4 resize-none border border-opacity-30 focus:outline-none focus:ring-2"
        rows="4"
        placeholder="Paste your text here"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderColor: '#d1d5db',
          color: '#1f2937',
          focusRingColor: '#4a90e2'
        }}
      />
      
      <div className="mb-4">
        <select
          className="w-full p-2 rounded-lg border border-opacity-30 focus:outline-none focus:ring-2"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#d1d5db',
            color: '#1f2937',
            focusRingColor: '#4a90e2'
          }}
        >
          {Object.keys(platformLimits).map(platform => (
            <option key={platform} value={platform} style={{ background: '#ffffff', color: '#1f2937' }}>{platform}</option>
          ))}
        </select>
      </div>
      
      <div className="text-lg font-semibold" style={{
        color: isOverLimit ? '#ef4444' : '#10b981'
      }}>
        {charCount}/{limit} characters
        {isOverLimit && <span className="block text-sm font-normal" style={{ color: '#ef4444' }}>⚠️ Over limit by {charCount - limit}</span>}
      </div>
    </div>
  );
};

const HashtagCleaner = () => {
  const [inputTags, setInputTags] = useState('');
  const [cleanedTags, setCleanedTags] = useState('');
  const [copied, setCopied] = useState(false);

  const cleanHashtags = () => {
    const hashtags = inputTags
      .split(/[\s,\n]+/)
      .map(tag => tag.trim())
      .filter(tag => tag && tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
      .filter((tag, index, array) => array.indexOf(tag) === index)
      .join(' ');
    
    setCleanedTags(hashtags);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(cleanedTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl shadow-lg border border-opacity-30 p-6" style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
      borderColor: '#e5e7eb',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 15px rgba(22, 32, 89, 0.05)'
    }}>
      <div className="flex items-center mb-4">
        <Scissors className="h-6 w-6 mr-3" style={{ color: '#10b981' }} />
        <h3 className="text-xl font-bold" style={{ color: '#1f2937' }}>Hashtag Cleaner</h3>
      </div>
      <p className="mb-4" style={{ color: '#6b7280' }}>Remove duplicate hashtags and format properly</p>
      
      <textarea
        className="w-full p-3 rounded-lg mb-4 resize-none border border-opacity-30 focus:outline-none focus:ring-2"
        rows="3"
        placeholder="Paste your hashtags here"
        value={inputTags}
        onChange={(e) => setInputTags(e.target.value)}
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderColor: '#d1d5db',
          color: '#1f2937',
          focusRingColor: '#4a90e2'
        }}
      />
      
      <button
        onClick={cleanHashtags}
        className="w-full btn btn-primary mb-4"
      >
        Clean Hashtags
      </button>
      
      {cleanedTags && (
        <div className="space-y-3">
          <div className="p-3 rounded-lg border border-opacity-30" style={{
            background: 'rgba(248, 250, 252, 0.8)',
            borderColor: '#d1d5db'
          }}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-semibold" style={{ color: '#6b7280' }}>Clean Hashtags</span>
              <button
                onClick={copyToClipboard}
                className="flex items-center text-sm hover:opacity-80 transition-opacity"
                style={{ color: '#4a90e2' }}
              >
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p style={{ color: '#1f2937' }}>{cleanedTags}</p>
          </div>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            {cleanedTags.split(' ').length} unique hashtags
          </p>
        </div>
      )}
    </div>
  );
};

const BestPostingTimes = () => {
  const postingTimes = {
    Instagram: ['11AM-1PM', '7-9PM'],
    Facebook: ['9AM-12PM', '3-4PM'],
    TikTok: ['6-10PM', '12-2AM'],
    YouTube: ['2-4PM', '7-10PM'],
  };

  return (
    <div className="rounded-xl shadow-lg border border-opacity-30 p-6" style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
      borderColor: '#e5e7eb',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 15px rgba(22, 32, 89, 0.05)'
    }}>
      <div className="flex items-center mb-4">
        <Clock className="h-6 w-6 mr-3" style={{ color: '#a855f7' }} />
        <h3 className="text-xl font-bold" style={{ color: '#1f2937' }}>Best Posting Times</h3>
      </div>
      <p className="mb-6" style={{ color: '#6b7280' }}>Optimal times to post on different platforms</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(postingTimes).map(([platform, times]) => (
          <div key={platform} className="p-4 rounded-lg border border-opacity-30" style={{
            background: 'rgba(248, 250, 252, 0.8)',
            borderColor: '#d1d5db'
          }}>
            <h4 className="font-semibold mb-2" style={{ color: '#1f2937' }}>{platform}</h4>
            <div className="space-y-1">
              {times.map((time, index) => (
                <div key={index} className="text-sm px-2 py-1 rounded" style={{
                  color: '#1f2937',
                  background: 'rgba(22, 32, 89, 0.1)'
                }}>
                  {time}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs mt-4 text-center" style={{ color: '#6b7280' }}>
        * Times shown in EST. Adjust for your target audience timezone.
      </p>
    </div>
  );
};

const CreatorTools = () => {
  return (
    <section id="creator-tools" className="py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold mb-4" style={{ color: '#1f2937' }}>Free Creator Tools</h2>
          <p className="text-lg" style={{ color: '#6b7280' }}>Additional tools to help with your content creation</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CharacterCounter />
          <HashtagCleaner />
          <BestPostingTimes />
        </div>
      </div>
    </section>
  );
};

export default CreatorTools;
