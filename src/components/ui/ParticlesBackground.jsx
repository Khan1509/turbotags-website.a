import React, { useEffect, useRef, useState } from 'react';

const ParticlesBackground = ({ 
  particleCount = 25, 
  speed = 0.5,
  connectionDistance = 150 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const [isSupported, setIsSupported] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if particles should be enabled
    const isDesktop = window.innerWidth >= 1024;
    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasTouch = 'ontouchstart' in window;
    
    setIsSupported(isDesktop && !hasReducedMotion && !hasTouch);
    
    if (!isSupported) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    // Resize canvas to full screen
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          life: Math.random() * 100
        });
      }
    };

    // Draw particle
    const drawParticle = (particle) => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.beginPath();
      
      // Create gradient for particle
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      );
      gradient.addColorStop(0, '#22d3ee'); // cyan
      gradient.addColorStop(0.5, '#4f46e5'); // indigo
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Draw connections between nearby particles
    const drawConnections = () => {
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.1;
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = '#4f46e5';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    // Update particle positions
    const updateParticles = () => {
      particlesRef.current.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life += 1;

        // Wrap around screen
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Subtle opacity animation
        particle.opacity = 0.1 + Math.sin(particle.life * 0.01) * 0.05;
      });
    };

    // Main animation loop
    const animate = () => {
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      
      updateParticles();
      drawConnections();
      particlesRef.current.forEach(drawParticle);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resize();
    initParticles();
    animate();

    // Event listeners
    window.addEventListener('resize', resize);
    
    // Pause/resume on visibility change
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSupported, particleCount, speed, connectionDistance, isVisible]);

  if (!isSupported) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
      aria-hidden="true"
    />
  );
};

export default ParticlesBackground;