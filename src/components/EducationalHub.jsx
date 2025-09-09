import React from 'react';
import { BookOpen, Video, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

const resources = [
  { title: 'YouTube SEO Guide', icon: BookOpen, link: '/blog' },
  { title: 'Video Tutorials', icon: Video, link: '/blog' },
  { title: 'Creator Podcasts', icon: Mic, link: '/blog' },
];

const EducationalHub = () => {
  return (
    <section id="education" className="py-12 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-tt-dark-violet">📚 Educational Hub</h2>
          <p className="text-lg text-gray-600 mt-2">Learn the strategies behind successful content.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <Link to={resource.link} key={index} className="block bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center hover:shadow-xl hover:-translate-y-1 transition-all">
              <resource.icon className="h-12 w-12 mx-auto text-tt-primary mb-4" />
              <h3 className="text-xl font-bold text-gray-800">{resource.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationalHub;
