import React from 'react';
import { TrendingUp } from 'lucide-react';
import { formatCurrencyWithLanguage } from '../../utils/formatters.js';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext.jsx';
import PropTypes from 'prop-types';

export const BudgetCards = ({ summary }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  
  const categories = [
    { key: 'needsBalance', title: t('budget.need') },
    { key: 'wantsBalance', title: t('budget.want') },
    { key: 'savingsBalance', title: t('budget.savings') },
    { key: 'investmentsBalance', title: t('budget.investments') },
  ];

  const cards = categories.map(cat => {
    const data = summary?.actual?.[cat.key] || {};
    return {
      title: cat.title,
      recommended: formatCurrencyWithLanguage(data.recommended || 0, currentLanguage),
      actual: formatCurrencyWithLanguage(data.actual || 0, currentLanguage),
      difference: formatCurrencyWithLanguage(data.difference || 0, currentLanguage),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">{t('budget.recommended')}: <span className="font-semibold">{card.recommended}</span></p>
              <p className="text-xs text-gray-500">{t('budget.actual')}: <span className="font-semibold">{card.actual}</span></p>
              <p className="text-xs text-gray-500">{t('budget.difference')}: <span className={`font-semibold ${card.color}`}>{card.difference}</span></p>
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
