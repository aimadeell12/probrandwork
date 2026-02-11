import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  QrCode, 
  ExternalLink, 
  Copy, 
  Check,
  Clock,
  AlertCircle,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import binanceIcon from "@assets/pngwing.com.png";
import { useLanguage } from "@/hooks/useLanguage";

interface BinancePayOrder {
  success: boolean;
  orderId: string;
  paymentUrl: string;
  qrCode: string;
  deeplink: string;
  universalUrl: string;
  expireTime: number;
}

export default function BinancePay() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USDT");
  const [paymentOrder, setPaymentOrder] = useState<BinancePayOrder | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Create payment order mutation
  const createOrderMutation = useMutation({
    mutationFn: (data: { amount: number; currency: string }) =>
      apiRequest("POST", "/api/binance/create-order", data),
    onSuccess: (data) => {
      setPaymentOrder(data);
      toast({
        title: "Payment Order Created",
        description: "Your Binance Pay order has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create payment order",
        variant: "destructive",
      });
    },
  });

  // Query order status mutation
  const queryOrderMutation = useMutation({
    mutationFn: (merchantTradeNo: string) =>
      apiRequest("POST", "/api/binance/query-order", { merchantTradeNo }),
    onSuccess: (data) => {
      if (data.status === 'PAY_SUCCESS') {
        toast({
          title: "Payment Successful!",
          description: "Your deposit has been completed successfully.",
        });
        // Redirect to success page or dashboard
        window.location.href = "/dashboard";
      } else {
        toast({
          title: "Payment Status",
          description: `Current status: ${data.status}`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to check payment status",
        variant: "destructive",
      });
    },
  });

  const handleCreateOrder = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    createOrderMutation.mutate({ amount: amountNum, currency });
  };

  const handleCopyQrCode = () => {
    if (paymentOrder?.qrCode) {
      navigator.clipboard.writeText(paymentOrder.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "QR code data copied to clipboard",
      });
    }
  };

  const handleCheckStatus = () => {
    if (paymentOrder?.orderId) {
      queryOrderMutation.mutate(paymentOrder.orderId);
    }
  };

  const formatExpireTime = (expireTime: number) => {
    const date = new Date(expireTime);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-white relative">
      
      {/* Mobile-first safe area handling */}
      <div className="mobile-safe-area">
        
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-3 sm:p-4 z-50">
          <div className="flex items-center gap-3">
            <Link href="/deposit">
              <Button variant="ghost" size="sm" className="p-2 hover:bg-red-500/10 rounded-full">
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <img 
                  src={binanceIcon} 
                  alt="Binance" 
                  className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                />
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Binance Pay
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-3 sm:px-4 pb-20 space-y-4 sm:space-y-6 max-w-md mx-auto">

          {!paymentOrder ? (
            /* Payment Form */
            <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
              {/* Form Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <img 
                    src={binanceIcon} 
                    alt="Binance" 
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">إنشاء طلب دفع</h2>
              </div>

              <div className="space-y-6">
                {/* Amount Input */}
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700">المبلغ</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="أدخل المبلغ"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-14 text-xl font-semibold text-center border-gray-200 focus:border-red-500/80 focus:ring-red-500/20 rounded-xl"
                  />
                </div>

                {/* Currency Selection */}
                <div className="space-y-3">
                  <Label htmlFor="currency" className="text-sm font-medium text-gray-700">العملة</Label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-900 focus:border-red-500/80 focus:ring-2 focus:ring-red-500/20 outline-none"
                  >
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="BNB">BNB</option>
                    <option value="BUSD">BUSD</option>
                  </select>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleCreateOrder}
                  disabled={createOrderMutation.isPending}
                  className="w-full h-12 bg-red-500/80 hover:bg-primary/80 text-white font-medium rounded-xl transition-colors"
                >
                  {createOrderMutation.isPending ? "جاري الإنشاء..." : "إنشاء طلب الدفع"}
                </Button>
              </div>
            </div>
          ) : (
            /* Payment Details */
            <div className="space-y-4">
              {/* Payment Info Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">تم إنشاء طلب الدفع</h2>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    نشط
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-red-50/80 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">رقم الطلب</p>
                    <p className="font-mono text-sm break-all text-gray-900">{paymentOrder.orderId}</p>
                  </div>
                  <div className="p-3 bg-red-50/80 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">ينتهي في</p>
                    <p className="text-sm flex items-center text-gray-900">
                      <Clock className="h-4 w-4 ml-1" />
                      {formatExpireTime(paymentOrder.expireTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200 mt-4">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    أكمل دفعتك قبل انتهاء الوقت المحدد لتجنب إلغاء الطلب.
                  </p>
                </div>
              </div>

              {/* QR Code Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100/80 rounded-xl flex items-center justify-center">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">امسح رمز QR</h2>
                </div>

                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(paymentOrder.qrCode)}`}
                        alt="Payment QR Code"
                        className="w-44 h-44 rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      امسح رمز QR هذا بتطبيق Binance الخاص بك لإكمال الدفع
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyQrCode}
                      className="flex items-center gap-2 rounded-xl border-gray-200 hover:bg-red-50/80"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span>{copied ? "تم النسخ!" : "نسخ بيانات QR"}</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Payment Links Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">خيارات الدفع</h2>
                <div className="space-y-3">
                  <Button
                    onClick={() => window.open(paymentOrder.paymentUrl, '_blank')}
                    className="w-full h-12 bg-red-500/80 hover:bg-primary/80 text-white flex items-center justify-center gap-2 rounded-xl transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>فتح صفحة دفع Binance</span>
                  </Button>

                  <Button
                    onClick={() => window.open(paymentOrder.deeplink, '_blank')}
                    variant="outline"
                    className="w-full h-12 flex items-center justify-center gap-2 rounded-xl border-gray-200 hover:bg-red-50/80"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>فتح في تطبيق Binance</span>
                  </Button>

                  <Button
                    onClick={handleCheckStatus}
                    disabled={queryOrderMutation.isPending}
                    variant="secondary"
                    className="w-full h-12 rounded-xl bg-red-100/80 hover:bg-red-200/80"
                  >
                    {queryOrderMutation.isPending ? "جاري التحقق..." : "تحقق من حالة الدفع"}
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-red-50/80 border border-red-200/50 rounded-2xl p-4 sm:p-6">
                <h3 className="font-semibold text-red-900 mb-3 text-lg">
                  كيفية الدفع بـ Binance Pay:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-red-800">
                  <li>افتح تطبيق Binance الخاص بك</li>
                  <li>اذهب إلى قسم Pay</li>
                  <li>امسح رمز QR أعلاه أو اضغط على "فتح في تطبيق Binance"</li>
                  <li>أكد الدفعة في تطبيق Binance الخاص بك</li>
                  <li>انتظر التأكيد (عادة فوري)</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}