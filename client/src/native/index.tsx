import React from 'react';
import { createRoot } from 'react-dom/client';
import NativeApp from './App';
import '../index.css';

// React Native for Web Entry Point
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<NativeApp />);
} else {
  console.error('Root container not found');
}