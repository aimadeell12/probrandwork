import { CreditCard, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function AirwallexCards() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f23] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-2xl">
              <CreditCard className="h-16 w-16 text-white" />
            </div>
            {/* Animated clock icon */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-[#1a1a35] rounded-full flex items-center justify-center shadow-lg border-4 border-gray-50 dark:border-[#0f0f23]">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Coming Soon Text */}
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {language === 'ar' ? 'قريباً' : 'Coming Soon'}
        </h1>
        
        <h2 className="text-xl lg:text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-6">
          {t("cards")}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
          {language === 'ar' 
            ? 'نحن نعمل على إطلاق خدمة البطاقات قريباً. ترقبوا الإطلاق!'
            : 'We are working on launching our cards service soon. Stay tuned!'}
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center gap-3 mt-8">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}