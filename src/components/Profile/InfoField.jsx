import React from 'react';

const InfoField = ({ label, value, className = '' }) => {
  return (
    <div className={`flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 ${className}`}>
      <label className="text-xs font-medium text-gray-600 min-w-[100px] xs:w-1/3">
        {label}:
      </label>
      <span className="text-xs text-gray-900 xs:flex-1">
        {value || 'N/A'}
      </span>
    </div>
  );
};

export default InfoField;
