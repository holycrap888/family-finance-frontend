export const formatCurrency = (amount, locale = 'th-TH') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2
  }).format(amount || 0);
};

export const formatDate = (date, locale = 'th-TH') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatMonth = (date, locale = 'th-TH') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long'
  });
};

// Helper function to get locale from language code
export const getLocaleFromLanguage = (language) => {
  switch (language) {
    case 'en':
      return 'en-US';
    case 'th':
      return 'th-TH';
    default:
      return 'th-TH';
  }
};

// Context-aware formatter functions that use current language
export const formatCurrencyWithLanguage = (amount, language) => {
  const locale = getLocaleFromLanguage(language);
  return formatCurrency(amount, locale);
};

export const formatDateWithLanguage = (date, language) => {
  const locale = getLocaleFromLanguage(language);
  return formatDate(date, locale);
};

export const formatMonthWithLanguage = (date, language) => {
  const locale = getLocaleFromLanguage(language);
  return formatMonth(date, locale);
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};