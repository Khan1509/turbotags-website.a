import React from 'react';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="feature-card bg-gray-50 border border-gray-200 rounded-lg p-6 h-full">
      <div className="flex items-center mb-4">
        <div className="bg-tt-dark-violet text-white p-3 rounded-full mr-4">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
