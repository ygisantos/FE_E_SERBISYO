import React from 'react';

const InfoCard = ({ 
  title, 
  children, 
  icon, 
  className = '', 
  variant = 'default' 
}) => {
  const variants = {
    default: 'bg-gray-50 border border-gray-200',
    primary: 'bg-blue-50 border border-blue-200',
    success: 'bg-green-50 border border-green-200',
    warning: 'bg-yellow-50 border border-yellow-200',
    error: 'bg-red-50 border border-red-200'
  };

  return (
    <div className={`rounded-lg p-4 ${variants[variant]} ${className}`}>
      {title && (
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          {icon && <span className="text-gray-600">{icon}</span>}
          {title}
        </h4>
      )}
      <div className="text-sm text-gray-700">
        {children}
      </div>
    </div>
  );
};

export default InfoCard;