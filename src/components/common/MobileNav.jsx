import React, { useState } from 'react';
import { Menu, X, Plus, Settings, LogOut, Calendar } from 'lucide-react';
import PropTypes from 'prop-types';

export const MobileNav = ({ 
  onAddExpense, 
  onOpenSettings, 
  onLogout, 
  currentMonth, 
  onMonthChange,
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleAction = (action) => {
    action();
    closeMenu();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeMenu();
    }
  };

  const handleBackdropKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <button 
            className="fixed inset-0 bg-black bg-opacity-50 border-0 p-0 cursor-default" 
            onClick={handleBackdropClick}
            onKeyDown={handleBackdropKeyDown}
            aria-label="Close mobile menu"
          />
          
          {/* Menu panel */}
          <div className="relative flex flex-col w-64 h-full bg-white dark:bg-gray-800 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={closeMenu}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Navigation items */}
            <nav className="flex-1 p-4 space-y-3">
              {/* Month Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Calendar size={16} className="inline mr-2" />
                  Select Month
                </label>
                <input
                  type="month"
                  value={currentMonth}
                  onChange={(e) => {
                    onMonthChange(e.target.value);
                    closeMenu();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                {/* Add Expense */}
                <button
                  onClick={() => handleAction(onAddExpense)}
                  className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <Plus size={20} className="mr-3 text-indigo-600" />
                  Add Expense
                </button>
                
                {/* Settings */}
                <button
                  onClick={() => handleAction(onOpenSettings)}
                  className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <Settings size={20} className="mr-3 text-gray-600" />
                  Settings
                </button>
                
                {/* Logout */}
                <button
                  onClick={() => handleAction(onLogout)}
                  className="w-full flex items-center px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                  <LogOut size={20} className="mr-3" />
                  Logout
                </button>
              </div>
            </nav>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

MobileNav.propTypes = {
  onAddExpense: PropTypes.func.isRequired,
  onOpenSettings: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  currentMonth: PropTypes.string.isRequired,
  onMonthChange: PropTypes.func.isRequired,
  children: PropTypes.node,
};
