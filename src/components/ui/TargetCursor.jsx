import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TargetCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if custom cursor is supported (desktop with fine pointer)
    const hasFinePonter = window.matchMedia('(pointer: fine)').matches;
    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth >= 1024;
    
    const supported = hasFinePonter && !hasReducedMotion && isDesktop;
    setIsSupported(supported);
    
    // Manage body cursor class
    if (supported) {
      document.body.classList.add('has-custom-cursor');
    } else {
      document.body.classList.remove('has-custom-cursor');
    }
    
    if (!isSupported && !hasFinePonter) {
      return;
    }

    const updateMousePosition = (e) => {
      requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };

    const handleMouseEnter = (e) => {
      const target = e.target;
      const isInteractive = target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer, .btn');
      setIsHovering(!!isInteractive);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };
    
    const handleMouseDown = () => {
      setIsClicking(true);
    };
    
    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      // Clean up cursor class
      document.body.classList.remove('has-custom-cursor');
    };
  }, [isSupported]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="cursor-3d">
      {/* Indigo center dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.2 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
      >
        <motion.div
          className="w-3 h-3 rounded-full shadow-lg"
          style={{ 
            backgroundColor: '#a78bfa', // indigo-300 for visibility
            boxShadow: '0 0 12px rgba(167, 139, 250, 0.6)'
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Cyan ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
        }}
        animate={{
          scale: isClicking ? 0.6 : isHovering ? 1.6 : 1.0,
          opacity: isHovering ? 0.8 : 0.25,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        <motion.div
          className="w-10 h-10 rounded-full border-2"
          style={{ 
            borderColor: '#22d3ee',
            background: 'radial-gradient(circle, transparent 60%, rgba(34, 211, 238, 0.1) 100%)',
            filter: 'blur(0.5px)'
          }}
          animate={{
            rotate: [0, -360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
      
      {/* Outer glow on hover */}
      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997]"
          style={{
            x: mousePosition.x - 30,
            y: mousePosition.y - 30,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            duration: 0.2,
          }}
        >
          <div
            className="w-15 h-15 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default TargetCursor;
