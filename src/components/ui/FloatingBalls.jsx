import React from 'react';

// Pre-generate ball positions and animations for better performance
const generateBallConfig = () => {
  return Array.from({ length: 8 }, (_, i) => ({ // Reduced from 15 to 8
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 80 + 40, // Smaller sizes for better performance
    duration: Math.random() * 15 + 20, // Longer durations for smoother animation
    delay: Math.random() * 10,
    colorIndex: i % 3
  }));
};

const BALL_CONFIGS = generateBallConfig();

const FloatingBalls = React.memo(() => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkReducedMotion = () => setReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    checkMobile();
    checkReducedMotion();

    const handleResize = () => checkMobile();
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    window.addEventListener('resize', handleResize, { passive: true });
    mediaQuery.addEventListener('change', checkReducedMotion);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);

  // Hide on mobile or when user prefers reduced motion
  if (isMobile || reducedMotion) return null;

  const ballColors = [
    'bg-tt-medium-violet/8', // Reduced opacity for subtlety
    'bg-tt-light-violet/8',
    'bg-tt-dark-violet/4',
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-[50vh] -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {BALL_CONFIGS.map((config) => (
        <div
          key={config.id}
          className={`absolute rounded-full will-change-transform ${ballColors[config.colorIndex]}`}
          style={{
            left: `${config.left}%`,
            top: `${config.top}%`,
            width: `${config.size}px`,
            height: `${config.size}px`,
            animation: `gentle-drift ${config.duration}s ease-in-out infinite alternate`,
            animationDelay: `${config.delay}s`,
            transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
            backfaceVisibility: 'hidden', // Prevent rendering issues
          }}
        />
      ))}
    </div>
  );
});

export default FloatingBalls;
