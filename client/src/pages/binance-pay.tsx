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
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl mr-3">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
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
                <div className="p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
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
          <div className="space-y-6 max-w-2xl mx-auto">
            {/* Payment Info Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center justify-between">
                  <span>Payment Order Created</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Order ID</Label>
                    <p className="font-mono text-sm break-all">{paymentOrder.orderId}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Expires At</Label>
                    <p className="text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatExpireTime(paymentOrder.expireTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    Complete your payment before the expiration time to avoid order cancellation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  Scan QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg shadow-lg">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentOrder.qrCode)}`}
                      alt="Payment QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Scan this QR code with your Binance app to complete the payment
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyQrCode}
                    className="flex items-center space-x-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? "Copied!" : "Copy QR Data"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Links Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Payment Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => window.open(paymentOrder.paymentUrl, '_blank')}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Binance Pay Checkout</span>
                </Button>

                <Button
                  onClick={() => window.open(paymentOrder.deeplink, '_blank')}
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open in Binance App</span>
                </Button>

                <Button
                  onClick={handleCheckStatus}
                  disabled={queryOrderMutation.isPending}
                  variant="secondary"
                  className="w-full"
                >
                  {queryOrderMutation.isPending ? "Checking..." : "Check Payment Status"}
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  How to pay with Binance Pay:
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>Open your Binance app</li>
                  <li>Go to Pay section</li>
                  <li>Scan the QR code above or click "Open in Binance App"</li>
                  <li>Confirm the payment in your Binance app</li>
                  <li>Wait for confirmation (usually instant)</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}