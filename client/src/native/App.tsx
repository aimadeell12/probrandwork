import React from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { LanguageProvider } from "../hooks/useLanguage";
import { useAuth } from "../hooks/useAuth";
import NativeDashboard from './pages/Dashboard';
import NativeLogin from './pages/Login';

// مكونات React Native للويب
const View = ({ children, style, className, ...props }: any) => (
  <div style={style} className={className} {...props}>{children}</div>
);

const Text = ({ children, style, className, ...props }: any) => (
  <span style={style} className={className} {...props}>{children}</span>
);

const NativeApp = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <Text style={{ fontSize: 18, color: '#64748b' }}>جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <View style={{ 
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {isAuthenticated ? <NativeDashboard /> : <NativeLogin />}
        </View>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default NativeApp;