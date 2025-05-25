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

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, language } = useLanguage();
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
      if (!response.ok) throw new Error(t('loginError'));
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('welcome'),
        description: t('loginSuccessful'),
      });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: t('loginError'),
        description: error.message || t('invalidCredentials'),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast({
        title: t('error'),
        description: language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields',
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(formData);
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
                {t('login')}
              </h1>
              <p className="text-white/70">
                {t('welcomeMessage')}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
              >
                {loginMutation.isPending ? (language === 'ar' ? 'جارٍ الدخول...' : 'Logging in...') : t('loginButton')}
              </Button>
            </form>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-white/70">
                {t('dontHaveAccount')}{' '}
                <Link href="/register">
                  <span className="text-purple-300 hover:text-purple-200 font-semibold cursor-pointer">
                    {t('registerHere')}
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