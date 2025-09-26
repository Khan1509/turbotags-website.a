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
      {/* Enhanced futuristic center core */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
        }}
        animate={{
          scale: isClicking ? 1.2 : isHovering ? 1.4 : 1.1,
        }}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 25,
        }}
      >
        <motion.div
          className="w-3 h-3 rounded-full shadow-lg"
          style={{ 
            background: 'radial-gradient(circle, #ffffff 0%, #e5e7eb 100%)',
            boxShadow: `
              0 0 8px rgba(0, 0, 0, 0.08),
              0 0 16px rgba(0, 0, 0, 0.05),
              inset 0 0 4px rgba(0, 0, 0, 0.06)
            `
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Enhanced futuristic ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.8 : 1.1,
          opacity: isHovering ? 0.9 : 0.3,
          rotate: isHovering ? 45 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
        }}
      >
        <motion.div
          className="w-10 h-10 rounded-full border-2"
          style={{ 
            borderColor: '#e5e7eb',
            background: `
              radial-gradient(circle,
                transparent 50%,
                rgba(0, 0, 0, 0.06) 70%,
                rgba(0, 0, 0, 0.04) 100%
              )
            `,
            filter: 'blur(0.5px)',
            boxShadow: `
              0 0 12px rgba(0, 0, 0, 0.08),
              inset 0 0 10px rgba(0, 0, 0, 0.05)
            `
          }}
          animate={{
            rotate: [0, -360],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
      
      {/* Enhanced outer pulse on hover */}
      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997]"
          style={{
            x: mousePosition.x - 35,
            y: mousePosition.y - 35,
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.4, scale: 1.2 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
        >
          <motion.div
            className="w-18 h-18 rounded-full"
            style={{
              background: `
                radial-gradient(circle,
                  rgba(0, 0, 0, 0.12) 0%,
                  rgba(0, 0, 0, 0.08) 40%,
                  rgba(0, 0, 0, 0.05) 70%,
                  transparent 100%
                )
              `,
              filter: 'blur(12px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default TargetCursor;
