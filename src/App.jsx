import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx';
import { Loading } from './components/common/Loading.jsx';
import { LoginForm } from './components/auth/LoginForm.jsx';
import { Dashboard } from './components/dashboard/Dashboard.jsx';
import { useTranslation } from 'react-i18next';

const AppContent = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return <Loading message={t('dashboard.initializingApp')} />;
  }

  return user ? <Dashboard /> : <LoginForm />;
};

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}