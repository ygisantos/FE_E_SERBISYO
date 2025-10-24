import React from 'react';

const LoadingState = ({ className = "" }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="animate-pulse">
        <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-t-lg mb-1" />
        <div className="rounded-b-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="h-14 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200" />
          <div className="space-y-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-14 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} flex items-center px-4`}
              >
                <div className="flex space-x-4 w-full">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
