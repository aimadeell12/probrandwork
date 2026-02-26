import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Check, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { SiBinance } from "react-icons/si";

export default function UsdtDeposit() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const walletAddress = "0x18af172bf78ddfdad0549ae98e8a4854c074a9f8";
  const network = "BEP20 (BSC)";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast({
      title: language === 'ar' ? 'تم النسخ' : 'Copied',
      description: language === 'ar' ? 'تم نسخ العنوان إلى الحافظة' : 'Address copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto px-4 lg:px-6 py-6 pb-24 w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/deposit")}
            className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">
            {language === 'ar' ? 'إيداع USDT' : 'Deposit USDT'}
          </h1>
        </div>

        <div className="bg-[#3a1010]/40 border-2 border-[#4a1515] rounded-2xl p-6 mb-6">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
              <SiBinance className="h-10 w-10 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">USDT (BEP20)</h2>
            <p className="text-gray-400 text-sm max-w-xs">
              {language === 'ar' 
                ? 'يرجى إرسال USDT فقط عبر شبكة Binance Smart Chain (BEP20) إلى العنوان أدناه' 
                : 'Please send only USDT via Binance Smart Chain (BEP20) network to the address below'}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                {language === 'ar' ? 'عنوان المحفظة' : 'Wallet Address'}
              </label>
              <div className="flex items-center gap-2 p-4 bg-[#0f0f23] border border-[#4a1515] rounded-xl">
                <span className="flex-1 font-mono text-sm break-all text-gray-200">
                  {walletAddress}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="shrink-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#0f0f23]/50 border border-[#4a1515] rounded-xl">
                <p className="text-xs text-gray-400 mb-1">{language === 'ar' ? 'الشبكة' : 'Network'}</p>
                <p className="font-semibold text-white">{network}</p>
              </div>
              <div className="p-4 bg-[#0f0f23]/50 border border-[#4a1515] rounded-xl">
                <p className="text-xs text-gray-400 mb-1">{language === 'ar' ? 'العملة' : 'Currency'}</p>
                <p className="font-semibold text-white">USDT</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3">
              <div className="shrink-0 w-5 h-5 mt-0.5">
                <div className="w-full h-full rounded-full border border-yellow-500 flex items-center justify-center text-[10px] text-yellow-500 font-bold">!</div>
              </div>
              <p className="text-xs text-yellow-200/80 leading-relaxed">
                {language === 'ar' 
                  ? 'تأكد من اختيار شبكة BEP20 عند الإرسال. قد يؤدي اختيار شبكة خاطئة إلى فقدان دائم لأموالك.' 
                  : 'Ensure you select the BEP20 network when sending. Selecting the wrong network may result in permanent loss of funds.'}
              </p>
            </div>
          </div>
        </div>

        <Button
          className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
          onClick={() => window.open(`https://bscscan.com/address/${walletAddress}`, '_blank')}
        >
          <ExternalLink className="mr-2 h-5 w-5" />
          {language === 'ar' ? 'عرض على BscScan' : 'View on BscScan'}
        </Button>
      </div>
    </div>
  );
}
