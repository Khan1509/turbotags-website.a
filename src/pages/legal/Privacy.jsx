import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import usePageMeta from '../../hooks/usePageMeta';

const Privacy = () => {
  usePageMeta(
    'Privacy Policy - TurboTags: Your Data Protection Rights',
    'Read TurboTags Privacy Policy. We collect minimal data, no personal info required, and protect your prompts. Learn about our privacy-first approach to AI generation.'
  );
  return (
    <main className="container mx-auto max-w-4xl p-6 py-10">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center border-b pb-4 mb-8">
          <ShieldCheck className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-tt-dark-violet mb-2">Privacy Policy</h1>
          <p className="text-gray-500">Last updated: July 11, 2025</p>
        </div>
        
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p className="text-lg">TurboTags ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you visit our website https://turbotags.app (the "Site"). <strong>Our core principle is to collect as little information as possible.</strong></p>
          
          <section>
            <h2 className="text-2xl font-bold text-tt-dark-violet mb-3">1. Information We Collect (and Don't Collect)</h2>
            <p className="mb-2">We have designed our service to be used without the need for personal data.</p>
            <ul className="list-disc list-inside space-y-3 pl-4">
              <li>
                <strong>Prompt Information:</strong> We collect the text prompt you enter into our generator. This information is sent to our third-party AI provider (OpenRouter) to generate your tags. <strong>We do not log, store, or associate this prompt with you in any way after the request is completed.</strong> Your creative ideas remain your own.
              </li>
              <li>
                <strong>Personal Information:</strong> We do not require you to create an account, and therefore we do not collect any personal information like your name, email address, or IP address.
              </li>
              <li>
                <strong>Analytics Data:</strong> We use privacy-focused analytics (Google Analytics) to collect anonymous, aggregated data about website traffic, such as which pages are visited most often. This helps us improve the service. This data is not tied to any individual user.
              </li>
              <li>
                <strong>Cookies:</strong> We use a single, essential cookie to remember your choice on our cookie consent banner. That's it. For more details, please see our <Link to="/legal/cookies" className="text-tt-medium-violet hover:underline font-medium">Cookie Policy</Link>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-tt-dark-violet mb-3">2. How We Use Information</h2>
            <p>The limited information we process is used exclusively for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>To operate and maintain the functionality of our Site.</li>
              <li>To provide the core service of generating tags and hashtags from your input.</li>
              <li>To monitor and analyze anonymous usage data to improve the Site's performance and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-tt-dark-violet mb-3">3. Third-Party Services</h2>
            <p>Our tag generation is powered by the OpenRouter API. We send your prompt to their service for processing. We are not responsible for the privacy practices of third-party services, but we have chosen them for their commitment to robust data handling. We encourage you to review their policies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-tt-dark-violet mb-3">4. Data Security</h2>
            <p>We use administrative and technical security measures (like HTTPS) to protect data in transit. Since we do not store your prompts or personal data, the risk of a data breach is minimized.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-tt-dark-violet mb-3">5. Children's Privacy</h2>
            <p>Our services are not directed at children under the age of 13. We do not knowingly collect any information from children.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-tt-dark-violet mb-3">6. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. The updated version will be indicated by the "Last updated" date at the top. We encourage you to review this policy periodically.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-tt-dark-violet mb-3">7. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at: <a href="mailto:helloturbotags@gmail.com" className="text-tt-medium-violet hover:underline font-medium">helloturbotags@gmail.com</a></p>
          </section>
        </div>
        
        <div className="text-center mt-12 pt-6 border-t">
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
