import React from 'react';

const StatusBadge = ({ value, customColors }) => {
  const colorClasses = {
    gray: "bg-gray-100 text-gray-800 border-gray-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
    red: "bg-red-100 text-red-800 border-red-200",
    yellow: "bg-amber-100 text-amber-800 border-amber-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    inactive: "bg-red-100 text-red-800 border-red-200",
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cancelled: "bg-gray-100 text-gray-800 border-gray-200",
    filed: "bg-yellow-100 text-yellow-800 border-yellow-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
    scheduled: "bg-blue-100 text-blue-800 border-blue-200",
    ...customColors
  };

  const statusIndicator = ['active', 'approved', 'completed', 'resolved'].includes(value?.toLowerCase()) 
    ? 'bg-green-500' 
    : ['pending', 'filed'].includes(value?.toLowerCase())
    ? 'bg-yellow-500'
    : ['processing', 'scheduled'].includes(value?.toLowerCase())
    ? 'bg-blue-500'
    : 'bg-red-500';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 ${colorClasses[value?.toLowerCase()] || colorClasses.gray}`}
    >
      <span className={`w-2 h-2 rounded-full mr-2 ${statusIndicator} animate-pulse`} />
      {value?.charAt(0).toUpperCase() + value?.slice(1)}
    </span>
  );
};

export default StatusBadge;
