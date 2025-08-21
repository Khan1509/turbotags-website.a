import React from 'react';

const statsData = [
  { number: '50K+', label: 'Happy Users' },
  { number: '1M+', label: 'Tags Generated' },
  { number: '4', label: 'Platforms Supported' },
  { number: '99.9%', label: 'Uptime' },
];

const Stats = () => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map(stat => (
          <div key={stat.label} className="stat-card text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-4xl font-bold text-tt-dark-violet mb-1">{stat.number}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
