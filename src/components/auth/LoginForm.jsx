import React, { useState } from 'react';
import { DollarSign, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { validateEmail, validatePassword } from '../../utils/validators.js';
import { LoadingSpinner } from '../common/Loading.jsx';
import { LanguageSwitcher } from '../common/LanguageSwitcher.jsx';
import { ThemeSwitcher } from '../common/ThemeSwitcher.jsx';
import { useTranslation } from 'react-i18next';

export const LoginForm = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    salary: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const { login, register, loading, error, clearError } = useAuth();

  const validateForm = () => {
    const errors = {};
    
    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin) {
      if (!formData.name.trim()) {
        errors.name = 'Name is required';
      }
      
      if (!formData.salary || parseFloat(formData.salary) <= 0) {
        errors.salary = 'Please enter a valid salary';
      }
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          salary: parseFloat(formData.salary)
        });
        
        if (result.success) {
          setIsLogin(true);
          setFormData({ 
            email: formData.email, 
            password: '', 
            name: '', 
            salary: '' 
          });
          setFieldErrors({});
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFieldErrors({});
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <DollarSign className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-indigo-600 mb-3 sm:mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard.title')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
            {isLogin ? t('common.welcome') : 'Create your account'}
          </p>
          <div className="mt-3 sm:mt-4 flex justify-center space-x-3 sm:space-x-4">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Name Field (Registration only) */}
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                required
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base ${
                  fieldErrors.name ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                }`}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Doe"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {fieldErrors.name}
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.email')} *
              </label>
              <input
                id="email"
                type="text"
              required
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base ${
                fieldErrors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
              }`}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john@example.com"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('auth.password')} *
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base ${
                  fieldErrors.password ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                }`}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Salary Field (Registration only) */}
          {!isLogin && (
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monthly Salary *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  id="salary"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className={`w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base ${
                    fieldErrors.salary ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="5000.00"
                />
              </div>
              {fieldErrors.salary && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {fieldErrors.salary}
                </p>
              )}
            </div>
          )}

          {/* Global Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-lg flex items-start">
              <AlertCircle size={18} className="sm:w-5 sm:h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 sm:py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm sm:text-base"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">{t('common.loading')}</span>
              </>
            ) : (
              <>
                {isLogin ? t('auth.loginButton') : 'Sign Up'}
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 sm:mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors text-sm sm:text-base"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {/* Demo Notice */}
        <div className="mt-3 sm:mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs sm:text-sm text-blue-700 dark:text-blue-300">
          <p><strong>Note:</strong> Make sure your backend server is running on the configured port.</p>
        </div>
      </div>
    </div>
  );
};
