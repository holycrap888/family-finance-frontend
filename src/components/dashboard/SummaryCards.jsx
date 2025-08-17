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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.bgColor} dark:${card.bgColor.replace('bg-', 'bg-opacity-20 bg-')}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
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
