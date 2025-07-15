import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface TestResult {
  success: boolean;
  message: string;
  cardholders_count?: number;
  error?: string;
  details?: any;
  timestamp: string;
}

export default function AirwallexTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const testAirwallexConnection = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/airwallex/test', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        message: 'Network error',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            اختبار Airwallex API
          </h1>
          <p className="text-gray-600">
            اختبار الاتصال مع Airwallex API للتأكد من عمل النظام
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              اختبار الاتصال
            </CardTitle>
            <CardDescription>
              سيقوم هذا الاختبار بالتحقق من:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>الاتصال مع Airwallex API</li>
                <li>صحة بيانات المصادقة</li>
                <li>استجابة الخدمة</li>
              </ul>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testAirwallexConnection}
              disabled={isLoading}
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الاختبار...
                </>
              ) : (
                'بدء الاختبار'
              )}
            </Button>

            {result && (
              <Card className={`border-2 ${
                result.success 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center gap-2 text-lg ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.success ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    {result.success ? 'نجح الاختبار' : 'فشل الاختبار'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong className="text-gray-700">الرسالة:</strong>
                    <p className={`mt-1 ${
                      result.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.message}
                    </p>
                  </div>

                  {result.cardholders_count !== undefined && (
                    <div>
                      <strong className="text-gray-700">عدد حاملي البطاقات:</strong>
                      <p className="mt-1 text-blue-600">{result.cardholders_count}</p>
                    </div>
                  )}

                  {result.error && (
                    <div>
                      <strong className="text-gray-700">تفاصيل الخطأ:</strong>
                      <pre className="mt-1 bg-gray-100 p-2 rounded text-sm overflow-auto">
                        {result.error}
                      </pre>
                    </div>
                  )}

                  {result.details && (
                    <div>
                      <strong className="text-gray-700">تفاصيل إضافية:</strong>
                      <pre className="mt-1 bg-gray-100 p-2 rounded text-sm overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    <strong>وقت الاختبار:</strong> {new Date(result.timestamp).toLocaleString('ar-EG')}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معلومات حول الاختبار</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>نوع الاختبار:</strong> استعلام عن حاملي البطاقات
            </p>
            <p>
              <strong>API Endpoint:</strong> /api/airwallex/test
            </p>
            <p>
              <strong>طريقة الاتصال:</strong> GET Request
            </p>
            <p>
              <strong>التحقق من:</strong> مصادقة API، الاتصال، واستجابة الخدمة
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}