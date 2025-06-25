import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });

  const isAuthenticated = !!user && !error;

  // Prevent any welcome page display for authenticated users
  useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '/welcome') {
        // Immediate redirect to prevent any flash of welcome page
        window.history.replaceState(null, '', '/dashboard');
        window.location.reload();
      }
    }
  }, [isAuthenticated]);

  return {
    user,
    isLoading,
    isAuthenticated,
  };
}
