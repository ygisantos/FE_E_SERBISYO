import React from 'react';

const DateRangeFilter = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  label = "Date Range",
  className = ""
}) => {
  return (
    <div className={`flex flex-col w-full lg:w-auto gap-2 ${className}`}>
      <label className="text-xs font-medium text-gray-600">
        {label}:
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="w-full sm:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs 
              focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xs text-gray-500">to</span>
        </div>
        <div className="w-full sm:w-auto">
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs 
              focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;
