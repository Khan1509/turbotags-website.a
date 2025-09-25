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
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <Hash className="h-6 w-6 text-blue-500 mr-3" />
        <h3 className="text-xl font-bold">Character Counter</h3>
      </div>
      <p className="text-gray-600 mb-4">Count characters for different platforms with their limits</p>
      
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none"
        rows="4"
        placeholder="Paste your text here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <div className="mb-4">
        <select
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
        >
          {Object.keys(platformLimits).map(platform => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>
      </div>
      
      <div className={`text-lg font-semibold ${isOverLimit ? 'text-red-500' : 'text-green-500'}`}>
        {charCount}/{limit} characters
        {isOverLimit && <span className="block text-sm font-normal">⚠️ Over limit by {charCount - limit}</span>}
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
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <Scissors className="h-6 w-6 text-green-500 mr-3" />
        <h3 className="text-xl font-bold">Hashtag Cleaner</h3>
      </div>
      <p className="text-gray-600 mb-4">Remove duplicate hashtags and format properly</p>
      
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none"
        rows="3"
        placeholder="Paste your hashtags here"
        value={inputTags}
        onChange={(e) => setInputTags(e.target.value)}
      />
      
      <button
        onClick={cleanHashtags}
        className="w-full btn btn-primary mb-4"
      >
        Clean Hashtags
      </button>
      
      {cleanedTags && (
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-semibold text-gray-700">Clean Hashtags</span>
              <button
                onClick={copyToClipboard}
                className="flex items-center text-blue-500 hover:text-blue-600 text-sm"
              >
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-gray-800">{cleanedTags}</p>
          </div>
          <p className="text-sm text-gray-600">
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
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <Clock className="h-6 w-6 text-purple-500 mr-3" />
        <h3 className="text-xl font-bold">Best Posting Times</h3>
      </div>
      <p className="text-gray-600 mb-6">Optimal times to post on different platforms</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(postingTimes).map(([platform, times]) => (
          <div key={platform} className="p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-2">{platform}</h4>
            <div className="space-y-1">
              {times.map((time, index) => (
                <div key={index} className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                  {time}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
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
          <h2 className="text-3xl font-extrabold mb-4">Free Creator Tools</h2>
          <p className="text-lg text-gray-600">Additional tools to help with your content creation</p>
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
