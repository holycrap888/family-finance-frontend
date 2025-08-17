export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return true;
  return re.test(email);
};

export const validateString= (string) => {
    return string && string.trim().length > 0;
}

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateExpense = (expense) => {
  const errors = {};
  
  if (!expense.amount || expense.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }
  
  if (!expense.category) {
    errors.category = 'Category is required';
  }
  
  if (!expense.note || expense.note.trim().length === 0) {
    errors.note = 'Note is required';
  }
  
  if (!expense.date) {
    errors.date = 'Date is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateBudgetRatios = (ratios) => {
  const total = Object.values(ratios).reduce((sum, val) => sum + (val || 0), 0);
  return Math.abs(total - 100) < 0.01; // Allow for floating point precision
};
