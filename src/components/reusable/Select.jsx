import React from 'react';
import ReactSelect from 'react-select';

const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isMulti = false,
  isSearchable = true,
  isClearable = true,
  isDisabled = false,
  className = '',
  label,
  error,
  required = false,
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: error ? '#ef4444' : state.isFocused ? '#ef4444' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 1px #ef4444' : 'none',
      minHeight: '34px',
      fontSize: '0.75rem',
      '@media (min-width: 640px)': {
        fontSize: '0.875rem',
      },
      '&:hover': {
        borderColor: '#ef4444',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#7f1d1d' : state.isFocused ? '#fee2e2' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      fontSize: '0.75rem',
      padding: '6px 12px',
      '@media (min-width: 640px)': {
        fontSize: '0.875rem',
        padding: '8px 12px',
      },
      '&:active': {
        backgroundColor: '#7f1d1d',
      },
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: '0.75rem',
      '@media (min-width: 640px)': {
        fontSize: '0.875rem',
      },
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: '0.75rem',
      '@media (min-width: 640px)': {
        fontSize: '0.875rem',
      },
    }),
    input: (base) => ({
      ...base,
      fontSize: '0.75rem',
      '@media (min-width: 640px)': {
        fontSize: '0.875rem',
      },
    }),
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {label} 
        </label>
      )}
      <ReactSelect
        options={options}
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isDisabled={isDisabled}
        placeholder={placeholder}
        styles={customStyles}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        className="text-xs sm:text-sm"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#7f1d1d',
            primary75: '#991b1b',
            primary50: '#fee2e2',
            primary25: '#fef2f2',
          },
        })}
      />
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
