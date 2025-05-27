import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building2, Check, Copy, CreditCard, DollarSign } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function BankTransfer() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [reference, setReference] = useState("");
  const [copied, setCopied] = useState("");

  const availableBanks = [
    {
      id: "alrajhi",
      name: "مصرف الراجحي",
      name_en: "Al Rajhi Bank", 
      logo: "🏛️",
      iban: "SA03 8000 0000 6080 1016 7519",
      accountNumber: "608010167519",
      swiftCode: "RJHISARI",
      currency: "SAR"
    },
    {
      id: "samba", 
      name: "بنك سامبا المالي",
      name_en: "Samba Financial Group",
      logo: "🏦",
      iban: "SA44 4500 0000 0000 0012 3456",
      accountNumber: "000000123456", 
      swiftCode: "SAMBSARI",
      currency: "SAR"
    },
    {
      id: "ahli",
      name: "البنك الأهلي التجاري", 
      name_en: "National Commercial Bank",
      logo: "🏪",
      iban: "SA15 1000 0000 1234 5678 9012",
      accountNumber: "12345678901",
      swiftCode: "NCBKSAJE",
      currency: "SAR"
    },
    {
      id: "riyad",
      name: "بنك الرياض",
      name_en: "Riyad Bank", 
      logo: "🏢",
      iban: "SA39 2000 0000 0000 1234 5678",
      accountNumber: "000012345678",
      swiftCode: "RIBLSARI", 
      currency: "SAR"
    },
    {
      id: "fransi",
      name: "البنك السعودي الفرنسي",
      name_en: "Banque Saudi Fransi",
      logo: "🏛️",
      iban: "SA85 5500 0000 0000 5432 1098", 
      accountNumber: "000054321098",
      swiftCode: "BSFRSARI",
      currency: "SAR"
    },
    {
      id: "alinma",
      name: "بنك الإنماء",
      name_en: "Alinma Bank",
      logo: "🏦", 
      iban: "SA12 0500 0000 0000 6789 0123",
      accountNumber: "000067890123",
      swiftCode: "INMASARI",
      currency: "SAR"
    }
  ];

  const selectedBankDetails = availableBanks.find((bank) => bank.id === selectedBank);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedBank) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "تم إنشاء التحويل",
      description: "تم إنشاء طلب التحويل البنكي بنجاح. استخدم التفاصيل أدناه لإكمال التحويل.",
    });
    setAmount("");
    setSelectedBank("");
    setReference("");
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
    toast({
      title: "تم النسخ",
      description: "تم نسخ المعلومات إلى الحافظة",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-purple-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-blue-200/30 dark:border-blue-700/30 p-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              onClick={() => setLocation("/deposit")}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Building2 className="mr-3 h-8 w-8 text-blue-600" />
                التحويل البنكي
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                اختر البنك وأدخل المبلغ لإنشاء طلب تحويل
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 space-y-6 relative z-10 max-w-4xl mx-auto">
        
        {/* Transfer Form */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
              <DollarSign className="h-6 w-6 text-green-600" />
              إنشاء طلب تحويل بنكي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">
                  المبلغ (ريال سعودي)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="أدخل المبلغ"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl font-bold text-center bg-white/80 dark:bg-gray-700/80 border-blue-200/30 focus:border-blue-500 rounded-2xl"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              {/* Bank Selection */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  اختر البنك
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableBanks.map((bank) => (
                    <div
                      key={bank.id}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedBank === bank.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-blue-200/30 bg-white/50 dark:bg-gray-700/50 hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedBank(bank.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{bank.logo}</div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {bank.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {bank.name_en}
                          </p>
                        </div>
                        {selectedBank === bank.id && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reference (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="reference" className="text-gray-700 dark:text-gray-300">
                  مرجع التحويل (اختياري)
                </Label>
                <Textarea
                  id="reference"
                  placeholder="أدخل مرجع أو ملاحظة للتحويل"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="bg-white/80 dark:bg-gray-700/80 border-blue-200/30 focus:border-blue-500 rounded-2xl"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!amount || !selectedBank}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-2xl text-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                إنشاء طلب التحويل
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Bank Details Card - Show when bank is selected */}
        {selectedBank && selectedBankDetails && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                <CreditCard className="h-6 w-6 text-blue-600" />
                تفاصيل البنك المحدد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                  <div className="text-3xl">{selectedBankDetails.logo}</div>
                  <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                      {selectedBankDetails.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedBankDetails.name_en}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-sm text-gray-600 dark:text-gray-400">رقم الحساب:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{selectedBankDetails.accountNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(selectedBankDetails.accountNumber, 'account')}
                        >
                          {copied === 'account' ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-sm text-gray-600 dark:text-gray-400">IBAN:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{selectedBankDetails.iban}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(selectedBankDetails.iban, 'iban')}
                        >
                          {copied === 'iban' ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Swift Code:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{selectedBankDetails.swiftCode}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(selectedBankDetails.swiftCode, 'swift')}
                        >
                          {copied === 'swift' ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-sm text-gray-600 dark:text-gray-400">العملة:</span>
                      <span className="font-medium">{selectedBankDetails.currency}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/30">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900 dark:text-blue-100">
              تعليمات التحويل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-blue-800 dark:text-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
              <p>اختر البنك المناسب من القائمة أعلاه</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
              <p>أدخل المبلغ المراد تحويله</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
              <p>انقر على "إنشاء طلب التحويل" وستظهر لك تفاصيل البنك للتحويل</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">4</div>
              <p>قم بالتحويل البنكي باستخدام التفاصيل المعروضة</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">5</div>
              <p>سيتم تحديث رصيدك تلقائياً بعد تأكيد التحويل</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}