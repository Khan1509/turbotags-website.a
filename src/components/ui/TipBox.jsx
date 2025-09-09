import React from 'react';
import { motion } from 'framer-motion';

const TipBox = ({ tip }) => {
  return (
    <motion.div
      className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-r-lg"
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <p className="text-sm">{tip}</p>
    </motion.div>
  );
};

export default TipBox;
