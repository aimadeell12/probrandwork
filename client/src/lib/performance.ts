// Frontend performance optimizations

// Debounce function to reduce API calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), waitMs);
  };
}

// Throttle function for limiting API calls
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limitMs);
    }
  };
}

// Simple request deduplication
const pendingRequests = new Map<string, Promise<any>>();

export function dedupeRequest<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  if (pendingRequests.has(key)) {
    console.log(`🔄 Deduping request: ${key}`);
    return pendingRequests.get(key)!;
  }

  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}

// Performance monitoring
export const performanceMonitor = {
  startTime: Date.now(),
  
  logPageLoad: (pageName: string) => {
    const loadTime = Date.now() - performanceMonitor.startTime;
    console.log(`📊 Page ${pageName} loaded in ${loadTime}ms`);
  },

  logApiCall: (endpoint: string, duration: number) => {
    if (duration > 1000) {
      console.warn(`🐌 Slow API call: ${endpoint} took ${duration}ms`);
    } else {
      console.log(`⚡ API call: ${endpoint} took ${duration}ms`);
    }
  }
};