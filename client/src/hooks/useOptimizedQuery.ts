import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { performanceMonitor } from '@/lib/performance';

// Optimized query hook with performance monitoring
export function useOptimizedQuery<T>(
  queryKey: string[],
  options?: Omit<UseQueryOptions<T>, 'queryKey'>
) {
  return useQuery({
    queryKey,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    onSuccess: (data) => {
      performanceMonitor.logApiCall(queryKey[0], 0);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error(`Query error for ${queryKey[0]}:`, error);
      options?.onError?.(error);
    },
    ...options
  });
}