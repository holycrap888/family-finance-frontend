import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center space-x-2">
        <Languages className="h-5 w-5 text-gray-600" />
        <select
          value={currentLanguage}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-transparent border-none text-sm text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
          title={t('settings.language')}
        >
          {availableLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
