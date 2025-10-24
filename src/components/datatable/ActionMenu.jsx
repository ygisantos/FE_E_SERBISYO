import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { createPortal } from 'react-dom';

const ActionMenu = ({ row, index, actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (!isOpen || !buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 192;
    const menuHeight = 200;
    const padding = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = buttonRect.right - menuWidth;
    let top = buttonRect.bottom + padding + window.scrollY;
    let position = 'bottom';

    if (left < padding) {
      left = buttonRect.left;
    } else if (left + menuWidth > viewportWidth - padding) {
      left = viewportWidth - menuWidth - padding;
    }

    if (buttonRect.bottom + menuHeight > viewportHeight - padding) {
      top = buttonRect.top - menuHeight - padding + window.scrollY;
      position = 'top';
    }

    setMenuPosition({ top, left, position });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = (e) => {
      if (e.target.contains(buttonRef.current)) {
        updatePosition();
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          buttonRef.current && !buttonRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredActions = actions.filter(action => !action.show || action.show(row));

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
          className={`
            fixed z-[9999] w-48 py-1
            bg-white rounded-lg shadow-lg border border-gray-200
            transform opacity-100 scale-100
            transition-all duration-200 ease-out
          `}
        >
          {filteredActions.map((action, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(row, index);
                setIsOpen(false);
              }}
              disabled={action.disabled?.(row)}
              className={`
                w-full flex items-center px-4 py-2 text-sm
                transition-colors duration-150
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
        </div>,
        document.body
      )}
    </div>
  );
};

export default ActionMenu;
