import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Heart, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const contactEmail = 'mailto:helloturbotags@gmail.com';

  return (
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
          <ul className="space-y-2 text-xs">
            <li><Link to="/#home" className="text-gray-600 hover:text-tt-dark-violet transition">Home</Link></li>
            <li><Link to="/about" className="text-gray-600 hover:text-tt-dark-violet transition">About Us</Link></li>
            <li><Link to="/#why-choose" className="text-gray-600 hover:text-tt-dark-violet transition">Features</Link></li>
            <li><Link to="/blog" className="text-gray-600 hover:text-tt-dark-violet transition">Blog</Link></li>
            <li><Link to="/#tag-generator" className="text-gray-600 hover:text-tt-dark-violet transition">Generator</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-4">Legal</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/legal/privacy" className="text-gray-600 hover:text-tt-dark-violet transition">Privacy Policy</Link></li>
            <li><Link to="/legal/terms" className="text-gray-600 hover:text-tt-dark-violet transition">Terms of Service</Link></li>
            <li><Link to="/legal/disclaimer" className="text-gray-600 hover:text-tt-dark-violet transition">Disclaimer</Link></li>
            <li><Link to="/legal/cookies" className="text-gray-600 hover:text-tt-dark-violet transition">Cookie Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-4">Connect & Support</h4>
          <ul className="space-y-3 text-xs">
            <li><a href={contactEmail} className="text-gray-600 hover:text-tt-dark-violet transition flex items-center"><Mail className="h-4 w-4 mr-2" />Contact Us</a></li>
            <li><a href="https://twitter.com/TurboTagsApp" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-tt-dark-violet transition flex items-center"><Twitter className="h-4 w-4 mr-2" />Twitter</a></li>
            <li><a href="https://www.linkedin.com/in/turbotags-support-173b0a375" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-tt-dark-violet transition flex items-center"><Linkedin className="h-4 w-4 mr-2" />LinkedIn</a></li>
            <li className="pt-2">
              <a href="https://ko-fi.com/turbotags1509" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-pink-100 text-pink-700 font-bold hover:bg-pink-200 transition w-full">
                <Heart className="h-4 w-4 mr-2" /> Support Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <p className="mb-2 text-xs">&copy; {new Date().getFullYear()} TurboTags. All rights reserved.</p>
        <p className="text-xs text-gray-500">
          Powered by AI
          <span className="mx-2">•</span>
          <Link to="/legal/disclaimer" className="hover:text-tt-dark-violet transition">Legal Disclaimer</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
