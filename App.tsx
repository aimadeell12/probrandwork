import React from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./client/src/lib/queryClient";
import { LanguageProvider } from "./client/src/hooks/useLanguage";
import NativeApp from './client/src/native/App';

// Expo-compatible App component for React Native Web
export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        // Pre-load resources
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('App preparation error:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0066CC',
        color: '#ffffff',
        fontSize: '18px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        PayDota Banking
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
          <NativeApp />
        </div>
      </LanguageProvider>
    </QueryClientProvider>
  );
}