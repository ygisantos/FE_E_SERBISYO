import React, { useState } from 'react';

const TruncatedText = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text || text.length <= maxLength) {
    return <span className="text-xs text-gray-700 whitespace-pre-wrap break-words">{text}</span>;
  }

  return (
    <div className="relative">
      <div 
        className={`text-xs text-gray-700 whitespace-pre-wrap break-words ${
          !isExpanded && 'line-clamp-2'
        }`}
        style={{ maxWidth: '400px' }}
      >
        {text}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="mt-1 text-xs font-medium text-red-600 hover:text-red-700"
      >
        {isExpanded ? 'Show Less' : 'Read More'}
      </button>
    </div>
  );
};

export default TruncatedText;
