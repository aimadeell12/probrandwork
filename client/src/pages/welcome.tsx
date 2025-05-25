import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Phone, Smartphone } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import CardVisual from "@/components/card-visual";

export default function Welcome() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      {/* Background decorative elements - responsive */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="px-4 sm:px-6 lg:px-8 flex flex-col justify-between h-screen relative z-10 max-w-7xl mx-auto overflow-hidden">
        
        {/* Header Content - مضغوط */}
        <div className="pt-2 sm:pt-3 text-center sm:text-left">
          <h1 className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl lg:text-2xl mb-1 font-medium tracking-wide">
            Digital account
          </h1>
          <h2 className="text-gray-900 dark:text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 tracking-tight">
            fully online
          </h2>
        </div>

        {/* Center Visual Content - مضغوط ومتوازن */}
        <div className="flex-1 flex items-center justify-center py-2 sm:py-4 relative">
          {/* Credit Card positioned responsively */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-8 md:right-8 transform rotate-12 z-20 hover:rotate-6 transition-transform duration-300">
            <div className="w-40 h-24 sm:w-48 sm:h-30 md:w-56 md:h-36 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-lg sm:rounded-xl shadow-2xl p-2 sm:p-3 md:p-4 backdrop-blur-sm border border-slate-600/50 relative overflow-hidden">
              
              {/* Card background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-slate-900/80 rounded-xl"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                {/* Card header */}
                <div className="flex justify-between items-start mb-2 sm:mb-3">
                  <div className="text-white font-bold text-sm sm:text-base">DIGITAL</div>
                  {/* Mastercard-style logo */}
                  <div className="flex space-x-1">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full opacity-90"></div>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-400 rounded-full opacity-90 -ml-1"></div>
                  </div>
                </div>
                
                {/* EMV chip simulation */}
                <div className="w-6 h-4 sm:w-7 sm:h-5 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-sm mb-2 sm:mb-3 shadow-inner"></div>
                
                {/* Card number */}
                <div className="text-white font-mono text-xs sm:text-sm font-semibold tracking-wider mb-1 sm:mb-2">
                  4532 1234 5678
                </div>
                
                {/* Card details */}
                <div className="flex justify-between items-end text-xs">
                  <div>
                    <div className="text-gray-300 text-xs uppercase tracking-wide">12/28</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">M.BENNANI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative transform hover:scale-105 transition-transform duration-300">
            {/* Phone Frame with stable responsive sizing */}
            <div className="relative mx-auto w-56 h-80 sm:w-64 sm:h-96 md:w-72 md:h-[450px] lg:w-80 lg:h-[500px] bg-white/95 dark:bg-gray-800/95 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-white/30">
              {/* Phone Screen */}
              <div className="p-4 sm:p-6 h-full bg-gradient-to-br from-purple-100/90 to-pink-100/90 dark:from-gray-700/90 dark:to-purple-800/90">
                {/* Stable App Interface with avatar */}
                <div className="space-y-3 sm:space-y-4 md:space-y-6 flex flex-col items-center justify-center h-full">
                  
                  {/* Responsive Premium Avatar */}
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center border-3 sm:border-4 border-white/30">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">M</span>
                      </div>
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 sm:border-3 border-white shadow-lg"></div>
                  </div>
                  
                  {/* Responsive User info */}
                  <div className="text-center">
                    <div className="bg-white/70 rounded-xl shadow-lg p-2 sm:p-3 md:p-4 border border-white/50 min-w-[120px] sm:min-w-[140px]">
                      <div className="text-base sm:text-lg md:text-xl font-bold text-gray-800">Mohamed</div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">Digital Account Holder</div>
                    </div>
                  </div>
                  
                  {/* Responsive Status indicators */}
                  <div className="flex space-x-2 sm:space-x-3">
                    <div className="bg-white/60 rounded-full p-2 sm:p-3 shadow-md border border-white/40">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="bg-white/60 rounded-full p-2 sm:p-3 shadow-md border border-white/40">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="bg-white/60 rounded-full p-2 sm:p-3 shadow-md border border-white/40">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* أزرار مضغوطة - تناسب الشاشة بدون تمرير */}
        <div className="w-full max-w-sm mx-auto pb-2">
          <Link href="/login">
            <Button className="w-full h-10 sm:h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm sm:text-base font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 mb-3 sm:mb-4 border border-purple-500/20">
              LOG IN
            </Button>
          </Link>

          <Link href="/register">
            <Button 
              variant="outline" 
              className="w-full h-10 sm:h-12 border-2 border-purple-300/60 dark:border-purple-400/60 text-purple-700 dark:text-purple-300 text-sm sm:text-base font-semibold rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white/95 dark:hover:bg-gray-700/95 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
            >
              OPEN A DIGITAL ACCOUNT
            </Button>
          </Link>
          
          {/* مؤشر سفلي مضغوط */}
          <div className="flex justify-center pt-2 sm:pt-3">
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-purple-400/40 to-pink-400/40 dark:from-white/20 dark:to-purple-300/20 rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}