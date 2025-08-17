export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const EXPENSE_CATEGORIES = [
  'investments',
  'emergency', 
  'transport',
  'bills',
  'food',
  'entertainment',
  'shopping',
  'others'
];

export const CATEGORY_COLORS = {
  food: '#8B5CF6',
  transport: '#06B6D4',
  bills: '#EF4444',
  entertainment: '#F59E0B',
  shopping: '#10B981',
  investments: '#3B82F6',
  emergency: '#F97316',
  others: '#6B7280'
};

export const STORAGE_KEYS = {
  TOKEN: 'family_finance_token',
  USER: 'family_finance_user'
};