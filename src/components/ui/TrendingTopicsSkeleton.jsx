import React from 'react';

const SkeletonCard = () => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full flex flex-col animate-pulse">
    <div className="flex items-center mb-4">
      <div className="h-8 w-8 mr-3 bg-gray-200 rounded-full"></div>
      <div className="h-7 w-36 bg-gray-200 rounded"></div>
    </div>
    <div className="space-y-4 flex-grow">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start">
          <div className="h-5 w-5 bg-gray-200 rounded-full mr-3 mt-1 flex-shrink-0"></div>
          <div className="w-full">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TrendingTopicsSkeleton = () => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-center mb-8 animate-pulse">
        <div className="h-10 w-3/4 bg-gray-200 rounded mx-auto mb-3"></div>
        <div className="h-5 w-1/2 bg-gray-200 rounded mx-auto mb-3"></div>
        <div className="h-4 w-1/3 bg-gray-200 rounded mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </section>
  );
};

export default TrendingTopicsSkeleton;
