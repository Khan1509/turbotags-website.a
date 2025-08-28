import React, { useState } from 'react';
import { Copy, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { primaryServices, allServices, getShareUrls } from '../data/shareServices';
import ShareModal from './ShareModal';

const Share = () => {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const shareUrls = getShareUrls();

  const handleCopy = () => {
    navigator.clipboard.writeText('https://turbotags.app/');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const primaryButtons = allServices.filter(s => primaryServices.includes(s.id));

  return (
    <>
      <motion.section 
        className="bg-white p-6 rounded-xl shadow-md text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-tt-dark-violet mb-2">
          If you enjoy the website, please consider sharing it with your friends.
        </h3>
        <p className="text-gray-600 mb-6">Thank you! Your support helps us grow and keep the tool free for everyone. 🙏</p>
        
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mb-6">
          {primaryButtons.map((social) => (
            <a
              key={social.id}
              href={shareUrls[social.id]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-3 rounded-full text-white transition-transform hover:scale-110"
              style={{ backgroundColor: social.color }}
              aria-label={`Share on ${social.name}`}
            >
              <social.icon className="h-5 w-5" />
            </a>
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center p-3 rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 transition-transform hover:scale-110"
            aria-label="Show more sharing options"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              readOnly
              value="https://turbotags.app/"
              className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 pl-4 pr-20 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-tt-dark-violet"
              aria-label="Shareable link"
            />
            <button
              onClick={handleCopy}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-tt-dark-violet text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-tt-medium-violet transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            >
              <Copy className="h-4 w-4 inline-block mr-1" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </motion.section>
      <ShareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Share;
