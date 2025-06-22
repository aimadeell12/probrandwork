import React from 'react';
import { useAuth } from "../hooks/useAuth";
import NativeDashboard from '../native/pages/Dashboard';
import NativeLogin from '../native/pages/Login';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

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