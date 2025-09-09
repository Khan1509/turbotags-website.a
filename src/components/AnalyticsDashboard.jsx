import React from 'react';
import { BarChart, TrendingUp, Users } from 'lucide-react';

const AnalyticsDashboard = () => {
  return (
    <section id="analytics" className="py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-tt-dark-violet">📊 Analytics Dashboard</h2>
          <p className="text-lg text-gray-600 mt-2">Track your growth and measure your success. (Pro Feature)</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <BarChart className="h-10 w-10 mx-auto text-tt-primary mb-2" />
              <h3 className="font-bold text-lg">Views & Engagement</h3>
              <p className="text-gray-400 mt-2">Mock chart data here</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <TrendingUp className="h-10 w-10 mx-auto text-green-500 mb-2" />
              <h3 className="font-bold text-lg">Follower Growth</h3>
              <p className="text-gray-400 mt-2">Mock chart data here</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Users className="h-10 w-10 mx-auto text-purple-500 mb-2" />
              <h3 className="font-bold text-lg">Audience Demographics</h3>
              <p className="text-gray-400 mt-2">Mock chart data here</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;
