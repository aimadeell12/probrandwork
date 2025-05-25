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
      
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col justify-between min-h-screen relative z-10 max-w-7xl mx-auto">
        
        {/* Header Content - Responsive */}
        <div className="pt-2 sm:pt-4">
          <h1 className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl lg:text-2xl mb-2 font-medium tracking-wide">
            Digital account
          </h1>
          <h2 className="text-gray-900 dark:text-white text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
            fully online
          </h2>
          

        </div>

        {/* Center Visual Content - Responsive */}
        <div className="flex-1 flex items-center justify-center lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center py-4">
          <div className="relative transform hover:scale-105 transition-transform duration-300">
            {/* Phone Frame with responsive sizing */}
            <div className="relative mx-auto w-40 h-60 sm:w-48 sm:h-72 lg:w-64 lg:h-96 bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-white/20">
              {/* Phone Screen */}
              <div className="p-2 sm:p-4 h-full bg-gradient-to-br from-purple-100/80 to-pink-100/80 dark:from-gray-700/80 dark:to-purple-800/80">
                {/* Mock App Interface with dollar transactions */}
                <div className="space-y-2 sm:space-y-3">
                  {/* Header balance */}
                  <div className="bg-white/60 rounded-lg shadow-sm p-1.5 sm:p-2 text-center">
                    <div className="text-sm sm:text-lg font-bold text-gray-800">$12,450</div>
                  </div>
                  
                  {/* Transaction list */}
                  <div className="space-y-1 sm:space-y-2">
                    <div className="bg-white/50 rounded-lg shadow-sm p-1.5 sm:p-2 flex justify-between items-center">
                      <div className="text-xs text-gray-700 font-medium">Amazon</div>
                      <div className="text-xs font-bold text-red-600">-$89.99</div>
                    </div>
                    <div className="bg-white/50 rounded-lg shadow-sm p-1.5 sm:p-2 flex justify-between items-center">
                      <div className="text-xs text-gray-700 font-medium">Facebook Ads</div>
                      <div className="text-xs font-bold text-red-600">-$2,500</div>
                    </div>
                    <div className="bg-white/50 rounded-lg shadow-sm p-1.5 sm:p-2 flex justify-between items-center">
                      <div className="text-xs text-gray-700 font-medium">Coffee</div>
                      <div className="text-xs font-bold text-red-600">-$12.50</div>
                    </div>
                  </div>
                  
                  {/* Quick actions */}
                  <div className="space-y-1 sm:space-y-2 mt-2 sm:mt-4">
                    <div className="h-6 sm:h-8 bg-white/40 rounded-lg shadow-sm backdrop-blur-sm flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">Send Money</span>
                    </div>
                    <div className="h-6 sm:h-8 bg-white/30 rounded-lg shadow-sm backdrop-blur-sm flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">Pay Bills</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Floating Cards - Better positioning for small screens */}
            <div className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 transform rotate-12 z-10 hover:rotate-6 transition-transform duration-300">
              <div className="w-28 h-18 sm:w-40 sm:h-28 lg:w-44 lg:h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-lg sm:rounded-xl shadow-2xl p-1.5 sm:p-3 backdrop-blur-sm border border-white/30">
                <div className="flex justify-between items-start mb-1 sm:mb-3">
                  <div className="text-xs text-gray-600 dark:text-gray-300 font-semibold">Digital</div>
                  <div className="w-3 h-2 sm:w-6 sm:h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded shadow-sm"></div>
                </div>
                <div className="text-xs sm:text-sm font-mono text-gray-800 dark:text-gray-200 mb-1 font-medium">
                  1234 5678
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  12/32
                </div>
                <div className="text-xs text-gray-800 dark:text-gray-200 mt-1 font-medium hidden sm:block">
                  MOHAMED BENNANI
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Enhanced Action Buttons - Responsive */}
        <div className="w-full max-w-md mx-auto lg:max-w-lg">
          <Link href="/login">
            <Button className="w-full h-12 sm:h-14 lg:h-16 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-base sm:text-lg lg:text-xl font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 mb-6 sm:mb-8 mt-6 sm:mt-8 border border-purple-500/20">
              LOG IN
            </Button>
          </Link>

          <Link href="/register">
            <Button 
              variant="outline" 
              className="w-full h-12 sm:h-14 lg:h-16 border-2 border-purple-300/60 dark:border-purple-400/60 text-purple-700 dark:text-purple-300 text-base sm:text-lg lg:text-xl font-semibold rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white/95 dark:hover:bg-gray-700/95 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
            >
              OPEN A DIGITAL ACCOUNT
            </Button>
          </Link>
          
          {/* Enhanced Bottom indicator - Responsive */}
          <div className="flex justify-center pt-4 sm:pt-6">
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-purple-400/40 to-pink-400/40 dark:from-white/20 dark:to-purple-300/20 rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}