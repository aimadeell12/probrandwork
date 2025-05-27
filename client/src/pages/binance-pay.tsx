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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-purple-200/30 dark:border-purple-700/30 p-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link href="/deposit">
              <Button variant="ghost" size="sm" className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <div className="mr-3">
                  <img 
                    src={binanceIcon} 
                    alt="Binance" 
                    className="h-10 w-10 object-contain"
                  />
                </div>
                Binance Pay
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 space-y-6 relative z-10 max-w-md lg:max-w-4xl mx-auto">

        {!paymentOrder ? (
          /* Payment Form */
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                <img 
                  src={binanceIcon} 
                  alt="Binance" 
                  className="h-7 w-7 object-contain"
                />
                إنشاء طلب دفع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">المبلغ</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="أدخل المبلغ"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl font-bold text-center bg-white/80 dark:bg-gray-700/80 border-purple-200/30 focus:border-purple-500 rounded-2xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-gray-700 dark:text-gray-300">العملة</Label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-200/30 dark:border-purple-600 rounded-2xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 focus:border-purple-500"
                >
                  <option value="USDT">USDT</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="BNB">BNB</option>
                  <option value="BUSD">BUSD</option>
                </select>
              </div>

              <Button
                onClick={handleCreateOrder}
                disabled={createOrderMutation.isPending}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
              >
                {createOrderMutation.isPending ? "جاري الإنشاء..." : "إنشاء طلب الدفع"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Payment Details */
          <div className="space-y-6">
            {/* Payment Info Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between text-gray-900 dark:text-white">
                  <span className="flex items-center gap-2">
                    <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    تم إنشاء طلب الدفع
                  </span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                    نشط
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <Label className="text-sm text-gray-600 dark:text-gray-400">رقم الطلب</Label>
                    <p className="font-mono text-sm break-all text-gray-900 dark:text-white">{paymentOrder.orderId}</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <Label className="text-sm text-gray-600 dark:text-gray-400">ينتهي في</Label>
                    <p className="text-sm flex items-center text-gray-900 dark:text-white">
                      <Clock className="h-4 w-4 ml-1" />
                      {formatExpireTime(paymentOrder.expireTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    أكمل دفعتك قبل انتهاء الوقت المحدد لتجنب إلغاء الطلب.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                  <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <QrCode className="h-5 w-5 text-purple-600" />
                  </div>
                  امسح رمز QR
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-6 bg-white rounded-2xl shadow-xl border border-purple-100">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentOrder.qrCode)}`}
                      alt="Payment QR Code"
                      className="w-48 h-48 rounded-xl"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    امسح رمز QR هذا بتطبيق Binance الخاص بك لإكمال الدفع
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyQrCode}
                    className="flex items-center gap-2 rounded-2xl border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? "تم النسخ!" : "نسخ بيانات QR"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Links Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">خيارات الدفع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => window.open(paymentOrder.paymentUrl, '_blank')}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white flex items-center justify-center gap-2 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>فتح صفحة دفع Binance</span>
                </Button>

                <Button
                  onClick={() => window.open(paymentOrder.deeplink, '_blank')}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>فتح في تطبيق Binance</span>
                </Button>

                <Button
                  onClick={handleCheckStatus}
                  disabled={queryOrderMutation.isPending}
                  variant="secondary"
                  className="w-full py-4 rounded-2xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50"
                >
                  {queryOrderMutation.isPending ? "جاري التحقق..." : "تحقق من حالة الدفع"}
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-50/80 dark:bg-blue-900/20 border-blue-200/30 dark:border-blue-800/30 shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 text-lg">
                  كيفية الدفع بـ Binance Pay:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li>افتح تطبيق Binance الخاص بك</li>
                  <li>اذهب إلى قسم Pay</li>
                  <li>امسح رمز QR أعلاه أو اضغط على "فتح في تطبيق Binance"</li>
                  <li>أكد الدفعة في تطبيق Binance الخاص بك</li>
                  <li>انتظر التأكيد (عادة فوري)</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}