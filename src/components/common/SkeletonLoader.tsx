import React from 'react';

interface SkeletonLoaderProps {
  rows?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ rows = 5, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Table header skeleton */}
      <div className="bg-white rounded-2xl shadow-soft border border-surface-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-surface-200 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Table rows skeleton */}
        <div className="divide-y divide-surface-100">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="px-6 py-4">
              <div className="grid grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, colIndex) => (
                  <div key={colIndex} className="h-4 bg-surface-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
