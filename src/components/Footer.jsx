import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Heart, Twitter, Linkedin, Link2 } from 'lucide-react';
import LinkToUsModal from './LinkToUsModal';

const Footer = () => {
  const contactEmail = 'mailto:helloturbotags@gmail.com';
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  return (
    <>
      <footer className="text-center text-brand-medium-grey text-sm mt-8 border-t border-gray-200 pt-8 pb-8 container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div>
            <h3 className="font-bold mb-4 flex items-center" style={{
              background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              <img src="/favicon_darknavy_thick.svg" alt="TurboTags Logo" className="w-6 h-6 mr-2" />
              TurboTags
            </h3>
            <p className="text-xs text-brand-medium-grey leading-relaxed">
              The #1 FREE AI-Powered Tags & Hashtags Generator for YouTube, Instagram, TikTok & Facebook.
            </p>
            <p className="text-xs text-brand-medium-grey mt-2 flex items-center">
              Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for creators
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{
              background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Quick Links</h4>
            <ul className="space-y-2 text-xs" role="list">
              <li><Link to="/" className="text-brand-medium-grey hover:text-brand-blue transition focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-1 py-1">Home</Link></li>
              <li><Link to="/about" className="text-brand-medium-grey hover:text-brand-blue transition focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-1 py-1">About Us</Link></li>
              <li><Link to="/features" className="text-brand-medium-grey hover:text-brand-blue transition focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-1 py-1">Features</Link></li>
              <li><Link to="/blog" className="text-brand-medium-grey hover:text-brand-blue transition focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-1 py-1">Blog</Link></li>
              <li><Link to="/faq" className="text-brand-medium-grey hover:text-brand-blue transition focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-1 py-1">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{
              background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Legal</h4>
            <ul className="space-y-2 text-xs" role="list">
              <li><Link to="/legal/privacy" className="text-brand-medium-grey hover:text-brand-blue transition focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-1 py-1">Privacy Policy</Link></li>
              <li><Link to="/legal/terms" className="text-brand-medium-grey hover:text-brand-blue transition focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-1 py-1">Terms of Service</Link></li>
              <li><Link to="/legal/disclaimer" className="text-brand-medium-grey hover:text-brand-blue transition focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-1 py-1">Disclaimer</Link></li>
              <li><Link to="/legal/cookies" className="text-brand-medium-grey hover:text-brand-blue transition focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-1 py-1">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{
              background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Connect & Support</h4>
            <ul className="space-y-3 text-xs" role="list">
              <li><a href={contactEmail} className="text-brand-medium-grey hover:text-brand-blue transition flex items-center focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-1 py-1"><Mail className="h-4 w-4 mr-2" />Contact Support</a></li>
              <li><a href="https://twitter.com/TurboTagsApp" target="_blank" rel="noopener noreferrer" className="text-brand-medium-grey hover:text-brand-blue transition flex items-center focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-1 py-1"><Twitter className="h-4 w-4 mr-2" />Follow on Twitter</a></li>
              <li><a href="https://www.linkedin.com/in/turbotags-support-173b0a375" target="_blank" rel="noopener noreferrer" className="text-brand-medium-grey hover:text-brand-blue transition flex items-center focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-1 py-1"><Linkedin className="h-4 w-4 mr-2" />Connect on LinkedIn</a></li>
              <li className="pt-2">
                <a href="https://ko-fi.com/turbotags1509" target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
                  <Heart className="h-4 w-4 mr-2" /> Support Us on Ko-fi
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <button onClick={() => setIsLinkModalOpen(true)} className="text-xs text-gray-500 hover:text-brand-blue transition flex items-center justify-center mx-auto mb-4 focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-1 py-1">
            <Link2 className="h-3 w-3 mr-1" /> Link to Us
          </button>
          <p className="mb-2 text-xs">&copy; {new Date().getFullYear()} TurboTags. All rights reserved.</p>
          <p className="text-sm" style={{
            background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            <span className="font-semibold">Powered by AI</span>
            <span className="mx-2">•</span>
            <Link to="/legal/disclaimer" className="underline hover:text-brand-blue transition focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-1 py-1" style={{
              background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Legal Disclaimer</Link>
          </p>
        </div>
      </footer>
      <LinkToUsModal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} />
    </>
  );
};

export default Footer;
