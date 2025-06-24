import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageToggle } from '@/components/language-toggle';
import { Fingerprint } from 'lucide-react';
import { useBiometric } from '@/hooks/useBiometric';
import { Separator } from '@/components/ui/separator';


export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const { isNativePlatform, isLoading: biometricLoading, authenticateWithBiometric } = useBiometric();

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(t('loginFailed'));
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('welcomeBackSuccess'),
        description: t('loginSuccessful'),
      });
      // تحديث بيانات المصادقة في التخزين المؤقت
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      // إعادة التوجيه بعد تحديث البيانات
      setTimeout(() => {
        setLocation('/dashboard');
      }, 200);
    },
    onError: (error: any) => {
      toast({
        title: t('loginError'),
        description: error.message || t('checkCredentials'),
        variant: "destructive",
      });
    },
  });

  const handleBiometricLogin = async () => {
    const user = await authenticateWithBiometric();
    if (user) {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setTimeout(() => {
        setLocation('/dashboard');
      }, 200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast({
        title: t('missingData'),
        description: t('fillAllFields'),
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="px-4 sm:px-6 lg:px-8 flex flex-col justify-between h-screen relative z-10 max-w-7xl mx-auto overflow-hidden">
        
        {/* Header */}
        <div className="pt-4 sm:pt-6 text-center relative">
          {/* Language Toggle */}
          <div className="absolute top-2 right-2 z-20">
            <LanguageToggle className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border-purple-200/30" />
          </div>
          <h1 className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl lg:text-2xl mb-1 font-medium tracking-wide pt-8">
            {t('welcomeBack')}
          </h1>
          <h2 className="text-gray-900 dark:text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 tracking-tight">
            Sign In
          </h2>
        </div>

        {/* Login Form */}
        <div className="flex-1 flex items-center justify-center py-1 sm:py-2 relative">
          
          {/* Login Form Card */}
          <div className="w-full max-w-sm mx-auto">
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Login Type Toggle */}
                <div className="space-y-3">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">
                    {t('loginWith')}
                  </Label>
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setLoginType('email')}
                      className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                        loginType === 'email'
                          ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      {t('email')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginType('phone')}
                      className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                        loginType === 'phone'
                          ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      {t('phone')}
                    </button>
                  </div>
                </div>
                
                {/* Email/Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700 dark:text-gray-300 font-medium">
                    {loginType === 'email' ? t('email') : t('phoneNumber')}
                  </Label>
                  <Input
                    id="username"
                    type={loginType === 'email' ? 'email' : 'tel'}
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full h-12 rounded-xl border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-700/80"
                    placeholder={loginType === 'email' ? t('enterEmail') : t('enterPhoneNumber')}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                    {t('password')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full h-12 rounded-xl border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-700/80"
                    placeholder={t('enterPassword')}
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 border border-purple-500/20"
                >
                  {loginMutation.isPending ? t('signingIn') : t('signInTitle')}
                </Button>

                {/* Biometric Login Button */}
                {(
                  <>
                    <div className="relative my-4">
                      <Separator />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                        أو
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 rounded-xl"
                      onClick={handleBiometricLogin}
                      disabled={biometricLoading}
                    >
                      <Fingerprint className="w-5 h-5 mr-2 text-purple-600" />
                      {biometricLoading ? "جارٍ المصادقة..." : "تسجيل الدخول بالبصمة"}
                    </Button>
                  </>
                ) && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {isNativePlatform 
                      ? "استخدم بصمة الإصبع أو معرف الوجه لتسجيل دخول سريع"
                      : "المصادقة البيومترية محاكية في بيئة الويب لأغراض العرض التوضيحي"
                    }
                  </p>
                )}

                {/* Divider */}
                <div className="flex items-center justify-center pt-4">
                  <div className="w-full flex items-center">
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-400/40 to-pink-400/40"></div>
                    <span className="px-3 text-gray-500 text-sm">or</span>
                    <div className="flex-1 h-px bg-gradient-to-l from-purple-400/40 to-pink-400/40"></div>
                  </div>
                </div>

                {/* Google Login Button */}
                <Button
                  type="button"
                  onClick={() => window.location.href = '/api/auth/google'}
                  className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 border border-gray-300 flex items-center justify-center space-x-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </Button>

                {/* Sign Up Link */}
                <div className="text-center pt-2">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t('dontHaveAccount')}{' '}
                    <Link href="/register">
                      <span className="text-purple-600 dark:text-purple-400 font-medium hover:underline cursor-pointer">
                        {t('createNewAccount')}
                      </span>
                    </Link>
                  </p>
                </div>

              </form>
            </Card>
          </div>
        </div>

        {/* Back to Welcome */}
        <div className="w-full max-w-sm mx-auto pb-1">
          <Link href="/">
            <Button 
              variant="outline" 
              className="w-full h-10 sm:h-12 border-2 border-purple-300/60 dark:border-purple-400/60 text-purple-700 dark:text-purple-300 text-sm sm:text-base font-semibold rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white/95 dark:hover:bg-gray-700/95 shadow-xl hover:shadow-2xl transition-all duration-200 backdrop-blur-sm"
            >
              Back to Home
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}