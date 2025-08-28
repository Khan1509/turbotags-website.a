import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';

const CodeBlock = ({ title, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
      <div className="relative bg-gray-100 p-4 rounded-lg text-sm font-mono text-gray-800 border border-gray-200">
        <pre><code>{code}</code></pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded-md bg-white hover:bg-gray-200 transition-colors"
          aria-label={`Copy ${title}`}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-600" />}
        </button>
      </div>
    </div>
  );
};

const LinkToUsModal = ({ isOpen, onClose }) => {
  const htmlCode = `<a href="https://turbotags.app" title="TurboTags - AI Hashtag Generator">TurboTags - AI Hashtag Generator</a>`;
  const markdownCode = `[TurboTags - AI Hashtag Generator](https://turbotags.app)`;

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
            className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-bold text-tt-dark-violet">Link to Us</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </header>

            <div className="p-6 overflow-y-auto grow space-y-6">
              <p className="text-gray-600">
                Love TurboTags? Help us spread the word by adding a link to your website or blog. It's one of the best ways to support us!
              </p>
              <CodeBlock title="HTML Code" code={htmlCode} />
              <CodeBlock title="Markdown Code" code={markdownCode} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LinkToUsModal;
