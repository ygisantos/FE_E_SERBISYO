import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, size = 'sm', showText = false }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const starClass = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`${starClass} ${
            index < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
      {showText && (
        <span className="ml-1 text-xs text-gray-600">{rating}/5</span>
      )}
    </div>
  );
};

export default StarRating;
