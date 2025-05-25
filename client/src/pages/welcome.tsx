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
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="px-6 py-8 flex flex-col justify-between min-h-screen relative z-10">
        
        {/* Header Content */}
        <div className="pt-4">
          <h1 className="text-gray-700 dark:text-gray-300 text-xl mb-2 font-medium tracking-wide">
            Digital account
          </h1>
          <h2 className="text-gray-900 dark:text-white text-5xl font-bold mb-12 tracking-tight">
            fully online
          </h2>
        </div>

        {/* Center Visual Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative transform hover:scale-105 transition-transform duration-300">
            {/* Phone Frame with enhanced styling */}
            <div className="relative mx-auto w-56 h-80 bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-white/20">
              {/* Phone Screen */}
              <div className="p-4 h-full bg-gradient-to-br from-purple-100/80 to-pink-100/80 dark:from-gray-700/80 dark:to-purple-800/80">
                {/* Mock App Interface with improved visuals */}
                <div className="space-y-3">
                  <div className="h-5 bg-white/60 rounded-lg shadow-sm"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-white/50 rounded w-3/4 shadow-sm"></div>
                    <div className="h-3 bg-white/50 rounded w-1/2 shadow-sm"></div>
                  </div>
                  
                  {/* Mock Content Areas with better styling */}
                  <div className="space-y-2 mt-6">
                    <div className="h-10 bg-white/40 rounded-lg shadow-sm backdrop-blur-sm"></div>
                    <div className="h-10 bg-white/30 rounded-lg shadow-sm backdrop-blur-sm"></div>
                    <div className="h-6 bg-white/35 rounded shadow-sm backdrop-blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Floating Cards */}
            <div className="absolute -top-6 -right-6 transform rotate-12 z-10 hover:rotate-6 transition-transform duration-300">
              <div className="w-40 h-28 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-xl shadow-2xl p-3 backdrop-blur-sm border border-white/30">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-xs text-gray-600 dark:text-gray-300 font-semibold">Digital</div>
                  <div className="w-6 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded shadow-sm"></div>
                </div>
                <div className="text-sm font-mono text-gray-800 dark:text-gray-200 mb-1 font-medium">
                  1234 5678 9987
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  12/32
                </div>
                <div className="text-xs text-gray-800 dark:text-gray-200 mt-1 font-medium">
                  MOHAMED BENNANI
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div>
          <Link href="/login">
            <Button className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 mb-8 mt-8 border border-purple-500/20">
              LOG IN
            </Button>
          </Link>

          <Link href="/register">
            <Button 
              variant="outline" 
              className="w-full h-14 border-2 border-purple-300/60 dark:border-purple-400/60 text-purple-700 dark:text-purple-300 text-lg font-semibold rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white/95 dark:hover:bg-gray-700/95 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
            >
              OPEN A DIGITAL ACCOUNT
            </Button>
          </Link>
          
          {/* Enhanced Bottom indicator */}
          <div className="flex justify-center pt-6">
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400/40 to-pink-400/40 dark:from-white/20 dark:to-purple-300/20 rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}