// Client-side performance optimizations

// Reduce React re-renders with optimized components
export const memo = <T extends object>(Component: React.ComponentType<T>) => {
  return React.memo(Component, (prevProps, nextProps) => {
    // Shallow comparison for performance
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  });
};

// Lazy load components for better initial load time
export const LazyComponent = (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
  return React.lazy(importFn);
};

// Optimize images for mobile
export const optimizeImageLoading = () => {
  if (typeof window !== 'undefined' && 'loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      (img as HTMLImageElement).loading = 'lazy';
    });
  }
};

// Service worker for better caching
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  }
};