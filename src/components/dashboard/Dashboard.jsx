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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('dashboard.title')}</h1>
                <p className="text-sm text-gray-600">{t('common.welcome')}, {user?.name}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* Month Selector */}
              <div className="flex items-center space-x-2">
                <label htmlFor="month-select" className="text-sm text-gray-600">
                  {t('common.month')}:
                </label>
                <input
                  id="month-select"
                  type="month"
                  value={currentMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>
              
              {/* Add Expense Button */}
              <button
                onClick={() => setShowExpenseForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2 transition-colors"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">{t('navigation.addExpense')}</span>
              </button>
              
              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title={t('navigation.settings')}
              >
                <Settings size={20} />
              </button>
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title={t('navigation.logout')}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className={`p-4 rounded-lg flex items-center ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <AlertCircle size={20} className="mr-2 flex-shrink-0" />
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-auto text-current hover:opacity-75"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Month Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {formatMonthWithLanguage(currentMonth + '-01', currentLanguage)} {t('dashboard.overview')}
          </h2>
          <p className="text-gray-600">
            {t('dashboard.trackExpenses')}
          </p>
        </div>

        {/* Error States */}
        {(expensesError || summaryError) && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle size={20} className="mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">{t('dashboard.errorLoading')}</p>
              <p className="text-sm">
                {expensesError || summaryError}. {t('dashboard.errorMessage')}
              </p>
            </div>
            <button 
              onClick={() => {
                refreshExpenses();
                refreshSummary();
              }}
              className="ml-auto bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
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
