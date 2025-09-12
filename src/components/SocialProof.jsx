import React from 'react';
import { Star } from 'lucide-react';
import OptimizedImage from './ui/OptimizedImage';

const testimonials = [
  {
    name: 'Alex R.',
    role: 'YouTube Creator',
    quote: "TurboTags is a game-changer. My video views have doubled since I started using their AI for titles and tags. Can't recommend it enough!",
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
  },
  {
    name: 'Jessica L.',
    role: 'Instagram Influencer',
    quote: "Finding the right hashtags used to take hours. Now, I get a perfectly optimized list in seconds. My engagement has never been better.",
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e'
  },
  {
    name: 'David C.',
    role: 'Small Business Owner',
    quote: "As a small business, getting seen on social media is tough. TurboTags gives me the SEO edge I need to compete with bigger brands.",
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f'
  },
];

const SocialProof = () => {
  return (
    <section id="testimonials" className="py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-tt-dark-violet">Loved by Creators Worldwide</h2>
          <p className="text-lg text-gray-600 mt-2">Don't just take our word for it. Here's what our users are saying.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6 flex-grow">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <OptimizedImage 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4" 
                  width={48} 
                  height={48}
                  loading="lazy"
                />
                <div>
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
