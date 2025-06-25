import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { AppLoadingSkeleton } from "@/components/skeletons";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && location !== "/login") {
      toast({
        title: "غير مصرح",
        description: "يجب عليك تسجيل الدخول للوصول إلى هذه الصفحة",
        variant: "destructive",
      });
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading, location, toast]);

  // Show loading while checking authentication
  if (isLoading) {
    return <AppLoadingSkeleton />;
  }

  // If not authenticated, redirect using window.location for immediate effect
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}