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
        
        {/* Header Content - Improved */}
        <div className="pt-4 sm:pt-6 text-center sm:text-left">
          <h1 className="text-gray-700 dark:text-gray-300 text-xl sm:text-2xl lg:text-3xl mb-3 font-medium tracking-wide">
            Digital account
          </h1>
          <h2 className="text-gray-900 dark:text-white text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 sm:mb-12 tracking-tight">
            fully online
          </h2>
        </div>

        {/* Center Visual Content - Enhanced */}
        <div className="flex-1 flex items-center justify-center py-8 sm:py-12">
          <div className="relative transform hover:scale-105 transition-transform duration-300">
            {/* Phone Frame with better sizing and positioning */}
            <div className="relative mx-auto w-64 h-96 sm:w-72 sm:h-[450px] lg:w-80 lg:h-[500px] bg-white/95 dark:bg-gray-800/95 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-white/30">
              {/* Phone Screen */}
              <div className="p-4 sm:p-6 h-full bg-gradient-to-br from-purple-100/90 to-pink-100/90 dark:from-gray-700/90 dark:to-purple-800/90">
                {/* Mock App Interface with avatar */}
                <div className="space-y-4 sm:space-y-6 flex flex-col items-center justify-center h-full">
                  
                  {/* Premium Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center border-4 border-white/30">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl sm:text-3xl font-bold text-white">M</span>
                      </div>
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
                  </div>
                  
                  {/* User info */}
                  <div className="text-center">
                    <div className="bg-white/70 rounded-xl shadow-lg p-3 sm:p-4 border border-white/50">
                      <div className="text-lg sm:text-xl font-bold text-gray-800">Mohamed</div>
                      <div className="text-sm text-gray-600 mt-1">Digital Account Holder</div>
                    </div>
                  </div>
                  
                  {/* Status indicators */}
                  <div className="flex space-x-3">
                    <div className="bg-white/60 rounded-full p-3 shadow-md border border-white/40">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="bg-white/60 rounded-full p-3 shadow-md border border-white/40">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="bg-white/60 rounded-full p-3 shadow-md border border-white/40">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Realistic Credit Card */}
            <div className="absolute -top-8 -right-8 sm:-top-12 sm:-right-12 transform rotate-12 z-10 hover:rotate-6 transition-transform duration-300">
              <div className="w-56 h-36 sm:w-64 sm:h-40 lg:w-72 lg:h-44 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl shadow-2xl p-5 sm:p-6 backdrop-blur-sm border border-slate-600/50 relative overflow-hidden">
                
                {/* Card background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-slate-900/80 rounded-2xl"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  {/* Card header */}
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div className="text-white font-bold text-lg">DIGITAL</div>
                    {/* Mastercard-style logo */}
                    <div className="flex space-x-1">
                      <div className="w-6 h-6 bg-red-500 rounded-full opacity-90"></div>
                      <div className="w-6 h-6 bg-yellow-400 rounded-full opacity-90 -ml-2"></div>
                    </div>
                  </div>
                  
                  {/* EMV chip simulation */}
                  <div className="w-8 h-6 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md mb-4 shadow-inner"></div>
                  
                  {/* Card number */}
                  <div className="text-white font-mono text-lg sm:text-xl font-semibold tracking-widest mb-3 sm:mb-4">
                    4532 1234 5678 9012
                  </div>
                  
                  {/* Card details */}
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-gray-300 text-xs uppercase tracking-wide mb-1">Valid Thru</div>
                      <div className="text-white font-semibold">12/28</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-300 text-xs uppercase tracking-wide mb-1">Cardholder</div>
                      <div className="text-white font-semibold text-sm">MOHAMED BENNANI</div>
                    </div>
                  </div>
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