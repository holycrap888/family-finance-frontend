import React from 'react';
import { Home, Heart, PiggyBank, TrendingUp } from 'lucide-react';
import { formatCurrencyWithLanguage } from '../../utils/formatters.js';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext.jsx';
import PropTypes from 'prop-types';

export const BudgetCards = ({ summary }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  
  const categories = [
    { key: 'needsBalance', title: t('budget.need'), icon: Home, color: 'text-green-600', bgColor: 'bg-green-50' },
    { key: 'wantsBalance', title: t('budget.want'), icon: Heart, color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { key: 'savingsBalance', title: t('budget.savings'), icon: PiggyBank, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { key: 'investmentsBalance', title: t('budget.investments'), icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  const cards = categories.map(cat => {
    const data = summary?.actual?.[cat.key] || {};
    return {
      title: cat.title,
      recommended: formatCurrencyWithLanguage(data.recommended || 0, currentLanguage),
      actual: formatCurrencyWithLanguage(data.actual || 0, currentLanguage),
      difference: formatCurrencyWithLanguage(data.difference || 0, currentLanguage),
      icon: cat.icon,
      color: cat.color,
      bgColor: cat.bgColor
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor} dark:${card.bgColor.replace('bg-', 'bg-opacity-20 bg-')}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.title}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('budget.recommended')}: <span className="font-semibold">{card.recommended}</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('budget.actual')}: <span className="font-semibold">{card.actual}</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('budget.difference')}: <span className={`font-semibold ${card.color}`}>{card.difference}</span></p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

BudgetCards.propTypes = {
  summary: PropTypes.shape({
    actual: PropTypes.object
  })
};
