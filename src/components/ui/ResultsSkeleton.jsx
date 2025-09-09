import React from 'react';

const SkeletonLine = ({ width }) => (
  <div className={`bg-gray-200 rounded-md h-6 shimmer ${width}`}></div>
);

const SkeletonBlock = () => (
  <div className="space-y-4">
    <SkeletonLine width="w-1/3" />
    <div className="flex flex-wrap gap-2">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-full h-8 w-24 shimmer"></div>
      ))}
    </div>
  </div>
);

const ResultsSkeleton = () => {
  return (
    <div className="space-y-8">
      <SkeletonBlock />
      <SkeletonBlock />
    </div>
  );
};

export default ResultsSkeleton;
