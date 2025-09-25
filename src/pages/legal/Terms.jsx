import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import usePageMeta from '../../hooks/usePageMeta';

const Terms = () => {
  usePageMeta(
    'Terms of Service - TurboTags: Usage Guidelines & Rights',
    'TurboTags Terms of Service: Learn about proper usage, user responsibilities, and our service terms. Free AI hashtag generator terms and conditions.'
  );
  return (
    <main className="container mx-auto max-w-4xl p-6 py-10">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center border-b pb-4 mb-8">
            <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-tt-dark-violet mb-2">Terms of Service</h1>
            <p className="text-gray-500">Last updated: July 11, 2025</p>
        </div>
        
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-tt-dark-violet mb-3">1. Agreement to Terms</h2>
            <p>By accessing or using our website, https://turbotags.app (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-tt-dark-violet mb-3">2. Description of Service</h2>
            <p>TurboTags provides a free, AI-powered tag and hashtag generator. The Service is provided "AS IS" and "AS AVAILABLE". We do not guarantee the accuracy, relevance, or effectiveness of the generated content. For more information, please see our <Link to="/legal/disclaimer" className="text-tt-medium-violet hover:underline font-medium">Disclaimer</Link>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-tt-dark-violet mb-3">3. User Conduct and Responsibilities</h2>
            <p>You agree to use the Service only for lawful purposes. You are solely responsible for the content you generate and how you use it. You are prohibited from using the Service:</p>
            <ul className="list-disc list-inside space-y-2 pl-4 mt-2">
              <li>In any way that violates any applicable national or international law or regulation.</li>
              <li>To generate content that is hateful, defamatory, obscene, or otherwise objectionable.</li>
              <li>To input any sensitive personal information (e.g., social security numbers, financial information) into the generator.</li>
              <li>To engage in any activity that could damage, disable, or overburden the Service, such as sending automated queries.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-tt-dark-violet mb-3">4. Intellectual Property</h2>
            <p>The Service and its original content (excluding user-generated content), features, and functionality are and will remain the exclusive property of TurboTags. The content you generate using the Service is yours to use, but we retain no ownership or liability for it. Our trademarks may not be used without prior written consent.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-tt-dark-violet mb-3">5. Limitation of Liability</h2>
            <p>In no event shall TurboTags be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of the Service. Your use of the Service is at your sole risk.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-tt-dark-violet mb-3">6. Termination</h2>
            <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-tt-dark-violet mb-3">7. Changes to Terms</h2>
            <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page and updating the "Last updated" date.</p>
          </section>
        </div>
        <div className="text-center mt-12 pt-6 border-t">
            <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    </main>
  );
};

export default Terms;
