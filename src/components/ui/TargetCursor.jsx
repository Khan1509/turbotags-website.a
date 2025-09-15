import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TargetCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e) => {
      // Check if we're hovering over interactive elements
      const target = e.target;
      const isInteractive = target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer');
      setIsHovering(!!isInteractive);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    // Add mouse move listener
    window.addEventListener('mousemove', updateMousePosition);
    
    // Add hover listeners to detect interactive elements
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      >
        <div className="w-4 h-4 bg-white rounded-full" />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
        }}
        animate={{
          scale: isHovering ? 2 : 1,
          opacity: isHovering ? 0.8 : 0.3,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
      >
        <div className="w-10 h-10 border-2 border-purple-500 rounded-full" />
      </motion.div>

      {/* Crosshair lines */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          x: mousePosition.x - 15,
          y: mousePosition.y - 1,
        }}
        animate={{
          opacity: isHovering ? 1 : 0.5,
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        <div className="w-8 h-0.5 bg-purple-500" />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          x: mousePosition.x - 1,
          y: mousePosition.y - 15,
        }}
        animate={{
          opacity: isHovering ? 1 : 0.5,
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        <div className="w-0.5 h-8 bg-purple-500" />
      </motion.div>
    </>
  );
};

export default TargetCursor;