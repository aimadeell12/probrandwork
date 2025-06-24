import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fingerprint, Smartphone, Trash2, Plus, Shield, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useBiometric } from '@/hooks/useBiometric';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Authenticator {
  id: string;
  name: string;
  credentialDeviceType: string;
  lastUsed: string | null;
  createdAt: string;
}

export default function BiometricSetup() {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState<boolean | null>(null);
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  
  const { 
    isNativePlatform,
    isLoading, 
    checkBiometricAvailability, 
    setupBiometric,
    removeBiometric
  } = useBiometric();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user profile to check biometric status
  const { data: profile } = useQuery({
    queryKey: ['/api/user/profile'],
  });

  useEffect(() => {
    const checkAvailability = async () => {
      if (isNativePlatform) {
        const available = await checkBiometricAvailability();
        setIsBiometricAvailable(available);
      } else {
        setIsBiometricAvailable(false);
      }
    };
    checkAvailability();
  }, [isNativePlatform, checkBiometricAvailability]);

  const handleSetupBiometric = async () => {
    if (!credentials.email || !credentials.password) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive"
      });
      return;
    }

    const success = await setupBiometric(credentials);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      setShowSetupForm(false);
      setCredentials({ email: '', password: '' });
    }
  };

  const handleRemoveBiometric = async () => {
    const success = await removeBiometric();
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isNativePlatform) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            المصادقة البيومترية
          </CardTitle>
          <CardDescription>
            متاحة فقط في التطبيق المحمول
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Fingerprint className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              المصادقة البيومترية متاحة فقط في تطبيق PayDota المحمول. يرجى تحميل التطبيق للاستفادة من هذه الميزة.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            المصادقة البيومترية
          </CardTitle>
          <CardDescription>
            قم بتفعيل المصادقة البيومترية لتسجيل دخول أسرع وأكثر أماناً
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isBiometricAvailable === null ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-500 mt-2">جارٍ فحص توافق الجهاز...</p>
            </div>
          ) : isBiometricAvailable ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>الجهاز يدعم المصادقة البيومترية</span>
              </div>
              
              {profile?.biometricEnabled ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Shield className="h-5 w-5" />
                    <span>المصادقة البيومترية مفعلة</span>
                  </div>
                  <Button 
                    onClick={handleRemoveBiometric}
                    disabled={isLoading}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isLoading ? "جارٍ الإزالة..." : "إزالة المصادقة البيومترية"}
                  </Button>
                </div>
              ) : showSetupForm ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={credentials.email}
                      onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">كلمة المرور</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="أدخل كلمة المرور"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSetupBiometric}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? "جارٍ الإعداد..." : "تفعيل"}
                    </Button>
                    <Button 
                      onClick={() => setShowSetupForm(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowSetupForm(true)}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  إعداد المصادقة البيومترية
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                المصادقة البيومترية متاحة فقط في تطبيق PayDota المحمول. في بيئة التطوير الحالية (متصفح الويب)، لا يمكن الوصول للأجهزة البيومترية.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                قم ببناء التطبيق باستخدام Capacitor واختبره على جهاز محمول للاستفادة من هذه الميزة.
              </p>
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  );
}