import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Twitter, Facebook, Linkedin, Mail, MessageSquare, Send, Pocket, Printer, Link, Share2 } from 'lucide-react';
import { allServices, getShareUrls } from '../data/shareServices';

// Map string identifiers from data file to actual icon components
const iconComponents = {
  Twitter, Facebook, Linkedin, Mail, MessageSquare, Send, Pocket, Printer, Link, Share2
};

const ShareModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const shareUrls = getShareUrls();

  const filteredServices = useMemo(() => {
    if (!searchTerm) return allServices;
    return allServices.filter(service => 
      service.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  const handleShare = (id) => {
    if (id === 'copy') {
      navigator.clipboard.writeText('https://turbotags.app/');
      // Maybe show a toast here in the future
      onClose();
      return;
    }
    if (id === 'print') {
      window.print();
      onClose();
      return;
    }
    const url = shareUrls[id];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-bold text-tt-dark-violet">Share with friends</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </header>

            <div className="p-4 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors peer-focus:text-tt-dark-violet" />
                <input
                  type="text"
                  placeholder="Search for a service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="peer w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tt-dark-violet"
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto grow">
              <AnimatePresence>
                {filteredServices.length > 0 ? (
                  <motion.div 
                    layout
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                  >
                    {filteredServices.map(service => {
                      const Icon = iconComponents[service.icon];
                      if (!Icon) return null; // Safety check
                      return (
                        <motion.button
                          layout
                          key={service.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => handleShare(service.id)}
                          className="flex flex-col items-center justify-center text-center p-3 rounded-lg hover:bg-gray-100 transition-colors space-y-2"
                        >
                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: service.color }}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="text-xs font-medium text-gray-700">{service.name}</span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>No services found for "{searchTerm}".</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
