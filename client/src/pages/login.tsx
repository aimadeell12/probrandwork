import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('فشل في تسجيل الدخول');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "مرحباً بعودتك!",
        description: "تم تسجيل الدخول بنجاح",
      });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "يرجى التحقق من البيانات المدخلة",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول",
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
        <div className="pt-2 sm:pt-3 text-center">
          <h1 className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl lg:text-2xl mb-1 font-medium tracking-wide">
            مرحباً بعودتك
          </h1>
          <h2 className="text-gray-900 dark:text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 tracking-tight">
            تسجيل الدخول
          </h2>
        </div>

        {/* Login Form */}
        <div className="flex-1 flex items-center justify-center py-1 sm:py-2 relative">
          
          {/* Login Form Card */}
          <div className="w-full max-w-sm mx-auto">
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full h-12 rounded-xl border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-700/80"
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                    كلمة المرور
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full h-12 rounded-xl border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-700/80"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 border border-purple-500/20"
                >
                  {loginMutation.isPending ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>

                {/* Divider */}
                <div className="flex items-center justify-center pt-4">
                  <div className="w-16 h-1 bg-gradient-to-r from-purple-400/40 to-pink-400/40 rounded-full"></div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center pt-2">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    ليس لديك حساب؟{' '}
                    <Link href="/register">
                      <span className="text-purple-600 dark:text-purple-400 font-medium hover:underline cursor-pointer">
                        إنشاء حساب جديد
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
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}