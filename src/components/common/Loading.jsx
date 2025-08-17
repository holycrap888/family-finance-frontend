import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export const Loading = ({ message }) => {
  const { t } = useTranslation();
  const displayMessage = message || t('common.loading');
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{displayMessage}</p>
      </div>
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string
};

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-16 w-16'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]}`}></div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};