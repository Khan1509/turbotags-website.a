import React from 'react';

const Testimonial = () => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Rated 4.9/5 by 50,000+ Users</h2>
      <div className="bg-gray-50 p-8 rounded-xl text-center max-w-4xl mx-auto">
        <blockquote className="text-xl italic text-gray-700 mb-4">
          "TurboTags has revolutionized my content creation process. The AI-generated tags are spot-on and have significantly increased my reach across all platforms."
        </blockquote>
        <div className="font-bold text-tt-dark-violet">- Sarah M., Content Creator</div>
      </div>
    </section>
  );
};

export default Testimonial;
