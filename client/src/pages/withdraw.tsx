import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, CreditCard, DollarSign, Minus, Building,
  Wallet, Copy, CheckCircle2, AlertCircle, ChevronDown, ChevronUp
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/useLanguage";
import { SiBitcoin, SiEthereum, SiTether, SiBinance } from "react-icons/si";

const CRYPTO_METHODS = [
  {
    id: "usdt_bep20",
    name: "USDT (BEP20)",
    network: "Binance Smart Chain",
    icon: <SiTether className="w-5 h-5 text-green-500" />,
    bg: "bg-green-100 dark:bg-green-900/30",
    color: "text-green-600",
    minAmount: 10,
    fee: "1 USDT",
    time: "5-30 min",
  },
  {
    id: "usdt_trc20",
    name: "USDT (TRC20)",
    network: "Tron Network",
    icon: <SiTether className="w-5 h-5 text-red-500" />,
    bg: "bg-red-100 dark:bg-red-900/30",
    color: "text-red-600",
    minAmount: 10,
    fee: "1 USDT",
    time: "5-30 min",
  },
  {
    id: "bitcoin",
    name: "Bitcoin (BTC)",
    network: "Bitcoin Network",
    icon: <SiBitcoin className="w-5 h-5 text-orange-500" />,
    bg: "bg-orange-100 dark:bg-orange-900/30",
    color: "text-orange-500",
    minAmount: 20,
    fee: "0.0001 BTC",
    time: "10-60 min",
  },
  {
    id: "ethereum",
    name: "Ethereum (ETH)",
    network: "Ethereum Network",
    icon: <SiEthereum className="w-5 h-5 text-purple-500" />,
    bg: "bg-purple-100 dark:bg-purple-900/30",
    color: "text-purple-500",
    minAmount: 20,
    fee: "0.002 ETH",
    time: "5-30 min",
  },
  {
    id: "bnb",
    name: "BNB",
    network: "Binance Smart Chain",
    icon: <SiBinance className="w-5 h-5 text-yellow-500" />,
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    color: "text-yellow-600",
    minAmount: 10,
    fee: "0.001 BNB",
    time: "5-30 min",
  },
];

const FIAT_METHODS = [
  {
    id: "card",
    name: "Credit / Debit Card",
    nameAr: "بطاقة بنكية",
    icon: <CreditCard className="h-5 w-5 text-blue-600" />,
    bg: "bg-blue-100 dark:bg-blue-900/30",
    time: "1-3 أيام عمل",
    timeEn: "1-3 business days",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    nameAr: "تحويل بنكي",
    icon: <Building className="h-5 w-5 text-green-600" />,
    bg: "bg-green-100 dark:bg-green-900/30",
    time: "3-5 أيام عمل",
    timeEn: "3-5 business days",
  },
];

export default function Withdraw() {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState("");
  const [methodType, setMethodType] = useState<"crypto" | "fiat">("crypto");
  const [selectedMethod, setSelectedMethod] = useState("usdt_bep20");
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [bankDetails, setBankDetails] = useState({ accountName: "", accountNumber: "", bankName: "", iban: "" });
  const [showInfo, setShowInfo] = useState(false);

  const { data: balance } = useQuery<{ balance: number }>({ queryKey: ["/api/wallet/balance"] });
  const currentBalance = balance?.balance || 0;

  const selectedCrypto = CRYPTO_METHODS.find(m => m.id === selectedMethod);
  const selectedFiat = FIAT_METHODS.find(m => m.id === selectedMethod);

  const withdrawMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/wallet/withdraw", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] });
      toast({
        title: isArabic ? "تم تقديم طلب السحب!" : "Withdrawal Request Submitted!",
        description: isArabic
          ? "سيتم معالجة طلبك خلال الوقت المحدد."
          : "Your request will be processed within the specified time.",
      });
      setAmount("");
      setCryptoAddress("");
    },
    onError: (error: any) => {
      toast({
        title: isArabic ? "خطأ" : "Error",
        description: error.message || (isArabic ? "فشل في معالجة الطلب" : "Failed to process withdrawal"),
        variant: "destructive",
      });
    },
  });

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast({ title: isArabic ? "أدخل مبلغاً صحيحاً" : "Enter a valid amount", variant: "destructive" });
      return;
    }
    if (withdrawAmount > currentBalance) {
      toast({ title: isArabic ? "رصيد غير كافٍ" : "Insufficient balance", variant: "destructive" });
      return;
    }
    if (methodType === "crypto" && !cryptoAddress.trim()) {
      toast({ title: isArabic ? "أدخل عنوان المحفظة" : "Enter wallet address", variant: "destructive" });
      return;
    }
    if (methodType === "fiat" && selectedMethod === "bank" && !bankDetails.accountNumber) {
      toast({ title: isArabic ? "أدخل تفاصيل الحساب البنكي" : "Enter bank account details", variant: "destructive" });
      return;
    }

    withdrawMutation.mutate({
      amount: withdrawAmount,
      method: selectedMethod,
      methodType,
      cryptoAddress: methodType === "crypto" ? cryptoAddress : undefined,
      bankDetails: methodType === "fiat" && selectedMethod === "bank" ? bankDetails : undefined,
    });
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500].filter(a => a <= currentBalance);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f23] pb-28">

      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white pt-10 pb-8 px-5 rounded-b-[2.5rem] shadow-xl">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setLocation("/dashboard")} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black">{isArabic ? "سحب الأموال" : "Withdraw Funds"}</h1>
        </div>
        {/* Balance */}
        <div className="bg-white/15 rounded-2xl p-4 text-center backdrop-blur">
          <p className="text-white/70 text-xs uppercase font-bold tracking-wider mb-1">
            {isArabic ? "الرصيد المتاح" : "Available Balance"}
          </p>
          <p className="text-4xl font-black">${currentBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="px-4 mt-5 space-y-4 max-w-lg mx-auto">

        {/* Method Type Toggle */}
        <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-1 shadow-sm">
          <button
            onClick={() => { setMethodType("crypto"); setSelectedMethod("usdt_bep20"); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              methodType === "crypto"
                ? "bg-red-600 text-white shadow"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Wallet className="w-4 h-4" />
            {isArabic ? "عملات رقمية" : "Crypto"}
          </button>
          <button
            onClick={() => { setMethodType("fiat"); setSelectedMethod("card"); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              methodType === "fiat"
                ? "bg-red-600 text-white shadow"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            {isArabic ? "بنكي/بطاقة" : "Bank/Card"}
          </button>
        </div>

        {/* Crypto Methods */}
        {methodType === "crypto" && (
          <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {isArabic ? "اختر العملة الرقمية" : "Select Cryptocurrency"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {CRYPTO_METHODS.map((crypto) => (
                <button
                  key={crypto.id}
                  onClick={() => setSelectedMethod(crypto.id)}
                  className={`w-full p-3.5 rounded-2xl border-2 transition-all text-left ${
                    selectedMethod === crypto.id
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-100 dark:border-gray-700 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${crypto.bg} rounded-xl flex items-center justify-center`}>
                        {crypto.icon}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{crypto.name}</p>
                        <p className="text-gray-400 text-xs">{crypto.network}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{isArabic ? "وقت المعالجة" : "Processing"}</p>
                      <p className="text-xs font-bold text-gray-600 dark:text-gray-300">{crypto.time}</p>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Fiat Methods */}
        {methodType === "fiat" && (
          <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {isArabic ? "طريقة السحب" : "Withdrawal Method"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {FIAT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-3.5 rounded-2xl border-2 transition-all text-left ${
                    selectedMethod === method.id
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-100 dark:border-gray-700 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${method.bg} rounded-xl flex items-center justify-center`}>
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        {isArabic ? method.nameAr : method.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {isArabic ? method.time : method.timeEn}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Amount */}
        <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-gray-800">
          <CardContent className="p-5">
            <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
              {isArabic ? "مبلغ السحب" : "Withdrawal Amount"}
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={currentBalance}
                className="pl-9 text-xl font-black text-center border-2 border-gray-200 dark:border-gray-600 focus:border-red-500 rounded-xl h-14 bg-transparent"
              />
            </div>

            {quickAmounts.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {quickAmounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(String(a))}
                    className="py-2 text-sm font-bold border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-red-400 hover:text-red-600 transition-all dark:text-gray-300"
                  >
                    ${a}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setAmount(String(currentBalance))}
              className="w-full mt-2 py-2 text-xs font-bold text-red-600 hover:underline"
            >
              {isArabic ? "سحب الكل" : "Withdraw All"} (${currentBalance.toFixed(2)})
            </button>

            {/* Fee Info */}
            {methodType === "crypto" && selectedCrypto && parseFloat(amount) > 0 && (
              <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{isArabic ? "المبلغ" : "Amount"}</span>
                  <span className="font-bold">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{isArabic ? "رسوم الشبكة" : "Network Fee"}</span>
                  <span className="font-bold text-amber-600">−{selectedCrypto.fee}</span>
                </div>
                <div className="flex justify-between text-xs border-t border-amber-200 dark:border-amber-700 pt-1 mt-1">
                  <span className="font-bold text-gray-700 dark:text-gray-300">{isArabic ? "تستلم تقريباً" : "You Receive"}</span>
                  <span className="font-black text-green-600">${parseFloat(amount).toFixed(2)} - {selectedCrypto.fee}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Crypto Address Input */}
        {methodType === "crypto" && (
          <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-gray-800">
            <CardContent className="p-5">
              <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                {isArabic ? `عنوان محفظة ${selectedCrypto?.name}` : `${selectedCrypto?.name} Wallet Address`}
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder={isArabic ? "الصق عنوان المحفظة هنا..." : "Paste wallet address here..."}
                  value={cryptoAddress}
                  onChange={(e) => setCryptoAddress(e.target.value)}
                  className="border-2 border-gray-200 dark:border-gray-600 focus:border-red-500 rounded-xl pr-10 bg-transparent font-mono text-sm"
                />
                {cryptoAddress && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
              <div className="flex items-start gap-2 mt-3 bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 dark:text-red-400">
                  {isArabic
                    ? `تأكد أن العنوان صحيح وعلى شبكة ${selectedCrypto?.network}. الأموال المرسلة لعناوين خاطئة لا يمكن استردادها.`
                    : `Make sure the address is correct and on the ${selectedCrypto?.network}. Funds sent to wrong addresses cannot be recovered.`}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bank Details (if bank transfer selected) */}
        {methodType === "fiat" && selectedMethod === "bank" && (
          <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-gray-800">
            <CardContent className="p-5 space-y-3">
              <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">
                {isArabic ? "بيانات الحساب البنكي" : "Bank Account Details"}
              </Label>
              {[
                { key: "accountName", label: isArabic ? "اسم صاحب الحساب" : "Account Holder Name" },
                { key: "accountNumber", label: isArabic ? "رقم الحساب / IBAN" : "Account Number / IBAN" },
                { key: "bankName", label: isArabic ? "اسم البنك" : "Bank Name" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <Label className="text-xs text-gray-500 mb-1 block">{label}</Label>
                  <Input
                    placeholder={label}
                    value={(bankDetails as any)[key]}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, [key]: e.target.value }))}
                    className="border-2 border-gray-200 dark:border-gray-600 focus:border-red-500 rounded-xl bg-transparent"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Processing Info */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
        >
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {isArabic ? "معلومات المعالجة" : "Processing Information"}
          </span>
          {showInfo ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showInfo && (
          <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-gray-800 -mt-2">
            <CardContent className="p-4 space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                <p>{isArabic ? "يتم مراجعة طلبات السحب خلال ساعات العمل." : "Withdrawal requests are reviewed during business hours."}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                <p>{isArabic ? "العملات الرقمية تُعالج بشكل أسرع من التحويلات البنكية." : "Crypto withdrawals are processed faster than bank transfers."}</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                <p>{isArabic ? "يجب التحقق من الهوية (KYC) قبل السحب." : "KYC verification is required before withdrawals."}</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p>{isArabic ? "الحد الأدنى للسحب هو $10." : "Minimum withdrawal amount is $10."}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Withdraw Button */}
        <Button
          onClick={handleWithdraw}
          disabled={
            withdrawMutation.isPending ||
            !amount ||
            parseFloat(amount) <= 0 ||
            parseFloat(amount) > currentBalance ||
            (methodType === "crypto" && !cryptoAddress.trim())
          }
          className="w-full h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-base rounded-2xl shadow-lg shadow-red-500/30 transition-all active:scale-95"
        >
          {withdrawMutation.isPending ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              {isArabic ? "جاري المعالجة..." : "Processing..."}
            </span>
          ) : (
            <>
              <Minus className="h-5 w-5 mr-2" />
              {isArabic ? `سحب $${amount || "0.00"}` : `Withdraw $${amount || "0.00"}`}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
