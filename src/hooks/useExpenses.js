import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService.js';

export const useExpenses = (month) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await expenseService.getExpenses(month);
    
    if (result.success) {
      setExpenses(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, [month]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (expenseData) => {
    setLoading(true);
    setError(null);
    
    const result = await expenseService.addExpense(expenseData);
    
    if (result.success) {
      await fetchExpenses(); // Refresh the list
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  const refresh = () => {
    fetchExpenses();
  };

  return {
    expenses,
    loading,
    error,
    addExpense,
    refresh
  };
};