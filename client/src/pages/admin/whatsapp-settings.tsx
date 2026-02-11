import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Settings, MessageCircle, Send, BarChart3, ExternalLink, CheckCircle, XCircle, AlertCircle, Smartphone, Monitor } from "lucide-react";

interface WhatsAppSettings {
  templateName: string;
  language: 'ar' | 'en';
  phoneNumberId: string;
  accessToken: string;
  verifyToken: string;
  businessAccountId: string;
}

interface WhatsAppStats {
  messagesSent: number;
  messagesDelivered: number;
  messagesFailed: number;
  templatesUsed: number;
}

export default function WhatsAppSettings() {
  const { toast } = useToast();
  const [testPhone, setTestPhone] = useState('');
  const [testOTP, setTestOTP] = useState('');

  // Query to fetch settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/admin/whatsapp/settings'],
  });

  // Query to fetch stats  
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/whatsapp/stats'],
  });

  const [formData, setFormData] = useState<WhatsAppSettings>({
    templateName: settings?.templateName || 'otp_verification',
    language: settings?.language || 'ar',
    phoneNumberId: settings?.phoneNumberId || '',
    accessToken: settings?.accessToken || '',
    verifyToken: settings?.verifyToken || 'verify_token',
    businessAccountId: settings?.businessAccountId || '',
  });

  // Update form when settings load
  if (settings && formData.phoneNumberId !== settings.phoneNumberId) {
    setFormData(settings);
  }

  // Mutation to save settings
  const saveSettings = useMutation({
    mutationFn: async (data: WhatsAppSettings) => {
      return await apiRequest('/api/admin/whatsapp/settings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "تم الحفظ",
        description: "تم حفظ إعدادات WhatsApp بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في الحفظ",
        description: error.message || "فشل في حفظ الإعدادات",
        variant: "destructive",
      });
    },
  });

  // Mutation to test OTP sending
  const testOTPSending = useMutation({
    mutationFn: async (data: { phone: string; otp: string }) => {
      return await apiRequest('/api/admin/whatsapp/test-otp', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "نجح الإرسال",
        description: `تم إرسال رسالة الاختبار بنجاح. معرف الرسالة: ${data.messageId}`,
      });
      setTestPhone('');
      setTestOTP('');
    },
    onError: (error: any) => {
      let title = "فشل الإرسال";
      let description = error.message || "فشل في إرسال رسالة الاختبار";
      
      // Check for expired token errors
      if (error.message && error.message.includes("Session has expired")) {
        title = "رمز الوصول منتهي الصلاحية";
        description = "رمز الوصول (Access Token) انتهت صلاحيته. يرجى تحديث الرمز من Facebook Developer Console.";
      } else if (error.message && error.message.includes("OAuthException")) {
        title = "مشكلة في المصادقة";
        description = "خطأ في مصادقة WhatsApp API. تحقق من صحة رمز الوصول.";
      }
      
      toast({
        title,
        description,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings.mutate(formData);
  };

  const handleTestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone || !testOTP) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم الهاتف ورمز OTP",
        variant: "destructive",
      });
      return;
    }
    testOTPSending.mutate({ phone: testPhone, otp: testOTP });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50/80 via-pink-50/80 to-red-100/80">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">جاري تحميل الإعدادات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/80 via-pink-50/80 to-red-100/80">
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500/80 to-pink-500/80 rounded-xl flex items-center justify-center shadow-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">إعدادات WhatsApp API</h1>
              <p className="text-gray-600 text-sm sm:text-base">إدارة إعدادات WhatsApp Business API وقوالب الرسائل</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-0 h-auto sm:h-10 bg-white/60 backdrop-blur-sm border border-red-200/50">
            <TabsTrigger value="settings" className="text-xs sm:text-sm py-3 sm:py-2 data-[state=active]:bg-red-500/80 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              الإعدادات
            </TabsTrigger>
            <TabsTrigger value="test" className="text-xs sm:text-sm py-3 sm:py-2 data-[state=active]:bg-red-500/80 data-[state=active]:text-white">
              <Send className="h-4 w-4 mr-2" />
              اختبار الإرسال
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs sm:text-sm py-3 sm:py-2 data-[state=active]:bg-red-500/80 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              الإحصائيات
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-white/60 backdrop-blur-sm border border-red-200/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-t-lg">
                <CardTitle className="text-lg sm:text-xl text-gray-900 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  إعدادات API
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600">
                  قم بتكوين بيانات WhatsApp Business API
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumberId" className="text-sm font-medium text-gray-700">معرف رقم الهاتف</Label>
                      <Input
                        id="phoneNumberId"
                        value={formData.phoneNumberId}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                        placeholder="637387286132641"
                        className="h-11 border-red-200 focus:border-red-400 focus:ring-red-400/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessAccountId" className="text-sm font-medium text-gray-700">معرف الحساب التجاري</Label>
                      <Input
                        id="businessAccountId"
                        value={formData.businessAccountId}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessAccountId: e.target.value }))}
                        placeholder="576288461869738"
                        className="h-11 border-red-200 focus:border-red-400 focus:ring-red-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accessToken" className="text-sm font-medium text-gray-700">رمز الوصول</Label>
                    <Textarea
                      id="accessToken"
                      value={formData.accessToken}
                      onChange={(e) => setFormData(prev => ({ ...prev, accessToken: e.target.value }))}
                      placeholder="يرجى إدخال رمز الوصول من Facebook Developer Console"
                      className="min-h-[100px] border-red-200 focus:border-red-400 focus:ring-red-400/20"
                    />
                    <div className="bg-yellow-50/80 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>انتهت صلاحية رمز الوصول الحالي (25 يونيو 2025). يرجى الحصول على رمز جديد من:</span>
                      </p>
                      <a 
                        href="https://developers.facebook.com/apps" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-red-800 font-medium mt-2"
                      >
                        Facebook Developer Console
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="templateName" className="text-sm font-medium text-gray-700">اسم القالب</Label>
                      <Input
                        id="templateName"
                        value={formData.templateName}
                        onChange={(e) => setFormData(prev => ({ ...prev, templateName: e.target.value }))}
                        placeholder="otp_verification"
                        className="h-11 border-red-200 focus:border-red-400 focus:ring-red-400/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-sm font-medium text-gray-700">اللغة</Label>
                      <Select 
                        value={formData.language} 
                        onValueChange={(value: 'ar' | 'en') => setFormData(prev => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger className="h-11 border-red-200 focus:border-red-400 focus:ring-red-400/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verifyToken" className="text-sm font-medium text-gray-700">رمز التحقق</Label>
                    <Input
                      id="verifyToken"
                      value={formData.verifyToken}
                      onChange={(e) => setFormData(prev => ({ ...prev, verifyToken: e.target.value }))}
                      placeholder="verify_token"
                      className="h-11 border-red-200 focus:border-red-400 focus:ring-red-400/20"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={saveSettings.isPending} 
                    className="w-full h-12 bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-primary/80 hover:to-pink-600/80 text-white font-medium"
                  >
                    {saveSettings.isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Tab */}
          <TabsContent value="test">
            <Card className="bg-white/60 backdrop-blur-sm border border-red-200/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-t-lg">
                <CardTitle className="text-lg sm:text-xl text-gray-900 flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  اختبار إرسال OTP
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600">
                  اختبر إرسال رسائل OTP عبر WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleTestOTP} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="testPhone" className="text-sm font-medium text-gray-700">رقم الهاتف</Label>
                      <Input
                        id="testPhone"
                        value={testPhone}
                        onChange={(e) => setTestPhone(e.target.value)}
                        placeholder="+966501234567"
                        className="h-11 border-red-200 focus:border-red-400 focus:ring-red-400/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="testOTP" className="text-sm font-medium text-gray-700">رمز OTP</Label>
                      <Input
                        id="testOTP"
                        value={testOTP}
                        onChange={(e) => setTestOTP(e.target.value)}
                        placeholder="123456"
                        className="h-11 border-red-200 focus:border-red-400 focus:ring-red-400/20"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={testOTPSending.isPending} 
                    className="w-full h-12 bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-primary/80 hover:to-pink-600/80 text-white font-medium"
                  >
                    {testOTPSending.isPending ? "جاري الإرسال..." : "إرسال رسالة اختبار"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="bg-white/60 backdrop-blur-sm border border-red-200/50 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">الرسائل المرسلة</p>
                      <p className="text-2xl font-bold text-primary">{stats?.messagesSent || 0}</p>
                    </div>
                    <Send className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border border-red-200/50 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">الرسائل المُسلمة</p>
                      <p className="text-2xl font-bold text-green-600">{stats?.messagesDelivered || 0}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border border-red-200/50 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">الرسائل الفاشلة</p>
                      <p className="text-2xl font-bold text-primary">{stats?.messagesFailed || 0}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border border-red-200/50 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">القوالب المستخدمة</p>
                      <p className="text-2xl font-bold text-blue-600">{stats?.templatesUsed || 0}</p>
                    </div>
                    <MessageCircle className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Card */}
            <Card className="bg-white/60 backdrop-blur-sm border border-red-200/50 shadow-lg mt-6">
              <CardHeader className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-t-lg">
                <CardTitle className="text-lg sm:text-xl text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  حالة النظام
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${settings?.phoneNumberId ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm font-medium text-gray-700">
                      {settings?.phoneNumberId ? "WhatsApp API جاهز للاستخدام" : "يرجى تكوين إعدادات API"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}