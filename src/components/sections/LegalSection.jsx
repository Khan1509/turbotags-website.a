import React, { useState } from 'react';
import { FileText, ShieldCheck, AlertTriangle, Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const legalData = {
  terms: {
    icon: FileText,
    title: 'Terms of Service',
    content: (
      <div className="space-y-4">
        <p>By accessing or using our website, https://turbotags.app (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.</p>
        <p>The Service is provided "AS IS" and "AS AVAILABLE". We do not guarantee the accuracy, relevance, or effectiveness of the generated content. You agree to use the Service only for lawful purposes and are prohibited from using it to generate hateful, defamatory, or otherwise objectionable content.</p>
        <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
      </div>
    ),
  },
  privacy: {
    icon: ShieldCheck,
    title: 'Privacy Policy',
    content: (
      <div className="space-y-4">
        <p>Our core principle is to collect as little information as possible. We do not require an account, and we do not store or log the prompts you enter after your request is completed. Your creative ideas remain your own.</p>
        <p>We use privacy-focused analytics (Google Analytics) to collect anonymous, aggregated data about website traffic to improve the service. This data is not tied to any individual user.</p>
        <p>Our tag generation is powered by the OpenRouter API. We send your prompt to their service for processing. We are not responsible for their privacy practices but have chosen them for their commitment to robust data handling.</p>
      </div>
    ),
  },
  disclaimer: {
    icon: AlertTriangle,
    title: 'Disclaimer',
    content: (
      <div className="space-y-4">
        <p>The information and tools provided by TurboTags are for general informational and educational purposes only. All information on the Site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, or completeness of any information or generated content.</p>
        <p><strong>The use of our tools does not guarantee any specific outcomes, such as virality, increased views, or follower growth.</strong> Your success is dependent on numerous factors outside of our control, including your content quality and platform algorithms.</p>
        <p>UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED. YOUR USE OF THE SITE IS SOLELY AT YOUR OWN RISK.</p>
      </div>
    ),
  },
  cookies: {
    icon: Cookie,
    title: 'Cookie Policy',
    content: (
      <div className="space-y-4">
        <p>As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience.</p>
        <p>We use cookies for a variety of reasons. Primarily, we use a single, essential cookie to remember your choice on our cookie consent banner. We also use cookies for anonymous analytics via Google Analytics to help us understand how visitors use the site.</p>
        <p>You can prevent the setting of cookies by adjusting the settings on your browser. However, be aware that disabling cookies may affect the functionality of this site.</p>
      </div>
    ),
  },
};

const LegalSection = () => {
  const [activeTab, setActiveTab] = useState('privacy');

  return (
    <section id="legal" className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
      <div className="text-center mb-8">
        {/* SEO: Changed from h1 to h2 for correct semantic structure. */}
        <h2 className="text-4xl font-extrabold text-tt-dark-violet">Legal Information</h2>
        <p className="text-lg text-gray-600 mt-2">Our commitment to transparency.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible -mx-4 px-4 md:mx-0 md:px-0 border-b md:border-b-0 md:border-r border-gray-200 md:pr-8">
          {Object.entries(legalData).map(([key, { icon: Icon, title }]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center text-left p-4 rounded-lg w-full md:w-56 transition-colors duration-200 flex-shrink-0 ${
                activeTab === key
                  ? 'bg-tt-dark-violet/10 text-tt-dark-violet'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="font-semibold">{title}</span>
            </button>
          ))}
        </div>

        <div className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-gray-700 leading-relaxed"
            >
              <h3 className="text-2xl font-bold text-tt-dark-violet mb-4">{legalData[activeTab].title}</h3>
              {legalData[activeTab].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default LegalSection;
