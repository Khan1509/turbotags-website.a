import React, { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';

const statsData = [
  { value: 50, label: 'Happy Users', suffix: 'K+' },
  { value: 1, label: 'Tags Generated', suffix: 'M+' },
  { value: 4, label: 'Platforms Supported', suffix: '' },
  { value: 99.9, label: 'Uptime', suffix: '%' },
];

const StatItem = ({ stat }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      animate(0, stat.value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (ref.current) {
            if (stat.suffix === '%') {
              ref.current.textContent = latest.toFixed(1);
            } else {
              ref.current.textContent = Math.round(latest).toLocaleString();
            }
          }
        },
      });
    }
  }, [isInView, stat.value, stat.suffix]);

  return (
    <motion.div 
        className="stat-card text-center p-4 bg-gray-50 rounded-lg border border-gray-200"
        whileHover={{ y: -5, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-4xl font-bold text-tt-dark-violet mb-1">
        <span ref={ref}>0</span>{stat.suffix}
      </div>
      <div className="text-sm text-gray-600">{stat.label}</div>
    </motion.div>
  );
};

const Stats = () => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map(stat => (
          <StatItem key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
};

export default Stats;
