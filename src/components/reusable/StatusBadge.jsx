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

const StatusBadge = ({ status, size = 'md' }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      approved: 'bg-green-500',
      processing: 'bg-blue-500',
      ready_to_pickup: 'bg-purple-500',
      released: 'bg-emerald-600',
      rejected: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusIcon = (status) => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    const icons = {
      pending: <FaClock className={iconSize} />,
      approved: <FaCheckCircle className={iconSize} />,
      processing: <FaCog className={iconSize} />,
      ready_to_pickup: <FaClipboardList className={iconSize} />,
      released: <FaGift className={iconSize} />,
      rejected: <FaTimes className={iconSize} />
    };
    return icons[status] || <FaInfoCircle className={iconSize} />;
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <div className={`inline-flex items-center rounded-full text-white font-medium ${getStatusColor(status)} ${sizeClasses[size]}`}>
      <span className="mr-2">{getStatusIcon(status)}</span>
      <span>{status.replace('_', ' ').toUpperCase()}</span>
    </div>
  );
};

export default StatusBadge;