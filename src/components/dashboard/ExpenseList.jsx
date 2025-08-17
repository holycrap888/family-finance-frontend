import React, { useState } from 'react';
import { Search, RefreshCw, Calendar, DollarSign } from 'lucide-react';
import { CATEGORY_COLORS } from '../../utils/constants.js';
import { formatCurrencyWithLanguage, formatDateWithLanguage, capitalizeFirst } from '../../utils/formatters.js';
import { LoadingSpinner } from '../common/Loading.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export const ExpenseList = ({ expenses, loading, onRefresh }) => {
  const { currentLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, amount, category
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  // Filter and sort expenses
  const filteredAndSortedExpenses = React.useMemo(() => {
    let filtered = expenses.filter(expense => 
      expense.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [expenses, searchTerm, sortBy, sortOrder]);

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const totalAmount = filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Expense History</h3>
            <p className="text-sm text-gray-600">
              {filteredAndSortedExpenses.length} expenses • Total: {formatCurrencyWithLanguage(totalAmount, currentLanguage)}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search expenses..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Sort */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="amount-desc">Highest amount</option>
              <option value="amount-asc">Lowest amount</option>
              <option value="category-asc">Category A-Z</option>
              <option value="category-desc">Category Z-A</option>
            </select>
            
            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="px-6 py-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading expenses...</p>
          </div>
        ) : filteredAndSortedExpenses.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            {searchTerm ? (
              <div>
                <p className="text-lg font-medium">No matching expenses found</p>
                <p className="text-sm">Try adjusting your search term</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div>
                <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No expenses yet</p>
                <p className="text-sm">Start by adding your first expense</p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {filteredAndSortedExpenses.map((expense) => (
              <div 
                key={expense._id} 
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* Category Color Indicator */}
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[expense.category] || '#6B7280' }}
                    ></div>
                    
                    {/* Expense Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {expense.note}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500 capitalize">
                          {capitalizeFirst(expense.category)}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {formatDateWithLanguage(expense.date, currentLanguage)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrencyWithLanguage(expense.amount, currentLanguage)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredAndSortedExpenses.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {filteredAndSortedExpenses.length} of {expenses.length} expenses
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-indigo-600 hover:text-indigo-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
