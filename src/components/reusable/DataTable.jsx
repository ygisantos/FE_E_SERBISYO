import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  Download,
  MoreVertical,
} from "lucide-react";
import Pagination from "./Pagination";
import DateRangeFilter from './DateRangeFilter';

const DataTable = ({
  columns = [],
  data = [],
  enableSearch = true,
  enablePagination = false,
  itemsPerPage = 10,
  showRowNumbers = false,
  onRowClick,
  emptyMessage = "No data found",
  loading = false,
  className = "",
  tableClassName = "",
  headerClassName = "",
  rowClassName = "",
  cellClassName = "",
   striped = true,
  hover = true,
  compact = true,
  actions = [],
  onExport,
  enableColumnFilters = false,
  searchPlaceholder = "Search...",
  onSort,
  onPageChange,
  enableSelection = true,
  onSelectionChange = () => {},
  bulkActions = [], // Array of { label, icon, handler }
  comboBoxFilter = null, // { label, options, value, onChange }
  actionButton = null, // { label, icon, onClick, show, className }
  totalItems,
  currentPage,
  dateFilter = null, // { label, startDate, endDate, onStartDateChange, onEndDateChange }
  onSearchChange,
  searchValue,
  size = 'default', // Add new size prop with default value
}) => {
  // Add size classes mapping before any rendering logic
  const sizeClasses = {
    small: {
      row: "h-10",
      cell: "px-3 py-2 text-xs",
      header: "px-3 py-2 text-xs",
      search: "py-1.5 text-xs",
      button: "px-3 py-1.5 text-xs",
    },
    default: {
      row: "h-12",
      cell: "px-4 py-3 text-sm",
      header: "px-4 py-3.5 text-xs",
      search: "py-2.5 text-sm",
      button: "px-4 py-2 text-sm",
    },
    large: {
      row: "h-14",
      cell: "px-6 py-4 text-base",
      header: "px-6 py-4 text-sm",
      search: "py-3 text-base",
      button: "px-6 py-2.5 text-base",
    },
  };

  const currentSize = sizeClasses[size] || sizeClasses.default;

  // All hooks must be at the top level
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [internalPage, setInternalPage] = useState(1);
  const [pageSize] = useState(itemsPerPage);
  const [filters, setFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const searchTimeout = useRef(null);

  // Define isControlledPagination and page after state declarations
  const isControlledPagination = enablePagination && typeof totalItems === 'number' && typeof currentPage === 'number';
  const page = isControlledPagination ? currentPage : internalPage;

  // Process data based on sorting, filtering, and search
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search term
    if (enableSearch && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.accessor];
          return String(value || "")
            .toLowerCase()
            .includes(searchLower);
        })
      );
    }

    // Apply column filters
    if (enableColumnFilters) {
      Object.entries(filters).forEach(([column, filterValue]) => {
        if (filterValue) {
          result = result.filter((row) => {
            const value = String(row[column] || "").toLowerCase();
            return value.includes(filterValue.toLowerCase());
          });
        }
      });
    }

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return sortDirection === "asc" ? 1 : -1;
        if (bVal == null) return sortDirection === "asc" ? -1 : 1;

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aDate = new Date(aVal);
        const bDate = new Date(bVal);
        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        return sortDirection === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [
    data,
    columns,
    searchTerm,
    sortColumn,
    sortDirection,
    enableSearch,
    filters,
    enableColumnFilters,
  ]);

  // Apply pagination
  const paginatedData = useMemo(() => {
    // If totalItems is provided, we're using API pagination
    if (typeof totalItems === 'number') {
      return data; // Use data directly from API
    }

    // Otherwise, handle client-side pagination
    if (!enablePagination) return filteredData;
    const startIndex = (page - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [data, filteredData, page, pageSize, enablePagination, totalItems]);

  const totalPages = useMemo(() => {
    if (isControlledPagination) return Math.ceil(totalItems / pageSize);
    return Math.ceil(filteredData.length / pageSize);
  }, [isControlledPagination, totalItems, pageSize, filteredData.length]);

  // For API pagination, totalItems is a prop; otherwise, use filteredData.length
  const computedTotalItems = isControlledPagination ? totalItems : filteredData.length;

  // Event handlers
  const handleSort = useCallback(
    (columnId) => {
      const column = columns.find((col) => col.accessor === columnId);
      if (!column || column.sortable === false) return;

      const newDirection =
        sortColumn === columnId
          ? sortDirection === "asc"
            ? "desc"
            : "asc"
          : "asc";

      setSortColumn(columnId);
      setSortDirection(newDirection);

      if (onSort) onSort({ column: columnId, direction: newDirection });
    },
    [columns, sortColumn, sortDirection, onSort]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      if (isControlledPagination) {
        if (onPageChange) onPageChange(newPage);
      } else {
        setInternalPage(newPage);
        if (onPageChange) onPageChange(newPage);
      }
    },
    [onPageChange, isControlledPagination]
  );

  // Page size is now fixed to itemsPerPage

  const handleRowClick = useCallback(
    (row, index) => {
      if (onRowClick) onRowClick(row, index);
    },
    [onRowClick]
  );

  const handleFilterChange = useCallback((column, value) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
    setCurrentPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  // Action menu component with portal-like positioning
  const ActionMenu = ({ row, index, actions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target) &&
            buttonRef.current && !buttonRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate position relative to viewport
        let top = rect.bottom + 4;
        let left = rect.right - 192; // 192px = w-48
        
        // Adjust if menu would go off-screen
        if (left < 8) {
          left = rect.left;
        }
        
        if (top + 200 > viewportHeight) {
          top = rect.top - 200;
        }
        
        setMenuPosition({ top, left });
      }
    }, [isOpen]);

    const filteredActions = actions.filter(action => 
      !action.renderIf || action.renderIf(row)
    );

    return (
      <>
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            
            {/* Menu positioned absolutely to viewport */}
            <div 
              ref={menuRef}
              className="fixed z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
              }}
            >
              {filteredActions.map((action, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(row, index);
                    setIsOpen(false);
                  }}
                  className={`
                    group flex w-full items-center px-4 py-2 text-sm transition-all duration-200 cursor-pointer text-left
                    ${action.label.toLowerCase().includes('delete') || action.label.toLowerCase().includes('archive') || action.label.toLowerCase().includes('reject')
                      ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                      : action.label.toLowerCase().includes('edit')
                      ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                      : action.label.toLowerCase().includes('view')
                      ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                      : action.label.toLowerCase().includes('approve') || action.label.toLowerCase().includes('ready') || action.label.toLowerCase().includes('release')
                      ? 'text-green-600 hover:bg-green-50 hover:text-green-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'}
                  `}
                >
                  {action.icon && React.cloneElement(action.icon, {
                    className: `mr-3 h-4 w-4 ${
                      action.label.toLowerCase().includes('delete') || action.label.toLowerCase().includes('archive') || action.label.toLowerCase().includes('reject')
                        ? 'text-red-500'
                        : action.label.toLowerCase().includes('edit')
                        ? 'text-blue-500'
                        : action.label.toLowerCase().includes('approve') || action.label.toLowerCase().includes('ready') || action.label.toLowerCase().includes('release')
                        ? 'text-green-500'
                        : 'text-gray-400'
                    }`
                  })}
                  {action.label}
                </button>
              ))}
            </div>
          </>
        )}
      </>
    );
  };

  // Truncated text component
  const TruncatedText = ({ text, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    if (!text || text.length <= maxLength) {
      return <span className="text-xs text-gray-700 whitespace-pre-wrap break-words">{text}</span>;
    }

    return (
      <div className="relative">
      <div 
        className={`text-xs text-gray-700 whitespace-pre-wrap break-words ${
          !isExpanded && 'line-clamp-2'
        }`}
        style={{ maxWidth: '400px' }}
      >
        {text}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="mt-1 text-xs font-medium text-red-600 hover:text-red-700"
      >
        {isExpanded ? 'Show Less' : 'Read More'}
      </button>
    </div>
    );
  };

  // URL component for handling long URLs
  const URLDisplay = ({ url, label = "View Link", maxLength = 30 }) => {
    if (!url) return <span className="text-xs text-gray-500">—</span>;
    
    const isMapUrl = url.includes('maps.google.com') || url.includes('maps/embed');
    const displayLabel = isMapUrl ? "View Map" : label;
    
    // Create a truncated version for display
    const truncatedUrl = url.length > maxLength 
      ? `${url.substring(0, maxLength)}...` 
      : url;
    
    return (
      <div className="flex flex-col gap-1" style={{ maxWidth: '200px' }}>
        <div className="text-2xs text-gray-500 font-mono truncate" title={url}>
          {truncatedUrl}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
          className="inline-flex items-center gap-1 px-2 py-1 text-2xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 hover:border-blue-300 transition-all duration-200 w-fit"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {displayLabel}
        </button>
      </div>
    );
  };

  // Render different cell types
  const renderCellContent = (column, value, row, index) => {
    if (column.render) return column.render(value, row, index);

    switch (column.type) {
      case "avatar":
        // Just display the value as an image src, let the column definition handle the correct value
        return (
          <div className="flex items-center space-x-2">
            <img
              src={value || "/placeholder-avatar.png"}
              alt=""
              className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-white"
              style={{ aspectRatio: "1/1" }}
              onError={(e) => {
                e.target.src = "/placeholder-avatar.png";
              }}
            />
            <div className="min-w-0">
              {column.subField && (
                <div className="text-2xs text-gray-500 truncate">
                  {row[column.subField]}
                </div>
              )}
            </div>
          </div>
        );

      case "badge":
        const badgeColor = column.badgeColors?.[value] || "gray";
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
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 ${colorClasses[badgeColor] || colorClasses[value?.toLowerCase()] || colorClasses.gray}`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${statusIndicator} animate-pulse`} />
            {value?.charAt(0).toUpperCase() + value?.slice(1)}
          </span>
        );

      case "longText":
        return <TruncatedText text={value} maxLength={column.maxLength || 100} />;
      
      case "url":
        return <URLDisplay url={value} label={column.linkLabel} maxLength={column.maxLength || 30} />;
      
      default:
        // Handle URLs automatically if they start with http/https
        if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
          return <URLDisplay url={value} maxLength={30} />;
        }
        // Handle long text automatically if content is too long
        if (typeof value === 'string' && value.length > 100) {
          return <TruncatedText text={value} />;
        }
        return <span className="text-xs text-gray-800">{value || "—"}</span>;
    }
  };

  // Calculate visible page numbers for pagination
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }
    return visiblePages;
  };

  // Selection handlers
  const handleSelectAll = useCallback(() => {
    const allIds = paginatedData.map(row => row.id);
    if (selectedRows.length === allIds.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allIds);
    }
    onSelectionChange(selectedRows);
  }, [paginatedData, selectedRows]);

  const handleSelectRow = useCallback((rowId) => {
    setSelectedRows(prev => {
      const newSelection = prev.includes(rowId)
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId];
      onSelectionChange(newSelection);
      return newSelection;
    });
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  // Update the handleSearchChange function
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for search callback
    searchTimeout.current = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(value);
      }
    }, 500);
  };

  // Update renderSearchInput with controlled value from local state
  const renderSearchInput = () => (
    <div className="relative flex-grow max-w-2xl">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={searchTerm} // Use local state instead of searchValue
        onChange={handleSearchChange}
        className={`block w-full pl-10 pr-12 border border-gray-200 rounded-lg
          placeholder-gray-500 
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200 bg-gray-50 hover:bg-white
          ${currentSize.search}`}
      />
      {searchTerm && (
        <button
          onClick={() => {
            setSearchTerm('');
            if (onSearchChange) onSearchChange('');
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );

  // Render loading state as part of the main return
  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="animate-pulse">
          <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-t-lg mb-1"></div>
          <div className="rounded-b-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="h-14 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200"></div>
            <div className="space-y-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-14 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} flex items-center px-4`}
                >
                  <div className="flex space-x-4 w-full">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Table controls */}
      <div className="mb-3 space-y-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex flex-wrap items-center gap-2 w-full">
         
            {actionButton && (!actionButton.show || actionButton.show()) && (
              <button
                onClick={actionButton.onClick}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-md hover:scale-105 ${
                  actionButton.className ||
                  'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {actionButton.icon && (
                  <span className="hidden sm:inline-block">
                    {actionButton.icon}
                  </span>
                )}
                {actionButton.label}
              </button>
            )}
            {enableSearch && renderSearchInput()}
          </div>

          {/* Second row: Filters */}
          <div className="flex flex-col gap-2 w-full lg:w-auto">
            {comboBoxFilter && (
              <div className="flex items-center gap-1">
                <label className="text-xs text-gray-600 font-medium">
                  {comboBoxFilter.label}:
                </label>
                <select
                  value={comboBoxFilter.value}
                  onChange={(e) => comboBoxFilter.onChange(e.target.value)}
                  className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 bg-white cursor-pointer transition-all duration-200"
                >
                  {comboBoxFilter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {dateFilter && (
              <DateRangeFilter
                startDate={dateFilter.startDate}
                endDate={dateFilter.endDate}
                onStartDateChange={dateFilter.onStartDateChange}
                onEndDateChange={dateFilter.onEndDateChange}
                label={dateFilter.label}
              />
            )}
            {enableColumnFilters && (
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded text-xs transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm text-gray-600 font-medium cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Filter className="h-3.5 w-3.5" />
                Filters
                {Object.values(filters).some((v) => v) && (
                  <span className="bg-blue-500 text-white text-2xs rounded-full px-1 py-0 min-w-[14px] h-3.5 flex items-center justify-center animate-pulse">
                    {Object.values(filters).filter((v) => v).length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Filter panel */}
        {enableColumnFilters && showFilterPanel && (
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
                      onChange={(e) =>
                        handleFilterChange(col.accessor, e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      {/* Selection Actions */}
      {enableSelection && selectedRows.length > 0 && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-700">
              {selectedRows.length} item{selectedRows.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedRows([])}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
            >
              Clear selection
            </button>
          </div>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => action.handler(selectedRows)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 rounded-md text-xs font-medium text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className={`rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm ${tableClassName}`}
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className={`bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 ${headerClassName}`}>
              <tr>
                {enableSelection && (
                  <th className="pl-4 pr-3 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-10">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                        onChange={handleSelectAll}
                        className="
                          w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer
                          focus:ring-blue-500 focus:ring-2 focus:ring-offset-2
                          transition-all duration-200
                          hover:border-blue-400
                        "
                      />
                    </div>
                  </th>
                )}
                {showRowNumbers && (
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-10">
                    #
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.accessor}
                    onClick={() => handleSort(col.accessor)}
                    className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                      col.sortable !== false
                        ? "cursor-pointer hover:bg-gray-100 transition-colors"
                        : ""
                    } ${col.width ? col.width : ""}`}
                    style={{ textAlign: col.align || "left" }}
                  >
                    <div className="flex items-center gap-1 select-none">
                      <span>{col.label}</span>
                      {col.sortable !== false && (
                        <div className="flex flex-col">
                          {sortColumn === col.accessor ? (
                            sortDirection === "asc" ? (
                              <ChevronUp className="w-3 h-3 text-blue-500" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-blue-500" />
                            )
                          ) : (
                            <ChevronDown className="w-3 h-3 text-gray-300" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-12">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (showRowNumbers ? 1 : 0) +
                      (enableSelection ? 1 : 0) +
                      (actions.length > 0 ? 1 : 0)
                    }
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-gray-900">{emptyMessage}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm ? "Try adjusting your search or filters" : "Get started by adding some data."}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={row.id || index}
                    onClick={(e) => {
                      if (e.target.type !== 'checkbox') {
                        handleRowClick(row, index);
                      }
                    }}
                    className={`
                      hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0
                      ${striped && index % 2 === 1 ? "bg-gray-50/30" : "bg-white"}
                      ${onRowClick ? "cursor-pointer" : ""} 
                      ${currentSize.row}
                      ${selectedRows.includes(row.id) ? "bg-blue-50/50" : ""} 
                      ${rowClassName}
                    `}
                  >
                    {enableSelection && (
                      <td className="pl-4 pr-3 py-3 text-left text-sm w-10">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(row.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectRow(row.id);
                            }}
                            className="
                              w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer
                              focus:ring-blue-500 focus:ring-2 focus:ring-offset-2
                              transition-all duration-200
                              hover:border-blue-400
                            "
                          />
                        </div>
                      </td>
                    )}
                    {showRowNumbers && (
                      <td
                        className={`px-4 py-3 text-sm whitespace-nowrap font-medium text-gray-500 ${cellClassName}`}
                      >
                        {enablePagination
                          ? (page - 1) * pageSize + index + 1
                          : index + 1}
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.accessor}
                        className={`${currentSize.cell} text-gray-900 whitespace-nowrap ${cellClassName}`}
                        style={{ textAlign: col.align || "left" }}
                      >
                        {renderCellContent(col, row[col.accessor], row, index)}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-4 py-3 text-right">
                        <ActionMenu row={row} index={index} actions={actions} />
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {enablePagination && computedTotalItems > 0 && (
        <Pagination
          currentPage={page}
          totalItems={computedTotalItems}
          itemsPerPage={pageSize}
          onPageChange={handlePageChange}
          className="mt-3"
        />
      )}
    </div>
  );
};

export default DataTable;
