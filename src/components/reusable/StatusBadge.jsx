import React from 'react';
import { 
  FaClock, 
  FaCheckCircle, 
  FaCog, 
  FaClipboardList, 
  FaGift, 
  FaTimes,
  FaInfoCircle
} from 'react-icons/fa';

const StatusBadge = ({ status, size = 'md', colors = {} }) => {
  const defaultColors = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    ready_to_pickup: 'bg-purple-100 text-purple-800 border-purple-200',
    released: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    inactive: 'bg-red-100 text-red-800 border-red-200',
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    filed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const getStatusColor = (status) => {
    return colors[status] || defaultColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    const icons = {
      pending: <FaClock className={iconSize} />,
      approved: <FaCheckCircle className={iconSize} />,
      processing: <FaCog className={`${iconSize} animate-spin`} />,
      ready_to_pickup: <FaClipboardList className={iconSize} />,
      released: <FaGift className={iconSize} />,
      rejected: <FaTimes className={iconSize} />,
      active: <FaCheckCircle className={iconSize} />,
      inactive: <FaTimes className={iconSize} />,
      completed: <FaCheckCircle className={iconSize} />,
      cancelled: <FaTimes className={iconSize} />,
      filed: <FaClock className={iconSize} />,
      resolved: <FaCheckCircle className={iconSize} />,
      scheduled: <FaClock className={iconSize} />
    };
    return icons[status] || <FaInfoCircle className={iconSize} />;
  };

  const getIndicatorColor = (status) => {
    return ['active', 'approved', 'completed', 'resolved', 'released'].includes(status) 
      ? 'bg-green-500' 
      : ['pending', 'filed'].includes(status)
      ? 'bg-yellow-500'
      : ['processing', 'scheduled'].includes(status)
      ? 'bg-blue-500'
      : 'bg-red-500';
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  const displayText = status ? status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium border
      ${getStatusColor(status)} 
      ${sizeClasses[size]}
      transition-all duration-200 hover:scale-105
    `}>
      <span className={`w-2 h-2 rounded-full mr-2 ${getIndicatorColor(status)} animate-pulse`} />
      {getStatusIcon(status)}
      <span className="ml-2">{displayText}</span>
    </span>
  );
};

export default StatusBadge;