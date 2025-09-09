import React from 'react';
import { Check, Star } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    features: [
      '5 AI Generations per day',
      'Basic Tag & Hashtag Suggestions',
      'Standard Support',
    ],
    buttonText: 'Current Plan',
    isCurrent: true,
  },
  {
    name: 'Pro',
    price: '$9',
    features: [
      '100 AI Generations per day',
      'Advanced AI Suggestions',
      'Content Creation Suite',
      'Analytics Dashboard',
      'Priority Support',
    ],
    buttonText: 'Upgrade to Pro',
    isPopular: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    features: [
      'Unlimited AI Generations',
      'Team Collaboration Tools',
      'Dedicated Account Manager',
      'Custom API Access',
      '24/7 Premium Support',
    ],
    buttonText: 'Contact Sales',
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-12 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-tt-dark-violet">Find the Plan That's Right for You</h2>
          <p className="text-lg text-gray-600 mt-2">Start for free, then upgrade to unlock powerful new features.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-2xl p-8 shadow-lg border relative ${tier.isPopular ? 'border-tt-primary' : 'border-gray-200'}`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-tt-primary text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-center text-gray-800">{tier.name}</h3>
              <p className="text-4xl font-bold text-center my-4 text-tt-dark-violet">{tier.price}<span className="text-base font-normal text-gray-500">{tier.price.startsWith('$') && '/mo'}</span></p>
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full btn ${tier.isCurrent ? 'btn-accent' : 'btn-primary'}`}
                disabled={tier.isCurrent}
              >
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
