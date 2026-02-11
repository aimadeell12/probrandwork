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
    <div className="min-h-screen bg-white dark:bg-background relative overflow-hidden">
      {/* Mobile safe area for status bar */}
      <div className="mobile-safe-area" />
      
      {/* Background decorative elements - responsive sizing */}
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-red-200/15 to-pink-200/15 dark:from-red-500/5 dark:to-pink-500/5 rounded-full blur-xl"></div>
      
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 flex flex-col justify-between min-h-screen relative z-10 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto safe-area-inset">
        
        {/* Header */}
        <div className="pt-1 pb-1 sm:pt-2 sm:pb-2 md:pt-4 md:pb-3 text-center relative">
          {/* Language Toggle */}
          <div className="absolute top-0 right-0 z-20">
            <LanguageToggle className="bg-white/90 dark:bg-background/90 backdrop-blur-sm shadow-sm border-gray-200/30 dark:border-border scale-90 sm:scale-100" />
          </div>
          <h1 className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg mb-1 font-medium tracking-wide pt-4 sm:pt-6 md:pt-8">
            {t('welcomeBack')}
          </h1>
          <h2 className="text-gray-900 dark:text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 tracking-tight">
            Sign In
          </h2>
        </div>

        {/* Login Form */}
        <div className="flex-1 flex items-center justify-center py-1 sm:py-2 md:py-4 relative">
          
          {/* Login Form Card */}
          <div className="w-full">
            <Card className="bg-white dark:bg-background border border-gray-200 dark:border-border shadow-xl rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                
                {/* Login Type Toggle */}
                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base md:text-lg">
                    {t('loginWith')}
                  </Label>
                  <div className="flex bg-gray-100 dark:bg-muted rounded-lg sm:rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setLoginType('email')}
                      className={`flex-1 py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-5 text-xs sm:text-sm md:text-base font-medium rounded-md sm:rounded-lg transition-all duration-200 ${
                        loginType === 'email'
                          ? 'bg-white dark:bg-background text-primary dark:text-red-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      {t('email')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginType('phone')}
                      className={`flex-1 py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-5 text-xs sm:text-sm md:text-base font-medium rounded-md sm:rounded-lg transition-all duration-200 ${
                        loginType === 'phone'
                          ? 'bg-white dark:bg-background text-primary dark:text-red-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      {t('phone')}
                    </button>
                  </div>
                </div>
                
                {/* Email/Phone Field */}
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="username" className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base md:text-lg">
                    {loginType === 'email' ? t('email') : t('phoneNumber')}
                  </Label>
                  <Input
                    id="username"
                    type={loginType === 'email' ? 'email' : 'tel'}
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full h-11 sm:h-12 md:h-14 rounded-lg sm:rounded-xl border-gray-200 dark:border-border focus:border-red-500 focus:ring-red-500 bg-white dark:bg-background text-base md:text-lg"
                    placeholder={loginType === 'email' ? t('enterEmail') : t('enterPhoneNumber')}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base md:text-lg">
                    {t('password')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full h-11 sm:h-12 md:h-14 rounded-lg sm:rounded-xl border-gray-200 dark:border-border focus:border-red-500 focus:ring-red-500 bg-white dark:bg-background text-base md:text-lg"
                    placeholder={t('enterPassword')}
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full h-11 sm:h-12 md:h-14 lg:h-16 wallet-gradient hover:opacity-90 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base md:text-lg"
                >
                  {loginMutation.isPending ? t('signingIn') : t('signInTitle')}
                </Button>

                {/* Divider */}
                <div className="flex items-center justify-center pt-3 sm:pt-4 md:pt-5">
                  <div className="w-full flex items-center">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-border"></div>
                    <span className="px-2 sm:px-3 md:px-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm md:text-base">or</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-border"></div>
                  </div>
                </div>

                {/* Google Login Button */}
                <Button
                  type="button"
                  onClick={() => window.location.href = '/api/auth/google'}
                  className="w-full h-11 sm:h-12 md:h-14 lg:h-16 bg-white dark:bg-background hover:bg-gray-50 dark:hover:bg-muted text-gray-700 dark:text-gray-300 font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-gray-300 dark:border-border flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base md:text-lg"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </Button>

                {/* Sign Up Link */}
                <div className="text-center pt-1.5 sm:pt-2 md:pt-3">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm md:text-base">
                    {t('dontHaveAccount')}{' '}
                    <Link href="/register">
                      <span className="text-primary dark:text-red-400 font-semibold hover:underline cursor-pointer">
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
        <div className="w-full pb-1.5 sm:pb-2 md:pb-4 pt-1.5 sm:pt-2 md:pt-3">
          <Link href="/">
            <Button 
              variant="outline" 
              className="w-full h-10 sm:h-12 md:h-14 border-2 border-gray-200 dark:border-border text-gray-700 dark:text-gray-300 font-medium rounded-lg sm:rounded-xl bg-white dark:bg-background hover:bg-gray-50 dark:hover:bg-muted shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base md:text-lg"
            >
              Back to Home
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}