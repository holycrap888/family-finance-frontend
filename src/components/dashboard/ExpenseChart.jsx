import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CATEGORY_COLORS } from '../../utils/constants.js';
import { formatCurrencyWithLanguage, capitalizeFirst } from '../../utils/formatters.js';
import { LoadingSpinner } from '../common/Loading.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export const ExpenseChart = ({ chartData, expenses, loading }) => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  
  // Define theme-aware colors
  const chartColors = {
    gridStroke: isDark ? '#374151' : '#f0f0f0', // gray-700 for dark, light gray for light
    tickStroke: isDark ? '#4B5563' : '#e0e0e0', // gray-600 for dark, lighter gray for light
    text: isDark ? '#E5E7EB' : '#374151', // gray-200 for dark, gray-700 for light
    line: isDark ? '#818CF8' : '#6366f1', // lighter indigo for dark mode
    lineDot: isDark ? '#818CF8' : '#6366f1',
    activeDot: isDark ? '#818CF8' : '#6366f1'
  };
  
  // Custom label function for pie chart with theme-aware colors
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
    if (percent <= 0.08) return null; // Only show labels for slices > 8%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill={chartColors.text} 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12px"
        fontWeight="500"
      >
        {`${capitalizeFirst(name)} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        {[1, 2].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex items-center justify-center h-64 sm:h-80">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
      {/* Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">Daily Spending Trend</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250} className="sm:!h-[300px]">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridStroke} />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 10, fill: chartColors.text }}
                className="sm:text-xs"
                tickLine={{ stroke: chartColors.tickStroke }}
                axisLine={{ stroke: chartColors.tickStroke }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: chartColors.text }}
                className="sm:text-xs"
                tickLine={{ stroke: chartColors.tickStroke }}
                axisLine={{ stroke: chartColors.tickStroke }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke={chartColors.line} 
                strokeWidth={2}
                dot={{ fill: chartColors.lineDot, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: chartColors.activeDot, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 sm:h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center px-4">
              <p className="text-base sm:text-lg font-medium">No data available</p>
              <p className="text-xs sm:text-sm">Add expenses to see your spending trend</p>
            </div>
          </div>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">Spending by Category</h3>
        {pieData.length > 0 ? (
          <div className="flex flex-col">
            <ResponsiveContainer width="100%" height={200} className="sm:!h-[240px]">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={70}
                  className="sm:!outerRadius-80"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[entry.name] || '#6B7280'} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 mt-3 sm:mt-4">
              {pieData.slice(0, 6).map((entry) => (
                <div key={entry.name} className="flex items-center text-xs sm:text-sm">
                  <div 
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[entry.name] || '#6B7280' }}
                  ></div>
                  <span className="capitalize truncate text-gray-700 dark:text-gray-300 flex-1">{entry.name}</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white text-right">{formatCurrencyWithLanguage(entry.value, currentLanguage)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-64 sm:h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center px-4">
              <p className="text-base sm:text-lg font-medium">No expenses yet</p>
              <p className="text-xs sm:text-sm">Start adding expenses to see category breakdown</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
