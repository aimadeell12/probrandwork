import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Building, Clock } from "lucide-react";
import { useLocation } from "wouter";
import binanceIcon from "@assets/pngwing.com.png";
import { useLanguage } from "@/hooks/useLanguage";

export default function Deposit() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto px-4 lg:px-6 py-6 pb-24 w-full">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">
            {language === 'ar' ? 'إيداع الأموال' : 'Deposit Money'}
          </h1>
        </div>

        {/* Payment Method Section */}
        <div className="mb-6 lg:bg-[#0f0f23] lg:rounded-xl lg:shadow-sm lg:p-6">
          <h2 className="text-lg lg:text-2xl font-bold text-white mb-4">
            {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
          </h2>
          
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {/* Credit Card Option */}
            <div 
              className="p-4 rounded-xl border-2 cursor-pointer transition-all border-red-500 bg-[#3a1010] shadow-lg shadow-red-500/20"
              onClick={() => setLocation("/deposit/card")}
              data-testid="button-deposit-card"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card'}</p>
                  <p className="text-sm text-gray-400">Visa, Mastercard</p>
                </div>
              </div>
            </div>

            {/* Bank Transfer Option */}
            <div 
              className="p-4 rounded-xl border-2 cursor-pointer transition-all border-[#4a1515] bg-[#3a1010]/80 hover:border-red-400/50"
              onClick={() => setLocation("/bank-transfer")}
              data-testid="button-deposit-bank"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Building className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{language === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}</p>
                  <p className="text-sm text-gray-400">ACH, Wire Transfer</p>
                </div>
              </div>
            </div>

            {/* Binance Pay Option - Coming Soon */}
            <div 
              className="p-4 rounded-xl border-2 transition-all border-[#4a1515] bg-[#3a1010]/50 opacity-70 cursor-not-allowed relative"
              data-testid="button-deposit-binance"
            >
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                <Clock className="h-3 w-3" />
                <span>{language === 'ar' ? 'قريباً' : 'Coming Soon'}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <img 
                    src={binanceIcon} 
                    alt="Binance" 
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium text-white">{language === 'ar' ? 'بينانس باي' : 'Binance Pay'}</p>
                  <p className="text-sm text-gray-400">{language === 'ar' ? 'مدفوعات العملات الرقمية' : 'Crypto payments'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}