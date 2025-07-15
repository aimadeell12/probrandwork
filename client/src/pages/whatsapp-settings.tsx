import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  MessageCircle, 
  Shield, 
  Bell,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Key
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";

interface OTPStats {
  totalActive: number;
  byPurpose: Record<string, number>;
  oldestOTP: string | null;
}

export default function WhatsAppSettings() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [otpPurpose, setOtpPurpose] = useState("login");
  const [otpCode, setOtpCode] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Get OTP statistics (admin only)
  const { data: otpStats, refetch: refetchStats } = useQuery({
    queryKey: ['/api/otp/stats'],
    enabled: user?.role === 'admin'
  });

  // Get WhatsApp account info
  const { data: accountInfo, refetch: refetchAccountInfo, isLoading: accountLoading } = useQuery({
    queryKey: ['/api/whatsapp/account-info'],
    enabled: false // Only fetch when manually triggered
  });

  // Send WhatsApp message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: { to: string; message: string; language: string }) =>
      apiRequest("POST", "/api/whatsapp/send", data),
    onSuccess: () => {
      toast({
        title: "تم إرسال الرسالة",
        description: "تم إرسال رسالة WhatsApp بنجاح",
      });
      setPhone("");
      setMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إرسال الرسالة",
        variant: "destructive",
      });
    },
  });

  // Send OTP mutation
  const sendOtpMutation = useMutation({
    mutationFn: (data: { phone: string; purpose: string; language: string }) =>
      apiRequest("POST", "/api/otp/send", data),
    onSuccess: (data) => {
      toast({
        title: "تم إرسال رمز التحقق",
        description: data.message,
      });
      refetchStats();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إرسال رمز التحقق",
        variant: "destructive",
      });
    },
  });

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: (data: { phone: string; code: string; purpose: string }) =>
      apiRequest("POST", "/api/otp/verify", data),
    onSuccess: () => {
      toast({
        title: "تم التحقق بنجاح",
        description: "تم التحقق من رمز OTP بنجاح",
      });
      setOtpCode("");
      refetchStats();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "رمز التحقق غير صحيح",
        variant: "destructive",
      });
    },
  });

  // Send transaction notification mutation
  const sendNotificationMutation = useMutation({
    mutationFn: (data: { transactionType: string; amount: string; currency: string; language: string }) =>
      apiRequest("POST", "/api/notifications/send-transaction", data),
    onSuccess: () => {
      toast({
        title: "تم إرسال الإشعار",
        description: "تم إرسال إشعار المعاملة عبر WhatsApp",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إرسال الإشعار",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!phone || !message) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم الهاتف والرسالة",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate({ to: phone, message, language: 'ar' });
  };

  const handleSendOtp = () => {
    if (!otpPhone) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم الهاتف",
        variant: "destructive",
      });
      return;
    }

    sendOtpMutation.mutate({ phone: otpPhone, purpose: otpPurpose, language: 'ar' });
  };

  const handleVerifyOtp = () => {
    if (!otpPhone || !otpCode) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم الهاتف ورمز التحقق",
        variant: "destructive",
      });
      return;
    }

    verifyOtpMutation.mutate({ phone: otpPhone, code: otpCode, purpose: otpPurpose });
  };

  const handleSendTestNotification = () => {
    sendNotificationMutation.mutate({
      transactionType: 'deposit',
      amount: '100',
      currency: 'USD',
      language: 'ar'
    });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-white">
        <div className="mobile-safe-area">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-3 sm:p-4 z-50">
            <div className="flex items-center gap-3">
              <Link href="/account">
                <Button variant="ghost" size="sm" className="p-2 hover:bg-purple-500/10 rounded-full">
                  <ArrowLeft className="h-5 w-5 text-gray-700" />
                </Button>
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">إعدادات WhatsApp</h1>
            </div>
          </div>
          
          <div className="p-4 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">غير مصرح لك</h2>
            <p className="text-gray-600">تحتاج إلى صلاحيات المدير للوصول إلى هذه الصفحة</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mobile-safe-area">
        
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-3 sm:p-4 z-50">
          <div className="flex items-center gap-3">
            <Link href="/account">
              <Button variant="ghost" size="sm" className="p-2 hover:bg-purple-500/10 rounded-full">
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">إعدادات WhatsApp</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-3 sm:px-4 pb-6 space-y-4 max-w-md mx-auto">
          
          {/* OTP Statistics */}
          {otpStats && (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Key className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">إحصائيات OTP</h2>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-blue-50/80 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{otpStats.totalActive}</div>
                  <div className="text-sm text-blue-700">رموز نشطة</div>
                </div>
                <div className="text-center p-3 bg-purple-50/80 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.keys(otpStats.byPurpose).length}
                  </div>
                  <div className="text-sm text-purple-700">أنواع الأغراض</div>
                </div>
              </div>

              {Object.entries(otpStats.byPurpose).map(([purpose, count]) => (
                <div key={purpose} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-700 capitalize">{purpose}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          )}

          {/* Send WhatsApp Message */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">إرسال رسالة WhatsApp</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                  رقم الهاتف (مع رمز الدولة)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+212663381823"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 border-gray-200 focus:border-purple-500/80 focus:ring-purple-500/20 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">
                  نص الرسالة
                </Label>
                <textarea
                  id="message"
                  placeholder="اكتب رسالتك هنا..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none"
                />
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={sendMessageMutation.isPending}
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                {sendMessageMutation.isPending ? "جاري الإرسال..." : "إرسال الرسالة"}
              </Button>
            </div>
          </div>

          {/* OTP Management */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100/80 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">إدارة OTP</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="otpPhone" className="text-sm font-medium text-gray-700 mb-2 block">
                  رقم الهاتف
                </Label>
                <Input
                  id="otpPhone"
                  type="tel"
                  placeholder="+212663381823"
                  value={otpPhone}
                  onChange={(e) => setOtpPhone(e.target.value)}
                  className="h-12 border-gray-200 focus:border-purple-500/80 focus:ring-purple-500/20 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="otpPurpose" className="text-sm font-medium text-gray-700 mb-2 block">
                  الغرض
                </Label>
                <select
                  id="otpPurpose"
                  value={otpPurpose}
                  onChange={(e) => setOtpPurpose(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-900 focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 outline-none"
                >
                  <option value="login">تسجيل الدخول</option>
                  <option value="registration">التسجيل</option>
                  <option value="password_reset">إعادة تعيين كلمة المرور</option>
                  <option value="phone_verification">التحقق من الهاتف</option>
                  <option value="transaction">المعاملات</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={handleSendOtp}
                  disabled={sendOtpMutation.isPending}
                  className="h-12 bg-purple-500/80 hover:bg-purple-600/80 text-white rounded-xl"
                >
                  {sendOtpMutation.isPending ? "جاري الإرسال..." : "إرسال OTP"}
                </Button>
              </div>

              {/* Verify OTP Section */}
              <div className="border-t border-gray-100 pt-4">
                <div>
                  <Label htmlFor="otpCode" className="text-sm font-medium text-gray-700 mb-2 block">
                    رمز التحقق
                  </Label>
                  <Input
                    id="otpCode"
                    type="text"
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    className="h-12 text-center text-xl font-mono border-gray-200 focus:border-purple-500/80 focus:ring-purple-500/20 rounded-xl"
                  />
                </div>

                <Button
                  onClick={handleVerifyOtp}
                  disabled={verifyOtpMutation.isPending}
                  variant="outline"
                  className="w-full h-12 mt-3 border-purple-200 hover:bg-purple-50/80 rounded-xl"
                >
                  {verifyOtpMutation.isPending ? "جاري التحقق..." : "التحقق من OTP"}
                </Button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">إعدادات الإشعارات</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">إشعارات WhatsApp</p>
                  <p className="text-sm text-gray-600">تلقي الإشعارات عبر WhatsApp</p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>

              <Button
                onClick={handleSendTestNotification}
                disabled={sendNotificationMutation.isPending}
                variant="outline"
                className="w-full h-12 border-yellow-200 hover:bg-yellow-50 rounded-xl"
              >
                {sendNotificationMutation.isPending ? "جاري الإرسال..." : "إرسال إشعار تجريبي"}
              </Button>
            </div>
          </div>

          {/* Service Status */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">حالة الخدمات</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">خدمة WhatsApp</span>
                <Badge className="bg-green-100 text-green-700">متصلة</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">خدمة OTP</span>
                <Badge className="bg-green-100 text-green-700">نشطة</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">الإشعارات</span>
                <Badge className={notificationsEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                  {notificationsEnabled ? "مُفعلة" : "مُعطلة"}
                </Badge>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}