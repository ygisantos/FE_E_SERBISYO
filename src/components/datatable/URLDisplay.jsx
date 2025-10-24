import React from 'react';

const URLDisplay = ({ url, label = "View Link", maxLength = 30 }) => {
  if (!url) return <span className="text-xs text-gray-500">—</span>;
  
  const isMapUrl = url.includes('maps.google.com') || url.includes('maps/embed');
  const displayLabel = isMapUrl ? "View Map" : label;
  const truncatedUrl = url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  
  return (
    <div className="flex flex-col gap-1" style={{ maxWidth: '200px' }}>
      <div className="text-2xs text-gray-500 font-mono truncate" title={url}>
        {truncatedUrl}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.open(url, '_blank', 'noopener,noreferrer');
        }}
        className="inline-flex items-center gap-1 px-2 py-1 text-2xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 hover:border-blue-300 transition-all duration-200 w-fit"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        {displayLabel}
      </button>
    </div>
  );
};

export default URLDisplay;
