import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Smartphone, Trash2, Plus, Shield, CheckCircle } from 'lucide-react';
import { useWebAuthn } from '@/hooks/useWebAuthn';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
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
  const [isPlatformAvailable, setIsPlatformAvailable] = useState<boolean | null>(null);
  const { 
    isSupported, 
    isLoading, 
    checkPlatformAuthenticatorAvailability, 
    registerBiometric 
  } = useWebAuthn();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's authenticators
  const { data: authenticators = [], isLoading: loadingAuth } = useQuery<Authenticator[]>({
    queryKey: ['/api/webauthn/authenticators'],
  });

  // Delete authenticator mutation
  const deleteAuthenticatorMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/webauthn/authenticators/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webauthn/authenticators'] });
      toast({
        title: "تم الحذف",
        description: "تم حذف جهاز المصادقة بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حذف جهاز المصادقة",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    const checkAvailability = async () => {
      if (isSupported) {
        // Check if we're in a secure context first
        if (!window.isSecureContext) {
          setIsPlatformAvailable(false);
          return;
        }
        const available = await checkPlatformAuthenticatorAvailability();
        setIsPlatformAvailable(available);
      }
    };
    checkAvailability();
  }, [isSupported, checkPlatformAuthenticatorAvailability]);

  const handleRegisterBiometric = async () => {
    const success = await registerBiometric();
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['/api/webauthn/authenticators'] });
    }
  };

  const handleDeleteAuthenticator = (id: string) => {
    deleteAuthenticatorMutation.mutate(id);
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

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            المصادقة البيومترية
          </CardTitle>
          <CardDescription>
            غير مدعومة في هذا المتصفح
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Fingerprint className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              المتصفح الحالي لا يدعم المصادقة البيومترية. يرجى استخدام متصفح حديث أو تطبيق PayDota المحمول.
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
          {isPlatformAvailable === null ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-500 mt-2">جارٍ فحص توافق الجهاز...</p>
            </div>
          ) : isPlatformAvailable ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>الجهاز يدعم المصادقة البيومترية</span>
              </div>
              
              <Button 
                onClick={handleRegisterBiometric}
                disabled={isLoading}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isLoading ? "جارٍ الإعداد..." : "إضافة مصادقة بيومترية جديدة"}
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {!window.isSecureContext 
                  ? "المصادقة البيومترية تتطلب اتصال آمن (HTTPS). ستعمل في التطبيق المحمول."
                  : "هذا الجهاز لا يدعم المصادقة البيومترية أو لم يتم تفعيلها."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Registered Authenticators */}
      <Card>
        <CardHeader>
          <CardTitle>الأجهزة المسجلة</CardTitle>
          <CardDescription>
            الأجهزة التي يمكنك استخدامها لتسجيل الدخول
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingAuth ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-500 mt-2">جارٍ تحميل الأجهزة...</p>
            </div>
          ) : authenticators.length === 0 ? (
            <div className="text-center py-6">
              <Fingerprint className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد أجهزة مسجلة</p>
              <p className="text-sm text-gray-400">قم بإضافة جهاز جديد للبدء</p>
            </div>
          ) : (
            <div className="space-y-3">
              {authenticators.map((auth) => (
                <div key={auth.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{auth.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {auth.credentialDeviceType === 'singleDevice' ? 'جهاز واحد' : 'متعدد الأجهزة'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          تم الإنشاء: {formatDate(auth.createdAt)}
                        </span>
                      </div>
                      {auth.lastUsed && (
                        <span className="text-xs text-gray-400">
                          آخر استخدام: {formatDate(auth.lastUsed)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف جهاز المصادقة</AlertDialogTitle>
                        <AlertDialogDescription>
                          هل أنت متأكد من حذف جهاز المصادقة "{auth.name}"؟ 
                          لن تتمكن من استخدامه لتسجيل الدخول بعد الحذف.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteAuthenticator(auth.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}