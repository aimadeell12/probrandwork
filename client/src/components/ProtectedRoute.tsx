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
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "غير مصرح",
        description: "يجب عليك تسجيل الدخول للوصول إلى هذه الصفحة. جاري التوجيه...",
        variant: "destructive",
      });
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, toast, setLocation]);

  // Show loading while checking authentication
  if (isLoading) {
    return <AppLoadingSkeleton />;
  }

  // If not authenticated, redirect (useEffect will handle the redirect)
  if (!isAuthenticated) {
    return null; // Return nothing while redirecting
  }

  return <>{children}</>;
}