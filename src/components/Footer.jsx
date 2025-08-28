import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Heart, Twitter, Linkedin, Link2 } from 'lucide-react';
import LinkToUsModal from './LinkToUsModal';

const Footer = () => {
  const contactEmail = 'mailto:helloturbotags@gmail.com';
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  return (
    <>
      <footer className="text-center text-gray-700 text-sm mt-8 border-t border-gray-200 pt-8 pb-8 container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <img src="/favicon.svg" alt="TurboTags Logo" className="w-6 h-6 mr-2" />
              TurboTags
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              The #1 FREE AI-Powered Tags & Hashtags Generator for YouTube, Instagram, TikTok & Facebook.
            </p>
            <p className="text-xs text-gray-600 mt-2 flex items-center">
              Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for creators
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs" role="list">
              <li><Link to="/" className="text-gray-600 hover:text-tt-dark-violet transition focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-md px-1 py-1" aria-label="Go to homepage">Home</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-tt-dark-violet transition focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-md px-1 py-1" aria-label="Learn about TurboTags company">About Us</Link></li>
              <li><Link to="/features" className="text-gray-600 hover:text-tt-dark-violet transition focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-md px-1 py-1" aria-label="Explore TurboTags features and benefits">Features</Link></li>
               <li><Link to="/blog" className="text-gray-600 hover:text-tt-dark-violet transition focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-md px-1 py-1" aria-label="Read our blog for creator tips">Blog</Link></li>
              <li><Link to="/#faq" className="text-gray-600 hover:text-tt-dark-violet transition focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-md px-1 py-1" aria-label="Read Frequently Asked Questions">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Legal</h4>
            <ul className="space-y-2 text-xs" role="list">
              <li><Link to="/legal#privacy" className="text-gray-600 hover:text-tt-dark-violet transition focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-md px-1 py-1" aria-label="Read TurboTags privacy policy">Privacy Policy</Link></li>
              <li><Link to="/legal#terms" className="text-gray-600 hover:text-tt-dark-violet transition focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-md px-1 py-1" aria-label="Read TurboTags terms of service">Terms of Service</Link></li>
              <li><Link to="/legal#disclaimer" className="text-gray-600 hover:text-tt-dark-violet transition focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-md px-1 py-1" aria-label="Read TurboTags legal disclaimer">Legal Disclaimer</Link></li>
              <li><Link to="/legal#cookies" className="text-gray-600 hover:text-tt-dark-violet transition focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-md px-1 py-1" aria-label="Read TurboTags cookie policy">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Connect & Support</h4>
            <ul className="space-y-3 text-xs" role="list">
              <li><a href={contactEmail} className="text-gray-600 hover:text-tt-dark-violet transition flex items-center focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-md px-1 py-1" aria-label="Send email to TurboTags support team"><Mail className="h-4 w-4 mr-2" aria-hidden="true" />Contact Support</a></li>
              <li><a href="https://twitter.com/TurboTagsApp" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-tt-dark-violet transition flex items-center focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-md px-1 py-1" aria-label="Follow TurboTags on Twitter - Opens in new tab"><Twitter className="h-4 w-4 mr-2" aria-hidden="true" />Follow on Twitter</a></li>
              <li><a href="https://www.linkedin.com/in/turbotags-support-173b0a375" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-tt-dark-violet transition flex items-center focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-md px-1 py-1" aria-label="Connect with TurboTags on LinkedIn - Opens in new tab"><Linkedin className="h-4 w-4 mr-2" aria-hidden="true" />Connect on LinkedIn</a></li>
              <li className="pt-2">
                <a href="https://ko-fi.com/turbotags1509" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-pink-100 text-pink-700 font-bold hover:bg-pink-200 transition w-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2" aria-label="Support TurboTags on Ko-fi - Opens in new tab">
                  <Heart className="h-4 w-4 mr-2" aria-hidden="true" /> Support Us on Ko-fi
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <button onClick={() => setIsLinkModalOpen(true)} className="text-xs text-gray-500 hover:text-tt-dark-violet transition flex items-center justify-center mx-auto mb-4 focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-md px-1 py-1">
            <Link2 className="h-3 w-3 mr-1" /> Link to Us
          </button>
          <p className="mb-2 text-xs">&copy; {new Date().getFullYear()} TurboTags. All rights reserved.</p>
          <p className="text-xs text-gray-500">
            Powered by AI
            <span className="mx-2">•</span>
            <Link to="/legal#disclaimer" className="hover:text-tt-dark-violet transition focus:outline-none focus:ring-2 focus:ring-tt-dark-violet rounded-md px-1 py-1" aria-label="Read our legal disclaimer">Legal Disclaimer</Link>
          </p>
        </div>
      </footer>
      <LinkToUsModal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} />
    </>
  );
};

export default Footer;
