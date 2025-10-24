import React from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = ({ 
  value, 
  onChange, 
  onClear, 
  placeholder = "Search...",
  className = "",
  size = "default"
}) => {
  const sizeClasses = {
    small: "py-1.5 text-xs",
    default: "py-2.5 text-sm",
    large: "py-3 text-base",
  };

  return (
    <div className={`relative flex-grow max-w-2xl ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          block w-full pl-10 pr-12 border border-gray-200 rounded-lg
          placeholder-gray-500 
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200 bg-gray-50 hover:bg-white
          ${sizeClasses[size]}
        `}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
