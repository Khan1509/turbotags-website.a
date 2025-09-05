import React from 'react';
import { motion } from 'framer-motion';

const Ball = ({ className, initial, animate, duration }) => (
  <motion.div
    className={`floating-balls absolute rounded-full mix-blend-multiply filter blur-2xl ${className}`}
    initial={initial}
    animate={animate}
    transition={{
      duration: duration,
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
        className="w-72 h-72 bg-tt-medium-violet/60"
        initial={{ x: '-20%', y: '10%' }}
        animate={{ x: '100%', y: '80%' }}
        duration={25}
      />
      <Ball
        className="w-64 h-64 bg-tt-light-violet/60"
        initial={{ x: '80%', y: '0%' }}
        animate={{ x: '10%', y: '100%' }}
        duration={30}
      />
      <Ball
        className="w-56 h-56 bg-indigo-300/60"
        initial={{ x: '50%', y: '110%' }}
        animate={{ x: '0%', y: '-20%' }}
        duration={20}
      />
    </div>
  );
};

export default FloatingBalls;
