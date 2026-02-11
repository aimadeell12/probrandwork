import { CreditCard, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function AirwallexCards() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f23] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-[#e11d48] rounded-full flex items-center justify-center shadow-2xl">
              <CreditCard className="h-16 w-16 text-white" />
            </div>
            {/* Animated clock icon */}
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-[#3a1010] rounded-full flex items-center justify-center shadow-lg border-2 border-[#0f0f23]">
              <Clock className="h-5 w-5 text-red-400" />
            </div>
          </div>
        </div>

        {/* Coming Soon Text */}
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
          {language === 'ar' ? 'قريباً' : 'Coming Soon'}
        </h1>
        
        <h2 className="text-lg font-semibold text-red-400 mb-8 uppercase tracking-wider">
          {t("cards")}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-base mb-10 leading-relaxed max-w-[280px] mx-auto opacity-80">
          {language === 'ar' 
            ? 'نحن نعمل على إطلاق خدمة البطاقات قريباً. ترقبوا الإطلاق!'
            : 'We are working on launching our cards service soon. Stay tuned!'}
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full opacity-100"></div>
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full opacity-60"></div>
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full opacity-30"></div>
        </div>
      </div>
    </div>
  );
}