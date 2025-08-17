import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { validateBudgetRatios } from '../../utils/validators.js';
import { LoadingSpinner } from '../common/Loading.jsx';

export const SettingsModal = ({ onClose, onSave, user, loading: externalLoading = false }) => {
  const [settings, setSettings] = useState({
    budgetRatio: {
      needs: 50,
      savings: 20,
      wants: 20,
      investments: 5,
      emergency: 5
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.settings?.budgetRatio) {
      setSettings({ budgetRatio: user.settings.budgetRatio });
    }
  }, [user]);

  const handleRatioChange = (key, value) => {
    const numValue = parseInt(value) || 0;
    setSettings(prev => ({
      budgetRatio: {
        ...prev.budgetRatio,
        [key]: numValue
      }
    }));
    setError(''); // Clear error when user makes changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate budget ratios
    if (!validateBudgetRatios(settings.budgetRatio)) {
      setError('Budget ratios must total exactly 100%');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSave(settings);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = Object.values(settings.budgetRatio).reduce((sum, val) => sum + val, 0);
  const loading = externalLoading || isSubmitting;

  const budgetCategories = [
    { key: 'needs', label: 'Needs', description: 'Essential expenses (rent, food, utilities)' },
    { key: 'savings', label: 'Savings', description: 'Regular savings account' },
    { key: 'wants', label: 'Wants', description: 'Entertainment and discretionary spending' },
    { key: 'investments', label: 'Investments', description: 'Stocks, bonds, retirement funds' },
    { key: 'emergency', label: 'Emergency Fund', description: 'Emergency savings buffer' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <SettingsIcon className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Budget Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p>Allocate your monthly income across different budget categories. The total must equal 100%.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {budgetCategories.map(({ key, label, description }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <span className="text-xs text-gray-500">
                  ${user?.salary ? Math.round((user.salary * settings.budgetRatio[key]) / 100) : 0}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{description}</p>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  value={settings.budgetRatio[key]}
                  onChange={(e) => handleRatioChange(key, e.target.value)}
                  disabled={loading}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  %
                </span>
              </div>
            </div>
          ))}

          {/* Total Display */}
          <div className={`p-3 rounded-lg border text-center font-medium ${
            total === 100 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-yellow-50 border-yellow-200 text-yellow-700'
          }`}>
            Total: {total}%
            {total !== 100 && (
              <p className="text-sm font-normal mt-1">
                {total < 100 ? `Need ${100 - total}% more` : `Reduce by ${total - 100}%`}
              </p>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle size={20} className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || total !== 100}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
