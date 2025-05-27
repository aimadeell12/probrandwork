import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageToggle } from '@/components/language-toggle';

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { fullName: string; email: string; password: string; referralCode?: string }) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(t('accountCreationFailed'));
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('welcome'),
        description: t('accountCreated'),
      });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: t('accountCreationError'),
        description: error.message || t('tryAgain'),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: t('incompleteData'),
        description: t('fillAllFields'),
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t('passwordMismatch'),
        description: t('checkPasswordMatch'),
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: t('weakPassword'),
        description: t('passwordMinLength'),
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      referralCode: formData.referralCode || undefined
    });
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
        <div className="pt-2 sm:pt-3 text-center relative">
          {/* Language Toggle */}
          <div className="absolute top-0 right-0">
            <LanguageToggle />
          </div>
          <h1 className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl lg:text-2xl mb-1 font-medium tracking-wide">
            {t('joinUs')}
          </h1>
          <h2 className="text-gray-900 dark:text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 tracking-tight">
            {t('createNewAccount')}
          </h2>
        </div>

        {/* Register Form */}
        <div className="flex-1 flex items-center justify-center py-1 sm:py-2 relative">
          
          {/* Register Form Card */}
          <div className="w-full max-w-sm mx-auto">
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300 font-medium">
                    {t('fullName')}
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full h-10 rounded-xl border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-700/80"
                    placeholder={t('enterFullName')}
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                    {t('email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full h-10 rounded-xl border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-700/80"
                    placeholder={t('enterEmail')}
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
                    className="w-full h-10 rounded-xl border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-700/80"
                    placeholder={t('enterPassword')}
                    required
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-medium">
                    {t('confirmPassword')}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full h-10 rounded-xl border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-700/80"
                    placeholder={t('reenterPassword')}
                    required
                  />
                </div>

                {/* Referral Code Field (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="referralCode" className="text-gray-700 dark:text-gray-300 font-medium">
                    {t('referralCode')} <span className="text-gray-500 text-sm">({t('optional')})</span>
                  </Label>
                  <Input
                    id="referralCode"
                    type="text"
                    value={formData.referralCode}
                    onChange={(e) => handleInputChange('referralCode', e.target.value.toUpperCase())}
                    className="w-full h-10 rounded-xl border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-700/80"
                    placeholder={t('enterReferralCode')}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('referralCodeHelp')}
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full h-10 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 border border-purple-500/20"
                >
                  {registerMutation.isPending ? t('creatingAccount') : t('createAccount')}
                </Button>

                {/* Divider */}
                <div className="flex items-center justify-center pt-2">
                  <div className="w-16 h-1 bg-gradient-to-r from-purple-400/40 to-pink-400/40 rounded-full"></div>
                </div>

                {/* Login Link */}
                <div className="text-center pt-2">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t('alreadyHaveAccount')}{' '}
                    <Link href="/login">
                      <span className="text-purple-600 dark:text-purple-400 font-medium hover:underline cursor-pointer">
                        {t('signIn')}
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
              className="w-full h-10 sm:h-12 border-2 border-purple-300/60 dark:border-purple-400/60 text-purple-700 dark:text-purple-300 text-sm sm:text-base font-semibold rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white/95 dark:hover:bg-gray-700/95 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
            >
              {t('backToHome')}
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}