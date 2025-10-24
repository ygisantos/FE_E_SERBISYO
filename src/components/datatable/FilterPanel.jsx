import React from 'react';

const FilterPanel = ({
  columns,
  filters,
  onFilterChange,
  show,
}) => {
  if (!show) return null;

  return (
    <div className="p-3 border border-gray-200 bg-white rounded shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {columns
          .filter((col) => col.filterable !== false)
          .map((col) => (
            <div key={col.accessor} className="space-y-1">
              <label className="block text-2xs font-medium text-gray-500">
                {col.label}
              </label>
              <input
                type="text"
                placeholder={`Filter ${col.label}...`}
                value={filters[col.accessor] || ""}
                onChange={(e) => onFilterChange(col.accessor, e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default FilterPanel;
