import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Fingerprint } from 'lucide-react';
import { useWebAuthn } from '@/hooks/useWebAuthn';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';

interface BiometricLoginButtonProps {
  userIdentifier: string;
  disabled?: boolean;
  className?: string;
}

export default function BiometricLoginButton({ 
  userIdentifier, 
  disabled = false, 
  className = "" 
}: BiometricLoginButtonProps) {
  const { isSupported, isLoading, authenticateWithBiometric } = useWebAuthn();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const handleBiometricLogin = async () => {
    if (!userIdentifier) {
      toast({
        title: "مطلوب معرف المستخدم",
        description: "يرجى إدخال البريد الإلكتروني أو اسم المستخدم أولاً",
        variant: "destructive"
      });
      return;
    }

    const user = await authenticateWithBiometric(userIdentifier);
    if (user) {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setTimeout(() => {
        setLocation('/dashboard');
      }, 200);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full ${className}`}
      onClick={handleBiometricLogin}
      disabled={disabled || isLoading || !userIdentifier}
    >
      <Fingerprint className="w-4 h-4 mr-2" />
      {isLoading ? "جارٍ المصادقة..." : "تسجيل الدخول بالبصمة"}
    </Button>
  );
}