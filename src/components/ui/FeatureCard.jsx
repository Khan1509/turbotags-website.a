import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate 3D tilt effect
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 degrees
    const rotateY = ((x - centerX) / centerX) * 10;  // Max 10 degrees
    
    setMousePosition({ x, y });
    setRotateX(rotateX);
    setRotateY(rotateY);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="perspective">
      <motion.div 
        ref={cardRef}
        className="glass p-6 h-full group cursor-pointer relative overflow-hidden rounded-xl will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          y: isHovered ? -8 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 30,
          duration: 0.6
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Enhanced spotlight effect with depth */}
        {isHovered && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: mousePosition.x - 200,
              top: mousePosition.y - 200,
              width: 400,
              height: 400,
              background: 'radial-gradient(circle, rgba(34, 211, 238, 0.12) 0%, rgba(79, 70, 229, 0.08) 30%, rgba(124, 58, 237, 0.05) 60%, transparent 80%)',
              borderRadius: '50%',
              filter: 'blur(25px)',
              transform: 'translate3d(0,0,20px)', // Depth with GPU acceleration
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        )}
        
        {/* Glass morphism overlay on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl border"
          style={{
            borderColor: 'rgba(34, 211, 238, 0.3)',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(34, 211, 238, 0.03))',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      
        <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
          <div className="flex items-center mb-4">
            <motion.div 
              className="p-3 rounded-xl mr-4 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-2))',
                boxShadow: '0 8px 25px rgba(79, 70, 229, 0.25), 0 4px 12px rgba(124, 58, 237, 0.15)'
              }}
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotateY: isHovered ? 8 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <Icon className="h-6 w-6 text-white relative z-10" />
              {/* Icon glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <h3 className="text-xl font-bold text-white group-hover:text-gradient transition-all duration-300">
              {title}
            </h3>
          </div>
          <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default FeatureCard;
