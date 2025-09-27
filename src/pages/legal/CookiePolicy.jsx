import React from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../../hooks/usePageMeta';

const CookiePolicy = () => {
  usePageMeta(
    'Cookie Policy - TurboTags: How We Use Cookies',
    'TurboTags Cookie Policy: Learn about our minimal cookie usage for essential functionality. We use only necessary cookies for the best user experience.'
  );
  return (
    <main className="container mx-auto max-w-4xl p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4" style={{color: '#475569'}}>Cookie Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: July 11, 2025</p>
        
        <div className="space-y-6 text-gray-700">
          <h2 className="text-2xl font-bold pt-4" style={{color: '#475569'}}>What Are Cookies</h2>
          <p>As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.</p>
          
          <h2 className="text-2xl font-bold pt-4" style={{color: '#475569'}}>How We Use Cookies</h2>
          <p>We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>

          <h2 className="text-2xl font-bold pt-4" style={{color: '#475569'}}>Disabling Cookies</h2>
          <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore it is recommended that you do not disable cookies.</p>
        </div>
        <div className="text-center mt-12">
            <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    </main>
  );
};

export default CookiePolicy;
