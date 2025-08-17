import React from 'react';
import { DollarSign, TrendingUp, Calendar, Receipt } from 'lucide-react';
import { formatCurrencyWithLanguage } from '../../utils/formatters.js';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext.jsx';
import PropTypes from 'prop-types';

export const SummaryCards = ({ user, summary, expenseCount }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  
  const cards = [
    {
      title: t('summary.totalIncome'),
      value: formatCurrencyWithLanguage(user?.salary || 0, currentLanguage),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: t('summary.totalExpenses'),
      value: formatCurrencyWithLanguage(summary?.actual?.totalSpent || 0, currentLanguage),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: t('summary.remainingBudget'),
      value: formatCurrencyWithLanguage(summary?.totalBalance || 0, currentLanguage),
      icon: Calendar,
      color: summary?.totalBalance >= 0 ? 'text-purple-600' : 'text-red-600',
      bgColor: summary?.totalBalance >= 0 ? 'bg-purple-50' : 'bg-red-50'
    },
    {
      title: `${t('summary.expenseCount')} (${expenseCount})`,
      value: expenseCount.toString(),
      icon: Receipt,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-2 sm:p-3 rounded-lg ${card.bgColor} dark:${card.bgColor.replace('bg-', 'bg-opacity-20 bg-')} flex-shrink-0`}>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${card.color}`} />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">{card.title}</p>
                <p className={`text-lg sm:text-2xl font-bold ${card.color} truncate`}>{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

SummaryCards.propTypes = {
  user: PropTypes.shape({
    salary: PropTypes.number
  }),
  summary: PropTypes.shape({
    actual: PropTypes.shape({
      totalSpent: PropTypes.number
    }),
    totalBalance: PropTypes.number
  }),
  expenseCount: PropTypes.number.isRequired
};
