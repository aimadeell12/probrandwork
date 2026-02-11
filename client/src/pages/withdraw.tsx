import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, DollarSign, Minus, Building } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/useLanguage";

export default function Withdraw() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("card");

  // Get current balance
  const { data: balance } = useQuery({
    queryKey: ["/api/wallet/balance"],
  });

  const withdrawMutation = useMutation({
    mutationFn: async (data: { amount: number; method: string }) => {
      return apiRequest(`/api/wallet/withdraw`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] });
      toast({
        title: t("withdrawSuccess"),
        description: `${t("withdrawSuccess")} $${amount}`,
      });
      setAmount("");
      setLocation("/dashboard");
    },
    onError: () => {
      toast({
        title: t("withdrawError"),
        description: t("withdrawError"),
        variant: "destructive",
      });
    },
  });

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast({
        title: t("error"),
        description: t("error"),
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount > (balance?.balance || 0)) {
      toast({
        title: t("insufficientFunds"),
        description: t("insufficientFunds"),
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount < 1) {
      toast({
        title: t("amountTooSmall"),
        description: t("amountTooSmall"),
        variant: "destructive",
      });
      return;
    }

    withdrawMutation.mutate({ amount: withdrawAmount, method: selectedMethod });
  };

  const quickAmounts = [10, 25, 50, 100, 250, Math.min(500, balance?.balance || 0)].filter(amount => amount <= (balance?.balance || 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-red-900 dark:to-blue-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-red-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-yellow-200/30 dark:border-red-700/30 p-4 lg:p-6 relative z-10">
        <div className="max-w-4xl mx-auto flex items-center space-x-4 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="p-2 hover:bg-yellow-50 dark:hover:bg-red-900/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("withdrawMoney")}
          </h1>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6 relative z-10 max-w-md lg:max-w-4xl mx-auto">
        
        {/* Balance Display */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-yellow-200/30 shadow-xl">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t("totalBalance")}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${balance?.balance?.toFixed(2) || "0.00"}
            </p>
          </CardContent>
        </Card>

        {/* Amount Input */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-yellow-200/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="p-1 bg-yellow-100 dark:bg-red-900/30 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              {t("withdrawAmount")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">{t("withdrawAmount")}</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={balance?.balance || 0}
                className="text-2xl font-bold text-center bg-white/80 dark:bg-gray-700/80 border-yellow-200/30 focus:border-red-500 rounded-2xl"
              />
            </div>

            {/* Quick Amount Buttons */}
            {quickAmounts.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="bg-white/80 dark:bg-gray-700/80 border-yellow-200/30 hover:bg-yellow-50 hover:border-red-400"
                  >
                    ${quickAmount}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdrawal Methods */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-yellow-200/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">{t("withdrawMethod")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div 
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedMethod === "card" 
                  ? "border-red-500 bg-yellow-50 dark:bg-red-900/20" 
                  : "border-yellow-200/30 bg-white/50 dark:bg-gray-700/50"
              }`}
              onClick={() => setSelectedMethod("card")}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{t("creditCard")}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t("workingDays13")}</p>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedMethod === "bank" 
                  ? "border-red-500 bg-yellow-50 dark:bg-red-900/20" 
                  : "border-yellow-200/30 bg-white/50 dark:bg-gray-700/50"
              }`}
              onClick={() => setSelectedMethod("bank")}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-green-900/30 rounded-xl">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{t("bankTransfer")}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t("workingDays35")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdraw Button */}
        <Button
          onClick={handleWithdraw}
          disabled={withdrawMutation.isPending || !amount || parseFloat(amount) > (balance?.balance || 0)}
          className="w-full bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
        >
          <Minus className="h-5 w-5 mr-2" />
          {withdrawMutation.isPending ? t("processingWithdraw") : `${t("withdrawButton")} $${amount || "0.00"}`}
        </Button>
      </div>
    </div>
  );
}