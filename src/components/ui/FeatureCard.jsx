import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.div 
      className="feature-card bg-gray-50 border border-gray-200 rounded-lg p-6 h-full"
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center mb-4">
        <div className="bg-tt-dark-violet text-white p-3 rounded-full mr-4">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
