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

  // Show loading while checking authentication
  if (isLoading) {
    return <AppLoadingSkeleton />;
  }

  // If not authenticated, immediately redirect to login
  if (!isAuthenticated) {
    if (location !== "/login") {
      toast({
        title: "غير مصرح",
        description: "يجب عليك تسجيل الدخول للوصول إلى هذه الصفحة",
        variant: "destructive",
      });
      setLocation("/login");
    }
    return null;
  }

  return <>{children}</>;
}