import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Phone, Smartphone } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import CardVisual from "@/components/card-visual";

export default function Welcome() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="px-6 py-8 flex flex-col justify-between min-h-screen">
        
        {/* Header Content */}
        <div className="pt-4">
          <h1 className="text-gray-800 dark:text-gray-200 text-xl mb-2">
            Digital account
          </h1>
          <h2 className="text-gray-900 dark:text-white text-4xl font-bold mb-12">
            fully online
          </h2>
        </div>

        {/* Center Visual Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            {/* Phone Frame */}
            <div className="relative mx-auto w-56 h-80 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
              {/* Phone Screen */}
              <div className="p-4 h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-purple-800">
                {/* Mock App Interface */}
                <div className="space-y-3">
                  <div className="h-5 bg-white/50 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-white/40 rounded w-3/4"></div>
                    <div className="h-3 bg-white/40 rounded w-1/2"></div>
                  </div>
                  
                  {/* Mock Content Areas */}
                  <div className="space-y-2 mt-6">
                    <div className="h-10 bg-white/30 rounded-lg"></div>
                    <div className="h-10 bg-white/20 rounded-lg"></div>
                    <div className="h-6 bg-white/25 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-6 -right-6 transform rotate-12 z-10">
              <div className="w-40 h-28 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg shadow-xl p-3">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-xs text-gray-600 dark:text-gray-300">Digital</div>
                  <div className="w-6 h-4 bg-yellow-400 rounded"></div>
                </div>
                <div className="text-sm font-mono text-gray-800 dark:text-gray-200 mb-1">
                  1234 5678 9987
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  12/32
                </div>
                <div className="text-xs text-gray-800 dark:text-gray-200 mt-1">
                  MOHAMED BENNANI
                </div>
              </div>
            </div>

            <div className="absolute -top-2 -left-6 transform -rotate-6 z-10">
              <div className="w-40 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg shadow-xl p-3 text-white">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-xs opacity-80">Digital</div>
                  <div className="w-6 h-4 bg-yellow-300 rounded"></div>
                </div>
                <div className="text-sm font-mono mb-1">
                  •••• •••• ••••
                </div>
                <div className="text-xs opacity-80">
                  PREMIUM CARD
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div>
          <Link href="/login">
            <Button className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-xl shadow-lg mb-8">
              LOG IN
            </Button>
          </Link>

          <Link href="/register">
            <Button 
              variant="outline" 
              className="w-full h-14 border-2 border-purple-200 dark:border-purple-400 text-purple-700 dark:text-purple-300 text-lg font-medium rounded-xl bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-700/90 shadow-lg"
            >
              OPEN A DIGITAL ACCOUNT
            </Button>
          </Link>
          
          {/* Bottom indicator */}
          <div className="flex justify-center pt-4">
            <div className="w-24 h-1 bg-black/30 dark:bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}