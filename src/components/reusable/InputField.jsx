import React from 'react';

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  required = false,
  disabled = false,
  icon,
  className = '',
  readOnly = false,
  min,
  max,
  pattern,
  helperText,
  onBlur,
  autoComplete = 'off'
}) => {
  const baseInputClass = `w-full px-3 py-2 border rounded-lg transition-colors ${
    icon ? 'pl-10' : ''
  } ${
    error
      ? 'border-red-500 focus:border-red-500'
      : 'border-gray-300 focus:border-gray-200'
  } ${
    disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'
  } ${readOnly ? 'bg-gray-50' : ''}`;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          placeholder={placeholder}
          className={baseInputClass}
          min={min}
          max={max}
          pattern={pattern}
          autoComplete={autoComplete}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-gray-500 text-xs mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default InputField;
