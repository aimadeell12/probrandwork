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
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
        <div className="flex items-center space-x-2">
          <span>21:54</span>
          <div className="w-4 h-4 rounded-full bg-gray-400"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-gray-400 rounded"></div>
            <div className="w-1 h-3 bg-gray-400 rounded"></div>
            <div className="w-1 h-3 bg-gray-800 dark:bg-gray-200 rounded"></div>
            <div className="w-1 h-3 bg-gray-800 dark:bg-gray-200 rounded"></div>
          </div>
          <div className="text-xs bg-green-500 text-white px-1 rounded">71%</div>
        </div>
      </div>

      <div className="px-6 pt-8">
        {/* Logo */}
        <div className="mb-12">
          <div className="bg-black dark:bg-white rounded-xl p-4 w-fit">
            <div className="flex items-center">
              <span className="text-white dark:text-black text-xl font-bold">Digital</span>
              <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <h1 className="text-gray-800 dark:text-gray-200 text-lg mb-2">
            Digital account
          </h1>
          <h2 className="text-gray-900 dark:text-white text-3xl font-bold mb-8">
            fully online
          </h2>

          {/* Phone and Cards Mockup */}
          <div className="relative mb-16">
            {/* Phone Frame */}
            <div className="relative mx-auto w-64 h-96 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
              {/* Phone Screen */}
              <div className="p-4 h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-purple-800">
                {/* Mock App Interface */}
                <div className="space-y-4">
                  <div className="h-6 bg-white/50 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-white/40 rounded w-3/4"></div>
                    <div className="h-4 bg-white/40 rounded w-1/2"></div>
                  </div>
                  
                  {/* Mock Buttons */}
                  <div className="space-y-3 mt-8">
                    <div className="h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm font-medium">SE CONNECTER</span>
                    </div>
                    <div className="h-12 bg-white/80 rounded-xl flex items-center justify-center">
                      <span className="text-gray-700 text-sm">OUVRIR UN COMPTE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-8 -right-4 transform rotate-12">
              <div className="w-48 h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-xl shadow-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs text-gray-600 dark:text-gray-300">Digital</div>
                  <div className="w-8 h-6 bg-yellow-400 rounded"></div>
                </div>
                <div className="text-lg font-mono text-gray-800 dark:text-gray-200 mb-2">
                  1234 5678 9987 6047
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  12/32
                </div>
                <div className="text-xs text-gray-800 dark:text-gray-200 mt-1">
                  MOHAMED BENNANI
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -left-8 transform -rotate-6">
              <div className="w-48 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl shadow-lg p-4 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs opacity-80">Digital</div>
                  <div className="w-8 h-6 bg-yellow-300 rounded"></div>
                </div>
                <div className="text-lg font-mono mb-2">
                  •••• •••• •••• ••••
                </div>
                <div className="text-xs opacity-80">
                  PREMIUM CARD
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <Link href="/login">
            <Button className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-xl">
              LOG IN
            </Button>
          </Link>

          <Link href="/register">
            <Button 
              variant="outline" 
              className="w-full h-14 border-2 border-purple-200 dark:border-purple-400 text-purple-700 dark:text-purple-300 text-lg font-medium rounded-xl bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80"
            >
              OPEN A DIGITAL ACCOUNT
            </Button>
          </Link>
        </div>

        {/* Bottom indicator */}
        <div className="flex justify-center pb-8">
          <div className="w-32 h-1 bg-black dark:bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
}