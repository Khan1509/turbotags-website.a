import React from 'react';
import { motion } from 'framer-motion';

const Ball = ({ className, initial, animate }) => (
  <motion.div
    className={`floating-balls absolute rounded-full mix-blend-multiply filter blur-2xl opacity-50 ${className}`}
    initial={initial}
    animate={animate}
    transition={{
      duration: Math.random() * 10 + 20,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'reverse',
    }}
  />
);

const FloatingBalls = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      <Ball
        className="w-72 h-72 bg-tt-medium-violet"
        initial={{ x: '-20%', y: '10%' }}
        animate={{ x: '100%', y: '80%' }}
      />
      <Ball
        className="w-64 h-64 bg-pink-400"
        initial={{ x: '80%', y: '0%' }}
        animate={{ x: '10%', y: '100%' }}
      />
      <Ball
        className="w-56 h-56 bg-yellow-300"
        initial={{ x: '50%', y: '110%' }}
        animate={{ x: '0%', y: '-20%' }}
      />
    </div>
  );
};

export default FloatingBalls;
