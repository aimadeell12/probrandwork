import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function CardholderTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: 'أحمد',
    lastName: 'محمد',
    email: 'ahmed.mohamed@example.com',
    phone: '+966501234567',
    dateOfBirth: '1990-01-01',
    city: 'الرياض',
    address: 'شارع الملك عبد العزيز، الرياض',
    postalCode: '12345',
    country: 'SA'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const testCardholderCreation = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('📋 Testing cardholder creation with data:', formData);
      
      const response = await fetch('/api/cardholders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'INDIVIDUAL',
          email: formData.email,
          mobile_number: formData.phone,
          individual: {
            name: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              title: 'Mr'
            },
            date_of_birth: formData.dateOfBirth,
            nationality: formData.country,
            address: {
              city: formData.city,
              country: formData.country,
              line1: formData.address,
              line2: '',
              postcode: formData.postalCode,
              state: formData.city
            },
            cardholder_agreement_terms_consent_obtained: 'yes',
            express_consent_obtained: 'yes',
            paperless_notification_consent_obtained: 'yes',
            privacy_policy_terms_consent_obtained: 'yes'
          },
          postal_address: {
            city: formData.city,
            country: formData.country,
            line1: formData.address,
            line2: '',
            postcode: formData.postalCode,
            state: formData.city
          }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        toast({
          title: "تم إنشاء Cardholder بنجاح",
          description: `ID: ${data.cardholder?.cardholder_id || data.cardholder_id}`,
        });
      } else {
        setError(data.message || 'حدث خطأ أثناء إنشاء Cardholder');
        toast({
          title: "فشل في إنشاء Cardholder",
          description: data.message || 'حدث خطأ غير متوقع',
          variant: "destructive",
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ في الاتصال';
      setError(errorMessage);
      toast({
        title: "خطأ في الاتصال",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin-panel">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">اختبار إنشاء Cardholder</h1>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Test Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-red-500" />
                بيانات Cardholder للاختبار
              </CardTitle>
              <CardDescription>
                املأ البيانات التالية لاختبار إنشاء cardholder جديد
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="أحمد"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">الاسم الأخير</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="محمد"
                  />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ahmed@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+966501234567"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">تاريخ الميلاد</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="country">الدولة</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="SA"
                  />
                </div>
                <div>
                  <Label htmlFor="city">المدينة</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="الرياض"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">الرمز البريدي</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="12345"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="شارع الملك عبد العزيز، الرياض"
                  />
                </div>
              </div>
              
              <Button 
                onClick={testCardholderCreation}
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                {isLoading ? 'جاري الإنشاء...' : 'إنشاء Cardholder'}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  نتيجة الاختبار - نجح ✅
                </CardTitle>
                <CardDescription>
                  تم إنشاء Cardholder بنجاح في Airwallex
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">معلومات Cardholder:</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>ID:</strong> {result.cardholder?.cardholder_id || result.cardholder_id}</p>
                      <p><strong>الحالة:</strong> {result.cardholder?.status || result.status}</p>
                      <p><strong>النوع:</strong> {result.cardholder?.type || result.type}</p>
                      <p><strong>البريد الإلكتروني:</strong> {result.cardholder?.email || result.email}</p>
                    </div>
                  </div>
                  <details className="bg-gray-50 p-4 rounded-lg">
                    <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                      عرض البيانات الكاملة
                    </summary>
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  نتيجة الاختبار - فشل ❌
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-700 font-semibold mb-2">خطأ:</p>
                    <p className="text-red-600">{error}</p>
                  </div>
                  
                  {error.includes('access_denied_not_enabled') && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">⚠️ مشكلة في صلاحيات Airwallex API</h4>
                      <div className="text-sm text-yellow-700 space-y-2">
                        <p><strong>المشكلة:</strong> Issuing API غير مفعل في حساب Airwallex</p>
                        <p><strong>الحل:</strong></p>
                        <ol className="list-decimal list-inside space-y-1 mt-2">
                          <li>تسجيل الدخول إلى حساب Airwallex</li>
                          <li>التواصل مع دعم Airwallex لتفعيل Issuing API</li>
                          <li>أو استخدام حساب Airwallex مختلف يدعم Issuing API</li>
                        </ol>
                      </div>
                    </div>
                  )}
                  
                  {error.includes('Unauthorized') && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">🔐 مشكلة في المصادقة</h4>
                      <div className="text-sm text-blue-700 space-y-2">
                        <p><strong>المشكلة:</strong> يجب تسجيل الدخول كمدير أولاً</p>
                        <p><strong>الحل:</strong> تسجيل الدخول باستخدام حساب إداري</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}