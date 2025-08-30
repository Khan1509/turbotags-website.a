import React from 'react';
import { motion } from 'framer-motion';

const NativeAd = () => {
  return (
    <motion.section 
      className="bg-white p-4 rounded-xl shadow-md flex justify-center items-center min-h-[100px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      aria-label="Advertisement"
    >
      <div id="container-76ad2d657c0bad206fb65b55401e0e8f"></div>
    </motion.section>
  );
};

export default NativeAd;
