import React from 'react';

const FloatingBalls = React.memo(() => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

  const ballColors = [
    'bg-tt-medium-violet/10',
    'bg-tt-light-violet/10',
    'bg-tt-dark-violet/5',
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-[50vh] -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className={`absolute block list-none rounded-full will-change-transform ${ballColors[i % ballColors.length]}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`, // Position within the container
            width: `${Math.random() * 150 + 50}px`,
            height: `${Math.random() * 150 + 50}px`,
            animation: `gentle-drift ${Math.random() * 20 + 15}s ease-in-out infinite alternate`,
            animationDelay: `${Math.random() * 15}s`,
          }}
        />
      ))}
    </div>
  );
});

export default FloatingBalls;
