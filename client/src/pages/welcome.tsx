import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Phone, Smartphone } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import CardVisual from "@/components/card-visual";

export default function Welcome() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Mobile safe area for status bar */}
      <div className="mobile-safe-area" />
      
      {/* Simplified background decorative elements - responsive sizing */}
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-gradient-to-tr from-blue-200/8 to-purple-200/8 rounded-full blur-xl"></div>
      
      {/* Mobile Layout - optimized for all screen sizes */}
      <div className="lg:hidden px-3 sm:px-4 md:px-6 flex flex-col justify-between min-h-screen relative z-10 max-w-sm sm:max-w-md mx-auto safe-area-inset">
        
        {/* Header Content - optimized for all mobile screens */}
        <div className="pt-4 sm:pt-6 text-center">
          <h1 className="text-gray-600 text-base sm:text-lg mb-1 sm:mb-2 font-light tracking-wide">
            Banking account
          </h1>
          <h2 className="text-gray-900 text-xl sm:text-2xl font-bold mb-3 sm:mb-4 tracking-tight">
            fully <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">online</span>
          </h2>
        </div>

        {/* Center Visual Content - responsive card design */}
        <div className="flex-1 flex items-center justify-center py-2 sm:py-4 relative">
          
          {/* Modern Digital Card - responsive */}
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
            <div className="relative bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 transform rotate-3 hover:rotate-1 transition-all duration-300 border border-slate-700/50 aspect-[1.6/1]">
              {/* Card background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/25 via-purple-600/15 to-transparent rounded-xl sm:rounded-2xl"></div>
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-bl from-white/15 to-transparent rounded-full blur-2xl"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                {/* Card header */}
                <div className="flex justify-between items-start">
                  <div className="font-bold text-sm sm:text-base lg:text-lg tracking-wide">
                    <span className="text-purple-400">PAY</span><span className="text-white">dota</span>
                  </div>
                  {/* Card logos */}
                  <div className="flex -space-x-0.5 sm:-space-x-1">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full"></div>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
                
                {/* Smart chip */}
                <div className="w-8 h-5 sm:w-10 sm:h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md sm:rounded-lg shadow-inner"></div>
                
                {/* Card number */}
                <div className="text-white font-mono text-sm sm:text-base lg:text-lg font-bold tracking-wider">
                  4532 1234 5678 9012
                </div>
                
                {/* Card details */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-gray-300 text-[10px] sm:text-xs uppercase tracking-wide mb-0.5">Valid Thru</div>
                    <div className="text-white font-bold text-xs sm:text-sm">12/28</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-xs sm:text-sm">AIMAD</div>
                    <div className="text-gray-300 text-[10px] sm:text-xs">Account Holder</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse shadow-md"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse delay-75 shadow-md"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full animate-pulse delay-150 shadow-md"></div>
            </div>
          </div>
        </div>

        {/* Enhanced responsive buttons */}
        <div className="w-full pb-3 sm:pb-4 space-y-4 sm:space-y-6">
          <Link href="/login">
            <Button className="w-full h-12 sm:h-14 bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <span className="relative z-10 tracking-wide">LOG IN</span>
            </Button>
          </Link>

          <Link href="/register">
            <Button 
              variant="outline" 
              className="w-full h-12 sm:h-14 border-2 border-purple-300 hover:border-purple-400 text-purple-700 hover:text-purple-800 text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl bg-white hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <span className="relative z-10 tracking-wide text-center leading-tight">OPEN A DIGITAL ACCOUNT</span>
            </Button>
          </Link>
          
          {/* Bottom indicator */}
          <div className="flex justify-center pt-2 sm:pt-3">
            <div className="w-12 h-1 sm:w-16 sm:h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full shadow-md"></div>
          </div>
        </div>
      </div>

      {/* Desktop Layout (lg and above) - simplified and responsive */}
      <div className="hidden lg:flex min-h-screen relative z-10 bg-white">
        {/* Elegant Left Panel - Content */}
        <div className="flex-1 flex flex-col justify-center px-16 xl:px-24 2xl:px-40 relative">
          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-32 left-20 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-xl"></div>
          
          <div className="max-w-2xl relative z-10">
            {/* Optimized Typography */}
            <div className="mb-12">
              <div className="mb-4">
                <span className="inline-block px-4 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full border border-purple-200/50 dark:border-purple-400/30 backdrop-blur-sm">
                  ✨ Next Generation Banking
                </span>
              </div>
              
              <h1 className="text-gray-500 dark:text-gray-400 text-xl xl:text-2xl font-light mb-3 tracking-wide">
                Digital account
              </h1>
              <h2 className="text-gray-900 dark:text-white text-3xl xl:text-4xl 2xl:text-5xl font-black mb-6 leading-tight tracking-tight">
                fully <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">online</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm xl:text-base leading-relaxed font-medium max-w-md">
                Experience the <span className="font-semibold text-purple-600 dark:text-purple-400">future of banking</span> with our cutting-edge digital platform. 
                Manage your finances with complete <span className="font-semibold text-blue-600 dark:text-blue-400">freedom</span> and <span className="font-semibold text-green-600 dark:text-green-400">security</span>.
              </p>
            </div>

            {/* Compact Action Buttons */}
            <div className="space-y-12 mb-12">
              <Link href="/login">
                <Button className="group w-full max-w-xs h-11 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-purple-500/30 transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 border border-purple-500/30 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="flex items-center justify-center space-x-2 relative z-10">
                    <span className="tracking-wide">LOG IN</span>
                    <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse group-hover:animate-bounce"></div>
                  </span>
                </Button>
              </Link>

              <Link href="/register">
                <Button 
                  variant="outline" 
                  className="group w-full max-w-xs h-11 border-2 border-purple-300/70 dark:border-purple-400/70 text-purple-700 dark:text-purple-300 text-sm font-semibold rounded-xl bg-white/95 dark:bg-gray-800/95 hover:bg-gradient-to-r hover:from-white hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-purple-900/50 shadow-lg hover:shadow-purple-500/20 transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 via-pink-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 tracking-wide">OPEN A DIGITAL ACCOUNT</span>
                </Button>
              </Link>
            </div>

            {/* Compact Features Grid */}
            <div className="grid grid-cols-3 gap-6">
              <div className="group text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-purple-200/40 group-hover:border-purple-300/60 group-hover:shadow-md group-hover:shadow-purple-500/20 transition-all duration-300">
                  <CreditCard className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Instant Cards</div>
              </div>
              <div className="group text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-blue-200/40 group-hover:border-blue-300/60 group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                  <Smartphone className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Mobile First</div>
              </div>
              <div className="group text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-green-200/40 group-hover:border-green-300/60 group-hover:shadow-md group-hover:shadow-green-500/20 transition-all duration-300">
                  <Phone className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">24/7 Support</div>
              </div>
            </div>

            {/* Compact Trust Indicators */}
            <div className="mt-8 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Fast</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Global</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ultra-Premium Right Panel - Visual Showcase */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Floating Elements Background */}
          <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse"></div>
          
          {/* Showcase Container */}
          <div className="relative transform hover:scale-[1.02] transition-all duration-700">
            
            {/* Elegant Compact Credit Card */}
            <div className="absolute -top-12 -left-24 lg:-left-28 xl:-left-32 transform rotate-12 z-40 hover:rotate-6 hover:scale-105 transition-all duration-500 group">
              <div className="w-64 h-40 lg:w-72 lg:h-44 xl:w-80 xl:h-48 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 rounded-2xl shadow-2xl p-4 lg:p-5 xl:p-6 backdrop-blur-sm border border-slate-600/50 relative overflow-hidden">
                {/* Card background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-slate-900/90 rounded-2xl"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-xl"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Card header */}
                  <div className="flex justify-between items-start">
                    <div className="text-white font-black text-base lg:text-lg xl:text-xl tracking-wider">DIGITAL</div>
                    <div className="flex space-x-1">
                      <div className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 bg-red-500 rounded-full opacity-90 shadow-lg"></div>
                      <div className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 bg-yellow-400 rounded-full opacity-90 -ml-1 shadow-lg"></div>
                    </div>
                  </div>
                  
                  {/* EMV chip */}
                  <div className="w-8 h-6 lg:w-10 lg:h-7 xl:w-12 xl:h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md shadow-inner border border-yellow-200/30"></div>
                  
                  {/* Card number */}
                  <div className="text-white font-mono text-sm lg:text-base xl:text-lg font-bold tracking-[0.15em] lg:tracking-[0.2em] xl:tracking-[0.25em]">
                    4532 1234 5678 9012
                  </div>
                  
                  {/* Card details */}
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-gray-300 text-xs uppercase tracking-wider mb-1">Valid Thru</div>
                      <div className="text-white font-bold text-sm lg:text-base xl:text-lg">12/28</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-sm lg:text-base xl:text-lg tracking-wide">M.BENNANI</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Secondary Card */}
            <div className="absolute -bottom-12 -right-20 transform -rotate-6 z-30 opacity-40 hover:opacity-70 transition-all duration-500">
              <div className="w-56 h-36 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 rounded-xl shadow-xl p-4 backdrop-blur-sm border border-blue-600/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-blue-900/80 rounded-xl"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="text-white/80 font-bold text-sm">VIRTUAL</div>
                  <div className="w-8 h-5 bg-gradient-to-br from-blue-200 to-blue-400 rounded-sm"></div>
                  <div className="text-white/70 font-mono text-sm tracking-widest">•••• •••• 8902</div>
                </div>
              </div>
            </div>

            {/* Optimized Phone Frame */}
            <div className="relative w-72 h-[500px] lg:w-80 lg:h-[550px] xl:w-84 xl:h-[580px] bg-gradient-to-br from-white/95 to-gray-100/95 dark:from-gray-800/95 dark:to-gray-700/95 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-sm border-2 border-white/50 dark:border-gray-600/50 transform hover:scale-105 transition-all duration-500 group">
              
              {/* Phone notch */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gray-900 dark:bg-gray-300 rounded-full z-50"></div>
              
              {/* Phone Screen Content */}
              <div className="p-6 lg:p-8 h-full bg-gradient-to-br from-purple-50/95 via-pink-50/95 to-blue-50/95 dark:from-gray-700/95 dark:via-purple-800/95 dark:to-blue-800/95 mt-6">
                <div className="space-y-6 lg:space-y-8 flex flex-col items-center justify-center h-full">
                  
                  {/* Optimized Avatar */}
                  <div className="relative group-hover:scale-110 transition-transform duration-500">
                    <div className="w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center border-3 border-white/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-purple-500/50 rounded-full animate-pulse"></div>
                      <div className="w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center relative z-10">
                        <span className="text-2xl lg:text-3xl xl:text-4xl font-black text-white">M</span>
                      </div>
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 lg:w-10 lg:h-10 bg-green-500 rounded-full border-3 border-white shadow-xl flex items-center justify-center">
                      <div className="w-4 h-4 lg:w-5 lg:h-5 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Optimized User Info Card */}
                  <div className="text-center transform group-hover:scale-105 transition-transform duration-500">
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl p-4 lg:p-6 border border-white/70 dark:border-gray-600/70 min-w-[180px] lg:min-w-[200px] backdrop-blur-sm">
                      <div className="text-xl lg:text-2xl xl:text-3xl font-black text-gray-800 dark:text-white mb-2">Mohamed</div>
                      <div className="text-sm lg:text-base text-gray-600 dark:text-gray-300 font-medium">Digital Account Holder</div>
                      <div className="mt-3 px-3 py-1 lg:px-4 lg:py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full">
                        <span className="text-xs lg:text-sm font-semibold text-green-700 dark:text-green-400">Active Account</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Optimized Status Indicators */}
                  <div className="flex space-x-4 lg:space-x-6">
                    <div className="bg-white/80 dark:bg-gray-700/80 rounded-xl p-3 lg:p-4 shadow-xl border border-white/60 dark:border-gray-600/60 transform hover:scale-110 transition-all duration-300 group/indicator">
                      <div className="w-4 h-4 lg:w-5 lg:h-5 bg-green-500 rounded-full animate-pulse group-hover/indicator:animate-bounce shadow-lg"></div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-700/80 rounded-xl p-3 lg:p-4 shadow-xl border border-white/60 dark:border-gray-600/60 transform hover:scale-110 transition-all duration-300 group/indicator">
                      <div className="w-4 h-4 lg:w-5 lg:h-5 bg-blue-500 rounded-full animate-pulse group-hover/indicator:animate-bounce shadow-lg"></div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-700/80 rounded-xl p-3 lg:p-4 shadow-xl border border-white/60 dark:border-gray-600/60 transform hover:scale-110 transition-all duration-300 group/indicator">
                      <div className="w-4 h-4 lg:w-5 lg:h-5 bg-purple-500 rounded-full animate-pulse group-hover/indicator:animate-bounce shadow-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}