import { TrendingUp, Clock, ArrowRight, Wallet, History, Info, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function InvestmentSystem() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isInvesting, setIsInvesting] = useState(false);

  const isArabic = language === 'ar';
  const MIN_INVESTMENT = 100;

  const handleInvest = async () => {
    if (!user) {
      setLocation("/login");
      return;
    }

    const balance = parseFloat(user.walletBalance || "0");
    if (balance < MIN_INVESTMENT) {
      toast({
        title: isArabic ? "رصيد غير كافٍ" : "Insufficient Balance",
        description: isArabic 
          ? `تحتاج إلى $${MIN_INVESTMENT} على الأقل لبدء الاستثمار.`
          : `You need at least $${MIN_INVESTMENT} to start investing.`,
        variant: "destructive",
      });
      return;
    }

    setIsInvesting(true);
    try {
      await apiRequest("POST", "/api/invest", { amount: MIN_INVESTMENT });
      toast({
        title: isArabic ? "تم بنجاح" : "Success",
        description: isArabic 
          ? "تم بدء الاستثمار بنجاح، سيتم إضافة الأرباح خلال 24 ساعة."
          : "Investment started successfully. Profits will be added in 24 hours.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    } catch (error: any) {
      toast({
        title: isArabic ? "خطأ" : "Error",
        description: error.message || (isArabic ? "حدث خطأ أثناء بدء الاستثمار" : "An error occurred while starting investment"),
        variant: "destructive",
      });
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f23] pb-24">
      {/* Header Area */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10 flex flex-col items-center text-center pt-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">
            {isArabic ? 'نظام الاستثمار الذكي' : 'Smart Investment System'}
          </h1>
          <p className="text-white/80 text-sm">
            {isArabic ? 'استثمر واربح 10% يومياً' : 'Invest and earn 10% daily'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 max-w-md space-y-6">
        {/* Main Investment Card */}
        <Card className="border-0 shadow-xl rounded-[2rem] overflow-hidden bg-white dark:bg-gray-800/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center px-4 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-bold border border-red-200 dark:border-red-800">
                <Clock className="w-4 h-4 mr-2" />
                {isArabic ? 'ربح يومي ثابت' : 'Fixed Daily Profit'}
              </div>
              
              <div className="py-4">
                <span className="text-6xl font-black bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">
                  10%
                </span>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
                  {isArabic ? 'من قيمة إيداعك كل 24 ساعة' : 'Of your deposit every 24 hours'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{isArabic ? 'الحد الأدنى' : 'Min Deposit'}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">$100.00</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{isArabic ? 'المدة' : 'Duration'}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{isArabic ? 'مفتوحة' : 'Open'}</p>
                </div>
              </div>

              <Button 
                onClick={handleInvest}
                disabled={isInvesting}
                className="w-full h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-lg font-bold rounded-2xl shadow-lg shadow-red-500/30 transition-all active:scale-95"
              >
                {isInvesting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {isArabic ? 'ابدأ الاستثمار الآن' : 'Start Investing Now'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-md rounded-2xl bg-white dark:bg-gray-800/50">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{isArabic ? 'رصيد المحفظة' : 'Wallet Balance'}</p>
              <p className="text-sm font-bold">${user?.walletBalance || "0.00"}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md rounded-2xl bg-white dark:bg-gray-800/50">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                <History className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{isArabic ? 'إجمالي الأرباح' : 'Total Profits'}</p>
              <p className="text-sm font-bold">$0.00</p>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-5 h-5 text-red-600" />
            <h3 className="font-bold">{isArabic ? 'كيف يعمل النظام؟' : 'How it works?'}</h3>
          </div>
          <ul className="space-y-3">
            {[
              isArabic ? 'قم بإيداع المبلغ الذي ترغب باستثماره' : 'Deposit the amount you want to invest',
              isArabic ? 'يتم احتساب الربح تلقائياً كل 24 ساعة' : 'Profit is automatically calculated every 24 hours',
              isArabic ? 'يمكنك سحب أرباحك في أي وقت' : 'You can withdraw your profits at any time'
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
