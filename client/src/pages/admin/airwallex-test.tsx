import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function AirwallexTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const testEndpoint = async (endpoint: string, method: string = 'GET', description: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      
      const result = {
        endpoint,
        method,
        description,
        status: response.status,
        success: response.ok,
        data: data,
        timestamp: new Date().toLocaleString()
      };

      setResults(prev => [...prev, result]);
      
      return result;
    } catch (err: any) {
      const result = {
        endpoint,
        method,
        description,
        status: 'Network Error',
        success: false,
        data: { error: err.message },
        timestamp: new Date().toLocaleString()
      };

      setResults(prev => [...prev, result]);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const runAllTests = async () => {
    setResults([]);
    
    toast({
      title: "بدء اختبار Airwallex API",
      description: "جاري فحص جميع endpoints...",
    });

    // Test authentication
    await testEndpoint('/api/test/airwallex/auth', 'GET', 'اختبار المصادقة');
    
    // Test account information
    await testEndpoint('/api/test/airwallex/account', 'GET', 'اختبار معلومات الحساب');
    
    // Test cardholder creation
    await testEndpoint('/api/test/airwallex/cardholder', 'POST', 'اختبار إنشاء cardholder');
    
    // Test getting cardholders
    await testEndpoint('/api/test/airwallex/cardholders', 'GET', 'اختبار جلب cardholders');
    
    toast({
      title: "اكتمل الاختبار",
      description: "تم فحص جميع endpoints",
    });
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin-panel">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">اختبار Airwallex API</h1>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-blue-500" />
                اختبار الاتصال مع Airwallex
              </CardTitle>
              <CardDescription>
                فحص جميع endpoints للتأكد من عمل API بشكل صحيح
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  onClick={runAllTests}
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isLoading ? 'جاري الاختبار...' : 'تشغيل جميع الاختبارات'}
                </Button>
                
                <Button 
                  onClick={() => testEndpoint('/api/test/airwallex/account', 'GET', 'اختبار معلومات الحساب')}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600"
                >
                  عرض Account ID
                </Button>
                
                <Button 
                  onClick={() => testEndpoint('/api/airwallex/account-info', 'GET', 'معلومات الحساب المحدّثة')}
                  disabled={isLoading}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  معلومات محدّثة
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={clearResults}
                  disabled={isLoading}
                >
                  مسح النتائج
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>نتائج الاختبار</CardTitle>
                <CardDescription>
                  عدد الاختبارات: {results.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-semibold">{result.description}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          result.success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Endpoint:</strong> {result.method} {result.endpoint}
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-2">
                        <strong>الوقت:</strong> {result.timestamp}
                      </div>
                      
                      {/* Show Account ID prominently if available */}
                      {result.data?.account_info?.account_id && (
                        <div className="mt-3 p-3 bg-green-50 rounded-md">
                          <h4 className="font-semibold text-green-800 mb-2">معلومات الحساب:</h4>
                          <div className="text-sm">
                            <p><strong>Account ID:</strong> <code className="bg-green-100 px-2 py-1 rounded text-green-800">{result.data.account_info.account_id}</code></p>
                            <p><strong>Subject ID:</strong> <code className="bg-green-100 px-2 py-1 rounded text-green-800">{result.data.account_info.sub}</code></p>
                            <p><strong>API Version:</strong> {result.data.account_info.api_version}</p>
                            <p><strong>Data Center:</strong> {result.data.account_info.data_center_region}</p>
                            <p><strong>PADC:</strong> {result.data.account_info.padc}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Show updated account info from new endpoint */}
                      {result.data?.account_id && (
                        <div className="mt-3 p-3 bg-purple-50 rounded-md">
                          <h4 className="font-semibold text-purple-800 mb-2">معلومات الحساب المحدّثة:</h4>
                          <div className="text-sm">
                            <p><strong>Account ID:</strong> <code className="bg-purple-100 px-2 py-1 rounded text-purple-800">{result.data.account_id}</code></p>
                            <p><strong>Subject ID:</strong> <code className="bg-purple-100 px-2 py-1 rounded text-purple-800">{result.data.subject_id}</code></p>
                            <p><strong>API Version:</strong> {result.data.api_version}</p>
                            <p><strong>Data Center:</strong> {result.data.data_center}</p>
                            <p><strong>Issued At:</strong> {result.data.issued_at}</p>
                            <p><strong>Expires At:</strong> {result.data.expires_at}</p>
                          </div>
                        </div>
                      )}
                      
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                          عرض التفاصيل الكاملة
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Status Summary */}
          <Card>
            <CardHeader>
              <CardTitle>حالة API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>مفاتيح API متوفرة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      results.some(r => r.success) ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span>الاتصال مع Airwallex: {
                      results.length === 0 ? 'غير محدد' : 
                      results.some(r => r.success) ? 'يعمل' : 'لا يعمل'
                    }</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      results.some(r => r.description.includes('cardholder') && r.success) ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span>Issuing API: {
                      results.length === 0 ? 'غير محدد' : 
                      results.some(r => r.description.includes('cardholder') && r.success) ? 'مفعل' : 'غير مفعل'
                    }</span>
                  </div>
                </div>
                
                {/* Account ID Display */}
                {results.some(r => r.data?.account_info?.account_id) && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <h4 className="font-semibold text-blue-800 mb-2">معلومات الحساب:</h4>
                    <p className="text-sm">
                      <strong>Account ID:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">
                        {results.find(r => r.data?.account_info?.account_id)?.data.account_info.account_id}
                      </code>
                    </p>
                  </div>
                )}
                
                {/* Error Explanation */}
                {results.some(r => !r.success && r.data?.error?.includes('access_denied_not_enabled')) && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ تتطلب تفعيل من Airwallex</h4>
                    <p className="text-sm text-yellow-700">
                      الخطأ 403 يعني أن Issuing API غير مفعل في حسابك. تحتاج للتواصل مع Account Manager في Airwallex لتفعيل Cards Product و Issuing APIs.
                    </p>
                  </div>
                )}
                
                {/* Next Steps */}
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="font-semibold text-gray-800 mb-2">الخطوات التالية:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• تواصل مع Airwallex Account Manager</li>
                    <li>• اطلب تفعيل Cards Product</li>
                    <li>• اطلب تفعيل Issuing APIs</li>
                    <li>• تأكد من إضافة أموال في Airwallex Wallet</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}