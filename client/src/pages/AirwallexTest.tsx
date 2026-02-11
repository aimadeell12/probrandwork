import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface TestResult {
  success: boolean;
  message: string;
  tests?: {
    authentication: { success: boolean; message: string; details: any };
    issuing_access: { success: boolean; message: string; details: any };
    overall_status: string;
  };
  credentials_configured?: boolean;
  api_mode?: string;
  cardholders_count?: number;
  error?: string;
  details?: any;
  timestamp: string;
}

interface AccountInfo {
  success: boolean;
  message: string;
  account?: any;
  is_mock?: boolean;
  error?: string;
  details?: any;
  timestamp: string;
}

export default function AirwallexTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardsInfo, setCardsInfo] = useState<any>(null);

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

  const getAccountInfo = async () => {
    setAccountLoading(true);
    setAccountInfo(null);

    try {
      const response = await fetch('/api/airwallex/account', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setAccountInfo(data);
    } catch (error: any) {
      setAccountInfo({
        success: false,
        message: 'Network error',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setAccountLoading(false);
    }
  };

  const getCardsInfo = async () => {
    setCardsLoading(true);
    setCardsInfo(null);

    try {
      const response = await fetch('/api/test/airwallex/cards', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setCardsInfo(data);
    } catch (error: any) {
      setCardsInfo({
        success: false,
        message: 'Network error',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setCardsLoading(false);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                onClick={testAirwallexConnection}
                disabled={isLoading}
                className="bg-primary hover:bg-primary"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري الاختبار...
                  </>
                ) : (
                  'اختبار الاتصال'
                )}
              </Button>

              <Button 
                onClick={getAccountInfo}
                disabled={accountLoading}
                variant="outline"
                className="border-red-500 text-primary hover:bg-yellow-50"
              >
                {accountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري التحميل...
                  </>
                ) : (
                  'عرض معرف الحساب'
                )}
              </Button>

              <Button 
                onClick={getCardsInfo}
                disabled={cardsLoading}
                variant="outline"
                className="border-green-500 text-primary hover:bg-yellow-50"
              >
                {cardsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري التحميل...
                  </>
                ) : (
                  'اختبار جلب البطاقات'
                )}
              </Button>
            </div>

            {result && (
              <Card className={`border-2 ${
                result.success 
                  ? 'border-yellow-200 bg-yellow-50' 
                  : 'border-yellow-200 bg-yellow-50'
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
                    <strong className="text-gray-700">حالة النظام:</strong>
                    <p className={`mt-1 font-semibold ${
                      result.success ? 'text-primary' : 'text-orange-600'
                    }`}>
                      {result.message}
                    </p>
                  </div>

                  {result.api_mode && (
                    <div>
                      <strong className="text-gray-700">وضع API:</strong>
                      <p className={`mt-1 ${
                        result.api_mode === 'production' ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {result.api_mode === 'production' ? 'الإنتاج (Production)' : 'المحاكاة (Mock)'}
                      </p>
                    </div>
                  )}

                  {result.credentials_configured !== undefined && (
                    <div>
                      <strong className="text-gray-700">بيانات الاعتماد:</strong>
                      <p className={`mt-1 ${
                        result.credentials_configured ? 'text-primary' : 'text-primary'
                      }`}>
                        {result.credentials_configured ? '✓ مُهيأة' : '✗ غير مُهيأة'}
                      </p>
                    </div>
                  )}

                  {result.tests && (
                    <div className="space-y-3">
                      <strong className="text-gray-700">تفاصيل الاختبارات:</strong>
                      
                      {/* Authentication Test */}
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          {result.tests.authentication.success ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <strong className="text-sm">اختبار المصادقة</strong>
                        </div>
                        <p className="text-sm text-gray-600">
                          {result.tests.authentication.message}
                        </p>
                      </div>

                      {/* Issuing API Test */}
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          {result.tests.issuing_access.success ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <strong className="text-sm">اختبار Issuing API</strong>
                        </div>
                        <p className="text-sm text-gray-600">
                          {result.tests.issuing_access.message}
                        </p>
                        {result.tests.issuing_access.details && (
                          <div className="mt-2">
                            <details className="text-xs">
                              <summary className="cursor-pointer text-blue-600">عرض التفاصيل</summary>
                              <pre className="mt-1 bg-white p-2 rounded text-xs overflow-auto border">
                                {JSON.stringify(result.tests.issuing_access.details, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {result.cardholders_count !== undefined && (
                    <div>
                      <strong className="text-gray-700">عدد حاملي البطاقات:</strong>
                      <p className="mt-1 text-blue-600">{result.cardholders_count}</p>
                    </div>
                  )}

                  {result.error && (
                    <div>
                      <strong className="text-gray-700">رسالة الخطأ:</strong>
                      <pre className="mt-1 bg-yellow-50 p-2 rounded text-sm overflow-auto border border-yellow-200">
                        {result.error}
                      </pre>
                    </div>
                  )}

                  {result.details && !result.tests && (
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

            {accountInfo && (
              <Card className={`border-2 ${
                accountInfo.success 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-yellow-200 bg-yellow-50'
              }`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center gap-2 text-lg ${
                    accountInfo.success ? 'text-blue-700' : 'text-red-700'
                  }`}>
                    {accountInfo.success ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    معلومات الحساب
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong className="text-gray-700">حالة:</strong>
                    <p className={`mt-1 font-semibold ${
                      accountInfo.success ? 'text-blue-600' : 'text-primary'
                    }`}>
                      {accountInfo.message}
                    </p>
                  </div>

                  {accountInfo.is_mock !== undefined && (
                    <div>
                      <strong className="text-gray-700">نوع البيانات:</strong>
                      <p className={`mt-1 ${
                        accountInfo.is_mock ? 'text-gray-600' : 'text-blue-600'
                      }`}>
                        {accountInfo.is_mock ? 'بيانات تجريبية (Mock)' : 'بيانات حقيقية (Production)'}
                      </p>
                    </div>
                  )}

                  {accountInfo.account && (
                    <div className="space-y-2">
                      <strong className="text-gray-700">تفاصيل الحساب:</strong>
                      
                      {accountInfo.account.id && (
                        <div className="bg-white p-3 rounded border">
                          <strong className="text-sm text-green-700">Account ID:</strong>
                          <p className="mt-1 font-mono text-sm bg-gray-100 p-2 rounded break-all">
                            {accountInfo.account.id}
                          </p>
                        </div>
                      )}

                      {accountInfo.account.legal_company_name && (
                        <div className="bg-white p-2 rounded border">
                          <strong className="text-sm text-gray-700">اسم الشركة:</strong>
                          <p className="text-sm">{accountInfo.account.legal_company_name}</p>
                        </div>
                      )}

                      {accountInfo.account.country && (
                        <div className="bg-white p-2 rounded border">
                          <strong className="text-sm text-gray-700">البلد:</strong>
                          <p className="text-sm">{accountInfo.account.country}</p>
                        </div>
                      )}

                      {accountInfo.account.status && (
                        <div className="bg-white p-2 rounded border">
                          <strong className="text-sm text-gray-700">الحالة:</strong>
                          <p className={`text-sm ${
                            accountInfo.account.status === 'ACTIVE' ? 'text-primary' : 'text-orange-600'
                          }`}>
                            {accountInfo.account.status}
                          </p>
                        </div>
                      )}

                      <details className="text-xs">
                        <summary className="cursor-pointer text-blue-600">عرض كامل البيانات</summary>
                        <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(accountInfo.account, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}

                  {accountInfo.error && (
                    <div>
                      <strong className="text-gray-700">رسالة الخطأ:</strong>
                      <pre className="mt-1 bg-yellow-50 p-2 rounded text-sm overflow-auto border border-yellow-200">
                        {accountInfo.error}
                      </pre>
                    </div>
                  )}

                  {accountInfo.details && (
                    <div>
                      <strong className="text-gray-700">تفاصيل الخطأ:</strong>
                      <pre className="mt-1 bg-gray-100 p-2 rounded text-sm overflow-auto">
                        {JSON.stringify(accountInfo.details, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    <strong>وقت الاستعلام:</strong> {new Date(accountInfo.timestamp).toLocaleString('ar-EG')}
                  </div>
                </CardContent>
              </Card>
            )}

            {cardsInfo && (
              <Card className={`border-2 ${
                cardsInfo.success 
                  ? 'border-yellow-200 bg-yellow-50' 
                  : 'border-yellow-200 bg-yellow-50'
              }`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center gap-2 text-lg ${
                    cardsInfo.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {cardsInfo.success ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    نتائج اختبار البطاقات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong className="text-gray-700">حالة:</strong>
                    <p className={`mt-1 font-semibold ${
                      cardsInfo.success ? 'text-primary' : 'text-primary'
                    }`}>
                      {cardsInfo.message}
                    </p>
                  </div>

                  {cardsInfo.count !== undefined && (
                    <div>
                      <strong className="text-gray-700">عدد البطاقات:</strong>
                      <p className="mt-1 text-blue-600 font-semibold">
                        {cardsInfo.count} بطاقة
                      </p>
                    </div>
                  )}

                  {cardsInfo.cards && cardsInfo.cards.length > 0 && (
                    <div className="space-y-2">
                      <strong className="text-gray-700">بيانات البطاقات:</strong>
                      
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {cardsInfo.cards.map((card: any, index: number) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {card.id && (
                                <div>
                                  <strong className="text-gray-600">Card ID:</strong>
                                  <p className="font-mono text-xs break-all">{card.id}</p>
                                </div>
                              )}
                              {card.status && (
                                <div>
                                  <strong className="text-gray-600">الحالة:</strong>
                                  <p className={`${
                                    card.status === 'ACTIVE' ? 'text-primary' : 'text-orange-600'
                                  }`}>{card.status}</p>
                                </div>
                              )}
                              {card.type && (
                                <div>
                                  <strong className="text-gray-600">النوع:</strong>
                                  <p>{card.type}</p>
                                </div>
                              )}
                              {card.cardholder_id && (
                                <div>
                                  <strong className="text-gray-600">Cardholder ID:</strong>
                                  <p className="font-mono text-xs break-all">{card.cardholder_id}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <details className="text-xs">
                        <summary className="cursor-pointer text-blue-600">عرض البيانات الكاملة</summary>
                        <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(cardsInfo.cards, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}

                  {cardsInfo.error && (
                    <div>
                      <strong className="text-gray-700">رسالة الخطأ:</strong>
                      <pre className="mt-1 bg-yellow-50 p-2 rounded text-sm overflow-auto border border-yellow-200">
                        {cardsInfo.error}
                      </pre>
                    </div>
                  )}

                  {cardsInfo.details && (
                    <div>
                      <strong className="text-gray-700">تفاصيل الخطأ:</strong>
                      <pre className="mt-1 bg-gray-100 p-2 rounded text-sm overflow-auto">
                        {JSON.stringify(cardsInfo.details, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    <strong>وقت الاستعلام:</strong> {new Date(cardsInfo.timestamp).toLocaleString('ar-EG')}
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
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div>
              <p><strong>نوع الاختبار:</strong> تشخيص شامل لـ Airwallex API</p>
              <p><strong>API Endpoint:</strong> /api/airwallex/test</p>
              <p><strong>التحقق من:</strong> مصادقة API، الاتصال، وتفعيل Issuing API</p>
            </div>
            
            <div className="border-t pt-3">
              <p className="font-semibold text-gray-700 mb-2">حالات النتائج المحتملة:</p>
              <ul className="space-y-1 text-xs">
                <li>✅ <strong>نجح كاملاً:</strong> API مفعل وجاهز للاستخدام</li>
                <li>🔶 <strong>مصادقة OK - Issuing API معطل:</strong> بيانات الاعتماد صحيحة لكن يحتاج تفعيل Issuing</li>
                <li>❌ <strong>باستخدام المحاكاة:</strong> لا توجد بيانات اعتماد حقيقية</li>
              </ul>
            </div>

            {result && result.tests && !result.tests.issuing_access.success && 
             result.tests.issuing_access.details?.code === 'access_denied_not_enabled' && (
              <div className="bg-orange-50 border border-orange-200 p-3 rounded">
                <p className="font-semibold text-orange-800 mb-2">📋 كيفية حل مشكلة "Issuing API معطل":</p>
                <ol className="text-xs space-y-1 text-orange-700">
                  <li>1. تسجيل الدخول إلى حساب Airwallex</li>
                  <li>2. الانتقال إلى قسم Developer Console</li>
                  <li>3. طلب تفعيل Card Issuing APIs</li>
                  <li>4. انتظار الموافقة من فريق Airwallex</li>
                  <li>5. التحقق من صلاحيات API Key الحالي</li>
                </ol>
                <p className="text-xs text-orange-600 mt-2">
                  <strong>ملاحظة:</strong> قد يتطلب التفعيل موافقة وثائق إضافية من Airwallex.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}