import { apiRequest } from './api.js';

export const expenseService = {
  async getExpenses(month) {
    try {
      const params = month ? `?month=${month}` : '';
      const expenses = await apiRequest(`/expenses${params}`);
      return { success: true, data: expenses };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch expenses' 
      };
    }
  },

  async addExpense(expenseData) {
    try {
      const response = await apiRequest('/expenses', {
        method: 'POST',
        body: [expenseData] // API expects an array
      });
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to add expense' 
      };
    }
  },

  async addMultipleExpenses(expensesArray) {
    try {
      const response = await apiRequest('/expenses', {
        method: 'POST',
        body: expensesArray
      });
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to add expenses' 
      };
    }
  }
};