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
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; email: string; username: string; password: string }) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(t('registerError'));
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
        title: t('registerError'),
        description: error.message || (language === 'ar' ? 'يرجى المحاولة مرة أخرى' : 'Please try again'),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      toast({
        title: t('error'),
        description: language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields',
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t('error'),
        description: t('passwordsDontMatch'),
        variant: "destructive",
      });
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    registerMutation.mutate(registerData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {t('register')}
              </h1>
              <p className="text-white/70">
                {t('digitalAccount')}
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name Field */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white/80 font-medium">
                  {t('firstName')}
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full h-12 rounded-xl border-white/20 focus:border-purple-500 focus:ring-purple-500 bg-white/10 text-white placeholder-white/50"
                  placeholder={t('enterFirstName')}
                  required
                />
              </div>

              {/* Last Name Field */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white/80 font-medium">
                  {t('lastName')}
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full h-12 rounded-xl border-white/20 focus:border-purple-500 focus:ring-purple-500 bg-white/10 text-white placeholder-white/50"
                  placeholder={t('enterLastName')}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80 font-medium">
                  {t('email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full h-12 rounded-xl border-white/20 focus:border-purple-500 focus:ring-purple-500 bg-white/10 text-white placeholder-white/50"
                  placeholder={t('enterEmail')}
                  required
                />
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white/80 font-medium">
                  {t('username')}
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full h-12 rounded-xl border-white/20 focus:border-purple-500 focus:ring-purple-500 bg-white/10 text-white placeholder-white/50"
                  placeholder={t('enterUsername')}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80 font-medium">
                  {t('password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full h-12 rounded-xl border-white/20 focus:border-purple-500 focus:ring-purple-500 bg-white/10 text-white placeholder-white/50"
                  placeholder={t('enterPassword')}
                  required
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/80 font-medium">
                  {t('confirmPassword')}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full h-12 rounded-xl border-white/20 focus:border-purple-500 focus:ring-purple-500 bg-white/10 text-white placeholder-white/50"
                  placeholder={t('enterConfirmPassword')}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                >
                  {registerMutation.isPending ? (language === 'ar' ? 'جارٍ إنشاء الحساب...' : 'Creating Account...') : t('registerButton')}
                </Button>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-white/70">
                {t('alreadyHaveAccount')}{' '}
                <Link href="/login">
                  <span className="text-purple-300 hover:text-purple-200 font-semibold cursor-pointer">
                    {t('loginHere')}
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}