import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.div 
      className="card-modern p-6 h-full group cursor-pointer"
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-tt-dark-violet to-tt-medium-violet text-white p-3 rounded-xl mr-4 group-hover:from-tt-medium-violet group-hover:to-tt-light-violet transition-all duration-300 shadow-lg">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-tt-dark-violet transition-colors duration-300">{title}</h3>
      </div>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
