import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CATEGORY_COLORS } from '../../utils/constants.js';
import { formatCurrencyWithLanguage, capitalizeFirst } from '../../utils/formatters.js';
import { LoadingSpinner } from '../common/Loading.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export const ExpenseChart = ({ chartData, expenses, loading }) => {
  const { currentLanguage } = useLanguage();
  
  // Prepare pie chart data
  const pieData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{`Day ${label}`}</p>
          <p className="text-indigo-600 dark:text-indigo-400">
            {`Amount: ${formatCurrencyWithLanguage(payload[0].value, currentLanguage)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium capitalize text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-indigo-600 dark:text-indigo-400">{formatCurrencyWithLanguage(data.value, currentLanguage)}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {[1, 2].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-center h-80">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Daily Spending Trend</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#e0e0e0' }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm">Add expenses to see your spending trend</p>
            </div>
          </div>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Spending by Category</h3>
        {pieData.length > 0 ? (
          <div className="flex flex-col">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => percent > 5 ? `${capitalizeFirst(name)} ${(percent * 100).toFixed(0)}%` : ''}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#6B7280'} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieData.slice(0, 6).map((entry) => (
                <div key={entry.name} className="flex items-center text-sm">
                  <div 
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[entry.name] || '#6B7280' }}
                  ></div>
                  <span className="capitalize truncate text-gray-700 dark:text-gray-300">{entry.name}</span>
                  <span className="ml-auto font-medium text-gray-900 dark:text-white">{formatCurrencyWithLanguage(entry.value, currentLanguage)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="text-lg font-medium">No expenses yet</p>
              <p className="text-sm">Start adding expenses to see category breakdown</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
