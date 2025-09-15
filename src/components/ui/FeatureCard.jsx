import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  return (
    <motion.div 
      ref={cardRef}
      className="card-modern p-6 h-full group cursor-pointer relative overflow-hidden"
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight effect */}
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: mousePosition.x - 150,
            top: mousePosition.y - 150,
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            transform: 'translate3d(0,0,0)', // Force GPU acceleration
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-r from-tt-dark-violet to-tt-medium-violet text-white p-3 rounded-xl mr-4 group-hover:from-tt-medium-violet group-hover:to-tt-light-violet transition-all duration-300 shadow-lg">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-tt-dark-violet transition-colors duration-300">{title}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
