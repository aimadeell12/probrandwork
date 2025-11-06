import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });

  const isAuthenticated = !!user && !error;

  // No redirect logic here - let App.tsx handle routing to prevent reload loops

  return {
    user,
    isLoading,
    isAuthenticated,
  };
}
