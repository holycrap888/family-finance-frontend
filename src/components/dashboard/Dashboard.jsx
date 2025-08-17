import React, { useState } from 'react';
import { Plus, Settings, LogOut, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useExpenses } from '../../hooks/useExpenses.js';
import { useSummary } from '../../hooks/useSummary.js';
import { userService } from '../../services/userService.js';
import { formatMonthWithLanguage } from '../../utils/formatters.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { SummaryCards } from './SummaryCards.jsx';
import { BudgetCards } from './BudgetCards.jsx';
import { ExpenseChart } from './ExpenseChart.jsx';
import { ExpenseList } from './ExpenseList.jsx';
import { ExpenseForm } from '../expenses/ExpenseForm.jsx';
import { SettingsModal } from '../settings/SettingsModal.jsx';
import { Loading } from '../common/Loading.jsx';
import { LanguageSwitcher } from '../common/LanguageSwitcher.jsx';
import { ThemeSwitcher } from '../common/ThemeSwitcher.jsx';
import { useTranslation } from 'react-i18next';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState(null);

  // Custom hooks for data fetching
  const {
    expenses,
    loading: expensesLoading,
    error: expensesError,
    addExpense,
    refresh: refreshExpenses
  } = useExpenses(currentMonth);

  const {
    summary,
    chartData,
    loading: summaryLoading,
    error: summaryError,
    refresh: refreshSummary
  } = useSummary(currentMonth);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddExpense = async (expenseData) => {
    const result = await addExpense(expenseData);
    if (result.success) {
      showNotification(t('dashboard.expenseAdded'));
      refreshSummary(); // Refresh summary data as well
    } else {
      throw new Error(result.error);
    }
  };

  const handleUpdateSettings = async (settings) => {
    const result = await userService.updateSettings(settings);
    if (result.success) {
      showNotification(t('dashboard.settingsUpdated'));
      // In a real app, you might want to refresh user data
    } else {
      throw new Error(result.error);
    }
  };

  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
  };

  if (expensesLoading && summaryLoading) {
    return <Loading message={t('dashboard.loadingFinancialData')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0 flex-1">
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 mr-2 sm:mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">{t('dashboard.title')}</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">{t('common.welcome')}, {user?.name}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              {/* Language Switcher - Hidden on mobile */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              
              {/* Theme Switcher */}
              <ThemeSwitcher />
              
              {/* Month Selector - Responsive */}
              <div className="hidden md:flex items-center space-x-2">
                <label htmlFor="month-select" className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {t('common.month')}:
                </label>
                <input
                  id="month-select"
                  type="month"
                  value={currentMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              {/* Add Expense Button */}
              <button
                onClick={() => setShowExpenseForm(true)}
                className="bg-indigo-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-1 sm:space-x-2 transition-colors text-sm sm:text-base"
              >
                <Plus size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">{t('navigation.addExpense')}</span>
              </button>
              
              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-1 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title={t('navigation.settings')}
              >
                <Settings size={16} className="sm:w-5 sm:h-5" />
              </button>
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-1 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title={t('navigation.logout')}
              >
                <LogOut size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          
          {/* Mobile Month Selector */}
          <div className="md:hidden pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <label htmlFor="month-select-mobile" className="text-sm text-gray-600 dark:text-gray-300">
                {t('common.month')}:
              </label>
              <input
                id="month-select-mobile"
                type="month"
                value={currentMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            {/* Mobile Language Switcher */}
            <div className="sm:hidden ml-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-3 sm:pt-4">
          <div className={`p-3 sm:p-4 rounded-lg flex items-start ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <AlertCircle size={18} className="sm:w-5 sm:h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm sm:text-base flex-1">{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 text-current hover:opacity-75 text-lg sm:text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Month Header */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {formatMonthWithLanguage(currentMonth + '-01', currentLanguage)} {t('dashboard.overview')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
            {t('dashboard.trackExpenses')}
          </p>
        </div>

        {/* Error States */}
        {(expensesError || summaryError) && (
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-lg flex items-start">
            <AlertCircle size={18} className="sm:w-5 sm:h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm sm:text-base">{t('dashboard.errorLoading')}</p>
              <p className="text-xs sm:text-sm">
                {expensesError || summaryError}. {t('dashboard.errorMessage')}
              </p>
            </div>
            <button 
              onClick={() => {
                refreshExpenses();
                refreshSummary();
              }}
              className="ml-2 bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-200 transition-colors whitespace-nowrap"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {/* Summary Cards */}
        <SummaryCards 
          user={user} 
          summary={summary} 
          expenseCount={expenses.length} 
        />

        {/* Charts and Analytics */}
        <ExpenseChart 
          chartData={chartData} 
          expenses={expenses}
          loading={summaryLoading}
        />

        {/* Summary Cards */}
        <BudgetCards 
          summary={summary}
        />

        {/* Expense List */}
        <ExpenseList 
          expenses={expenses} 
          loading={expensesLoading}
          onRefresh={refreshExpenses}
        />
      </main>

      {/* Modals */}
      {showExpenseForm && (
        <ExpenseForm
          onClose={() => setShowExpenseForm(false)}
          onSuccess={handleAddExpense}
        />
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSave={handleUpdateSettings}
          user={user}
        />
      )}
    </div>
  );
};
