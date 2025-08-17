import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useTranslation } from 'react-i18next';

export const ThemeSwitcher = () => {
  const { toggleTheme, isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      title={isDark ? t('settings.switchToLight') : t('settings.switchToDark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      )}
    </button>
  );
};
