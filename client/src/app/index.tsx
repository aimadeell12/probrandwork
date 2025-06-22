import React from 'react';
import { useAuth } from "../hooks/useAuth";
import { useRouter } from 'expo-router';
import NativeDashboard from '../native/pages/Dashboard';
import NativeLogin from '../native/pages/Login';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <span style={{ fontSize: 18, color: '#64748b' }}>جاري التحميل...</span>
      </div>
    );
  }

  return isAuthenticated ? <NativeDashboard /> : <NativeLogin />;
}