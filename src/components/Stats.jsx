import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Bot } from 'lucide-react';

const stats = [
  { icon: Users, value: '100,000+', label: 'Creators Helped' },
  { icon: Globe, value: '30+', label: 'Regions Supported' },
  { icon: Bot, value: '5M+', label: 'Tags Generated' },
];

const Stats = () => {
  return (
    <section className="bg-tt-dark-violet text-white py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <stat.icon className="h-10 w-10 mb-3" />
              <div className="text-4xl font-bold">{stat.value}</div>
              <div className="text-lg text-tt-light-violet">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
