import { Button } from "@/components/ui/button";
import { CreditCard, Phone, Smartphone, Shield, Info, Send, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";

export default function Welcome() {
  const { t } = useLanguage();
  const bgColor = '#0f0a19';

  return (
    <div 
      className="fixed inset-0 overflow-y-auto"
      style={{ backgroundColor: bgColor }}
    >
      <div className="min-h-full flex flex-col px-4" style={{ backgroundColor: bgColor }}>
        
        {/* Logo */}
        <div className="pt-12 text-center" style={{ backgroundColor: bgColor }}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-white font-bold text-xl tracking-wide">PRO BRAND<span className="text-purple-400"> WORKS</span></span>
          </div>
        </div>

        {/* Header Content */}
        <div className="text-center mb-6" style={{ backgroundColor: bgColor }}>
          <h1 className="text-gray-400 text-base mb-2 font-light tracking-wide">
            Wallet account
          </h1>
          <h2 className="text-white text-2xl font-bold mb-2 tracking-tight">
            fast <span className="text-purple-400">transfers</span>
          </h2>
          <p className="text-gray-500 text-sm">
            Send money instantly to anyone, anywhere
          </p>
        </div>

        {/* Center Visual Content - Money Transfer */}
        <div className="flex-1 flex items-center justify-center py-4" style={{ backgroundColor: bgColor }}>
          <div className="relative mx-auto w-full max-w-[300px]">
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-3xl blur-2xl"></div>
            
            {/* Money Transfer Container */}
            <div className="relative space-y-6">
              {/* Sender Box */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300 text-xs">From</p>
                    <p className="text-white font-semibold text-sm">Ahmed</p>
                  </div>
                </div>
                <p className="text-cyan-400 font-bold text-lg">$500.00</p>
              </div>

              {/* Transfer Arrow Animation */}
              <div className="flex justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Receiver Box */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">F</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300 text-xs">To</p>
                    <p className="text-white font-semibold text-sm">Fatima</p>
                  </div>
                </div>
                <p className="text-pink-400 font-bold text-lg">$500.00</p>
              </div>

              {/* Status indicators */}
              <div className="flex justify-center space-x-2 pt-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse delay-75 shadow-lg shadow-blue-500/50"></div>
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse delay-150 shadow-lg shadow-purple-500/50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="pb-8 px-2" style={{ backgroundColor: bgColor }}>
          <Link href="/login">
            <Button className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 text-base transition-all duration-300">
              LOG IN
            </Button>
          </Link>

          <div className="h-4"></div>

          <Link href="/register">
            <Button 
              variant="outline" 
              className="w-full h-14 border-2 border-purple-500 text-purple-400 hover:text-purple-300 font-semibold rounded-xl hover:bg-purple-500/10 transition-all duration-300"
              style={{ backgroundColor: 'transparent' }}
            >
              OPEN A DIGITAL ACCOUNT
            </Button>
          </Link>
          
          {/* Bottom indicator */}
          <div className="flex justify-center pt-5">
            <div className="w-14 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>
          </div>

          {/* Legal Links */}
          <div className="flex items-center justify-center gap-4 text-sm text-purple-400 pt-4">
            <Link href="/about" className="hover:text-purple-300 transition-colors flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              About
            </Link>
            <span className="text-purple-600">•</span>
            <Link href="/privacy-policy" className="hover:text-purple-300 transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
