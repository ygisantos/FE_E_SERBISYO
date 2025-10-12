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

const TimelineItem = ({ status, isActive, isMobile = false }) => {
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
    const iconSize = isMobile ? 'w-3 h-3' : 'w-4 h-4';
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

  if (isMobile) {
    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
          isActive ? getStatusColor(status) : 'bg-gray-300'
        }`}>
          {getStatusIcon(status)}
        </div>
        <span className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
          {status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md text-white ${
        isActive ? getStatusColor(status) : 'bg-gray-300'
      }`}>
        {getStatusIcon(status)}
      </div>
      <span className={`mt-2 text-xs font-medium text-center max-w-20 ${
        isActive ? 'text-gray-900' : 'text-gray-500'
      }`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    </div>
  );
};

export default TimelineItem;