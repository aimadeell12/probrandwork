import React from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { LanguageProvider } from "../hooks/useLanguage";
import '../index.css';

// Simple layout without expo-router dependency
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
          {children}
        </div>
      </LanguageProvider>
    </QueryClientProvider>
  );
}