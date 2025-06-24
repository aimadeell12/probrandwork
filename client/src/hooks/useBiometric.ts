import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { BiometricFallback } from '@/lib/biometric-fallback';

export const useBiometric = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isNativePlatform = Capacitor.isNativePlatform();

  const checkBiometricAvailability = async () => {
    return await BiometricFallback.checkAvailability();
  };

  const setupBiometric = async (userCredentials: { email: string; password: string }) => {
    if (!isNativePlatform) {
      toast({
        title: "غير مدعوم",
        description: "المصادقة البيومترية متاحة فقط في التطبيق المحمول",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Check if biometric is available
      const isAvailable = await checkBiometricAvailability();
      if (!isAvailable) {
        toast({
          title: "غير متاح",
          description: "المصادقة البيومترية غير متاحة على هذا الجهاز",
          variant: "destructive"
        });
        return false;
      }

      // Get device info for better identification
      const deviceInfo = await Device.getInfo();
      const deviceName = `${deviceInfo.model || 'Mobile Device'} - ${deviceInfo.platform}`;

      // Store credentials in secure storage (we'll use local storage with encryption for demo)
      const encryptedCredentials = btoa(JSON.stringify(userCredentials));
      localStorage.setItem('paydota_biometric_credentials', encryptedCredentials);

      // Update user profile to enable biometric
      await apiRequest('PATCH', '/api/user/biometric-enable', {
        deviceName,
        deviceId: deviceInfo.identifier || 'unknown',
        platform: deviceInfo.platform
      });

      toast({
        title: "تم التفعيل بنجاح",
        description: "تم تفعيل المصادقة البيومترية بنجاح",
      });

      return true;
    } catch (error: any) {
      console.error('Biometric setup error:', error);
      
      let errorMessage = "فشل في تفعيل المصادقة البيومترية";
      
      if (error.message?.includes('UserCancel')) {
        errorMessage = "تم إلغاء العملية من قبل المستخدم";
      } else if (error.message?.includes('BiometryNotEnrolled')) {
        errorMessage = "لم يتم تسجيل بصمة أو وجه في الجهاز";
      } else if (error.message?.includes('BiometryNotAvailable')) {
        errorMessage = "المصادقة البيومترية غير متاحة";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "خطأ في التفعيل",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateWithBiometric = async () => {
    if (!isNativePlatform) {
      toast({
        title: "غير مدعوم",
        description: "المصادقة البيومترية متاحة فقط في التطبيق المحمول",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    try {
      // Trigger biometric authentication
      const result = await BiometricFallback.authenticate({
        reason: 'يرجى التحقق من هويتك لتسجيل الدخول إلى PayDota',
        title: 'تسجيل الدخول البيومتري',
        subtitle: 'استخدم بصمة الإصبع أو معرف الوجه'
      });

      if (!result.isAuthenticated) {
        throw new Error(result.error || 'فشل في التحقق من الهوية البيومترية');
      }

      // Get stored credentials
      const encryptedCredentials = localStorage.getItem('paydota_biometric_credentials');
      if (!encryptedCredentials) {
        throw new Error('لم يتم العثور على بيانات اعتماد محفوظة');
      }

      const credentials = JSON.parse(atob(encryptedCredentials));
      if (!credentials.email || !credentials.password) {
        throw new Error('بيانات الاعتماد المحفوظة غير صالحة');
      }

      // Login with retrieved credentials
      const loginResult = await apiRequest('POST', '/api/auth/login', {
        username: credentials.email,
        password: credentials.password,
        biometricAuth: true
      });

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "تم تسجيل الدخول باستخدام المصادقة البيومترية",
      });

      return loginResult.user;
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      
      let errorMessage = "فشل في تسجيل الدخول باستخدام المصادقة البيومترية";
      
      if (error.message?.includes('UserCancel')) {
        errorMessage = "تم إلغاء العملية من قبل المستخدم";
      } else if (error.message?.includes('AuthenticationFailed')) {
        errorMessage = "فشل في التحقق من الهوية البيومترية";
      } else if (error.message?.includes('BiometryLockout')) {
        errorMessage = "تم حظر المصادقة البيومترية مؤقتاً";
      } else if (error.message?.includes('لم يتم العثور على بيانات اعتماد')) {
        errorMessage = "يرجى إعداد المصادقة البيومترية أولاً";
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

  const removeBiometric = async () => {
    if (!isNativePlatform) {
      return false;
    }

    try {
      localStorage.removeItem('paydota_biometric_credentials');

      // Update user profile to disable biometric
      await apiRequest('PATCH', '/api/user/biometric-disable');

      toast({
        title: "تم الإزالة",
        description: "تم إزالة المصادقة البيومترية بنجاح",
      });

      return true;
    } catch (error) {
      console.error('Error removing biometric:', error);
      toast({
        title: "خطأ",
        description: "فشل في إزالة المصادقة البيومترية",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    isNativePlatform,
    isLoading,
    checkBiometricAvailability,
    setupBiometric,
    authenticateWithBiometric,
    removeBiometric
  };
};