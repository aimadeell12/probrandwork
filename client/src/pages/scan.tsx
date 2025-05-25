import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, QrCode, Camera, User, DollarSign } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Scan() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    // محاكاة عملية المسح
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "تم مسح الكود بنجاح",
        description: "تم العثور على معلومات الدفع",
      });
      // يمكن هنا إعادة التوجيه لصفحة الإرسال مع البيانات المملأة مسبقاً
      setLocation("/send");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-purple-200/30 dark:border-purple-700/30 p-4 relative z-10">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            مسح الكود
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6 relative z-10 max-w-md mx-auto">
        
        {/* QR Scanner Area */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <div className={`w-48 h-48 mx-auto rounded-3xl border-4 border-dashed ${
                isScanning 
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                  : "border-purple-300 bg-purple-50 dark:bg-purple-900/20"
              } flex items-center justify-center mb-6 transition-all duration-300`}>
                {isScanning ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <Camera className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-green-600 font-medium">جاري المسح...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">
                      ضع الكود في المنطقة المحددة
                    </p>
                  </div>
                )}
              </div>

              {!isScanning ? (
                <Button
                  onClick={handleStartScan}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  بدء المسح
                </Button>
              ) : (
                <Button
                  onClick={() => setIsScanning(false)}
                  variant="outline"
                  className="w-full bg-white/80 dark:bg-gray-700/80 border-purple-200/30 hover:bg-purple-50"
                >
                  إلغاء المسح
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">كيفية الاستخدام</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">اطلب من المرسل إليه إظهار كود QR</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">تأكد من وضوح الكود وعدم وجود ظلال</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">وجه الكاميرا نحو الكود</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">ضع الكود في وسط الشاشة</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">تأكد من المعلومات وأرسل</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">راجع المبلغ والمستقبل قبل الإرسال</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setLocation("/send")}
            variant="outline"
            className="bg-white/80 dark:bg-gray-700/80 border-purple-200/30 hover:bg-purple-50 py-4 rounded-2xl"
          >
            <User className="h-5 w-5 mr-2" />
            إرسال يدوي
          </Button>
          
          <Button
            onClick={() => setLocation("/deposit")}
            variant="outline"
            className="bg-white/80 dark:bg-gray-700/80 border-purple-200/30 hover:bg-purple-50 py-4 rounded-2xl"
          >
            <DollarSign className="h-5 w-5 mr-2" />
            إيداع أموال
          </Button>
        </div>
      </div>
    </div>
  );
}