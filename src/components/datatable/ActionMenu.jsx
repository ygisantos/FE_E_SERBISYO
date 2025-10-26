import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { createPortal } from 'react-dom';

// Track current open menu
let currentOpenMenu = null;
const closeCurrentMenu = () => {
  if (currentOpenMenu) {
    currentOpenMenu();
    currentOpenMenu = null;
  }
};

const ActionMenu = ({ row, index, actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOpen) {
      closeCurrentMenu();
      const rect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const menuHeight = actions.length * 40; // Approximate height per item

      // Add offset to push menu down slightly from the icon
      const verticalOffset = 8; // 8px offset

      setMenuPosition({
        top: rect.bottom + verticalOffset, // Add offset to push menu down
        left: rect.right - 192,
      });
    }
    setIsOpen(!isOpen);
    currentOpenMenu = () => setIsOpen(false);
  };

  // Remove scroll event listener - we don't want to close on scroll
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          buttonRef.current && !buttonRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredActions = actions.filter(action => !action.show || action.show(row));

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className={`
            fixed w-48 py-1 bg-white rounded-lg shadow-lg border border-gray-200 z-[999]
            max-h-[300px] overflow-y-auto
          `}
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
        >
          {filteredActions.map((action, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                action.onClick(row, index);
                setIsOpen(false);
              }}
              disabled={action.disabled?.(row)}
              className={`
                w-full flex items-center px-4 py-2 text-sm
                transition-colors duration-150 cursor-pointer
                ${action.disabled?.(row) 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
              title={action.disabled?.(row) ? action.tooltip?.(row) : ''}
            >
              {action.icon && <span className="w-4 h-4 mr-3">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
