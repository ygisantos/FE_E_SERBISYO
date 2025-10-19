import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  className = "" 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  const getVisiblePages = () => {
    // Show fewer pages on mobile
    const isMobile = window.innerWidth < 640;
    const delta = isMobile ? 1 : 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((page, index, arr) => 
      page !== arr[index - 1] && (totalPages > 1 ? true : page === 1)
    );
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-4 py-3 border-t border-gray-200 ${className}`}>
      {/* Results info */}
      <div className="w-full sm:w-auto text-center sm:text-left">
        {/* Desktop version */}
        <p className="hidden sm:block text-sm text-gray-700">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </p>
        {/* Mobile version*/}
        <div className="flex items-center justify-center sm:hidden gap-2 text-xs text-gray-600">
          <span className="font-medium">{startItem}-{endItem}</span>
          <span>of</span>
          <span className="font-medium">{totalItems}</span>
          <span>•</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      </div>
      
      {/* Pagination Controls */}
      <nav className="flex items-center justify-center w-full sm:w-auto">
        <div className="flex rounded-md shadow-sm -space-x-px">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          {/* Page numbers */}
          <div className="hidden sm:flex">
            {getVisiblePages().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={page === '...'}
                className={`relative inline-flex items-center px-3 sm:px-4 py-2 border text-xs sm:text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'z-10 bg-red-50 border-red-500 text-red-600'
                    : page === '...'
                    ? 'border-gray-300 bg-white text-gray-500 cursor-default'
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Mobile page indicator */}
          <div className="flex sm:hidden items-center">
            <span className="px-4 py-2 border-t border-b border-gray-300 bg-white text-xs">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Pagination;