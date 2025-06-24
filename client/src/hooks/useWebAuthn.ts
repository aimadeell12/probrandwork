import { useState } from 'react';
import { 
  startRegistration, 
  startAuthentication,
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable
} from '@simplewebauthn/browser';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Device } from '@capacitor/device';

export const useWebAuthn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isSupported = browserSupportsWebAuthn();

  const checkPlatformAuthenticatorAvailability = async () => {
    try {
      // Check if we're in a secure context (HTTPS or localhost)
      if (!window.isSecureContext) {
        console.warn('WebAuthn requires a secure context (HTTPS)');
        return false;
      }
      return await platformAuthenticatorIsAvailable();
    } catch (error) {
      console.error('Error checking platform authenticator:', error);
      return false;
    }
  };

  const registerBiometric = async (deviceName?: string) => {
    if (!isSupported) {
      toast({
        title: "غير مدعوم",
        description: "المصادقة البيومترية غير مدعومة في هذا المتصفح",
        variant: "destructive"
      });
      return false;
    }

    // Check secure context
    if (!window.isSecureContext) {
      toast({
        title: "خطأ أمني",
        description: "المصادقة البيومترية تتطلب اتصال آمن (HTTPS). يمكنك اختبارها في التطبيق المحمول.",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Get device info for better naming
      let finalDeviceName = deviceName;
      if (!finalDeviceName) {
        try {
          const deviceInfo = await Device.getInfo();
          finalDeviceName = `${deviceInfo.model || 'Device'} - ${deviceInfo.platform}`;
        } catch (error) {
          finalDeviceName = 'Biometric Device';
        }
      }

      // Begin registration
      const registrationOptions = await apiRequest('POST', '/api/webauthn/register/begin');
      
      // Start WebAuthn registration
      const registrationResponse = await startRegistration(registrationOptions);
      
      // Complete registration
      const verification = await apiRequest('POST', '/api/webauthn/register/finish', {
        response: registrationResponse,
        expectedChallenge: registrationOptions.challenge,
        deviceName: finalDeviceName
      });

      if (verification.verified) {
        toast({
          title: "تم التفعيل بنجاح",
          description: "تم تفعيل المصادقة البيومترية بنجاح",
        });
        return true;
      } else {
        throw new Error('Registration verification failed');
      }
    } catch (error: any) {
      console.error('WebAuthn registration error:', error);
      
      let errorMessage = "فشل في تفعيل المصادقة البيومترية";
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "تم إلغاء العملية أو لم يتم منح الإذن";
      } else if (error.name === 'NotSupportedError') {
        errorMessage = "هذا الجهاز لا يدعم المصادقة البيومترية";
      } else if (error.name === 'SecurityError') {
        errorMessage = "خطأ أمني - تأكد من أن الموقع يستخدم HTTPS";
      } else if (error.message?.includes('Failed to generate registration options')) {
        errorMessage = "خطأ في الخادم - يرجى المحاولة مرة أخرى";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "خطأ في التسجيل",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateWithBiometric = async (userIdentifier: string) => {
    if (!isSupported) {
      toast({
        title: "غير مدعوم",
        description: "المصادقة البيومترية غير مدعومة في هذا المتصفح",
        variant: "destructive"
      });
      return null;
    }

    // Check secure context
    if (!window.isSecureContext) {
      toast({
        title: "خطأ أمني",
        description: "المصادقة البيومترية تتطلب اتصال آمن (HTTPS). يمكنك اختبارها في التطبيق المحمول.",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    try {
      // Begin authentication
      const authOptions = await apiRequest('POST', '/api/webauthn/authenticate/begin', {
        userIdentifier
      });
      
      // Start WebAuthn authentication
      const authResponse = await startAuthentication(authOptions);
      
      // Complete authentication
      const verification = await apiRequest('POST', '/api/webauthn/authenticate/finish', {
        response: authResponse,
        userId: authOptions.userId,
        expectedChallenge: authOptions.challenge
      });

      if (verification.verified) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "تم تسجيل الدخول باستخدام المصادقة البيومترية",
        });
        return verification.user;
      } else {
        throw new Error('Authentication verification failed');
      }
    } catch (error: any) {
      console.error('WebAuthn authentication error:', error);
      
      let errorMessage = "فشل في تسجيل الدخول باستخدام المصادقة البيومترية";
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "تم إلغاء العملية أو لم يتم منح الإذن";
      } else if (error.name === 'NotSupportedError') {
        errorMessage = "هذا الجهاز لا يدعم المصادقة البيومترية";
      } else if (error.message?.includes('not enabled')) {
        errorMessage = "المصادقة البيومترية غير مفعلة لهذا المستخدم";
      } else if (error.message?.includes('No authenticators')) {
        errorMessage = "لم يتم العثور على أجهزة مصادقة مسجلة";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "خطأ في تسجيل الدخول",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSupported,
    isLoading,
    checkPlatformAuthenticatorAvailability,
    registerBiometric,
    authenticateWithBiometric
  };
};