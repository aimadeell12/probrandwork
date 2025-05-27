import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, DollarSign, Plus, Building, Coins } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/useLanguage";

export default function Deposit() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("card");

  const depositMutation = useMutation({
    mutationFn: async (data: { amount: number; method: string }) => {
      return apiRequest(`/api/wallet/deposit`, 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] });
      toast({
        title: t('depositSuccess'),
        description: `$${amount} deposited successfully`,
      });
      setAmount("");
      setLocation("/dashboard");
    },
    onError: () => {
      toast({
        title: t('depositError'),
        description: "An error occurred during deposit",
        variant: "destructive",
      });
    },
  });

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (depositAmount < 1) {
      toast({
        title: "Amount Too Small",
        description: "Minimum deposit is $1",
        variant: "destructive",
      });
      return;
    }

    depositMutation.mutate({ amount: depositAmount, method: selectedMethod });
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/dashboard")}
              className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('depositMoney')}
          </h1>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 space-y-6 relative z-10 max-w-md lg:max-w-4xl mx-auto">
        
        {/* Desktop Layout */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0">
          
          {/* Left Column - Amount Input */}
          <div className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              {t('depositAmount')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">{t('amountInDollars')}</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl font-bold text-center bg-white/80 dark:bg-gray-700/80 border-purple-200/30 focus:border-purple-500 rounded-2xl"
              />
            </div>
          </CardContent>
        </Card>
          </div>

          {/* Right Column - Payment Methods */}
          <div className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">{t('paymentMethod')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div 
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedMethod === "card" 
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" 
                  : "border-purple-200/30 bg-white/50 dark:bg-gray-700/50"
              }`}
              onClick={() => setSelectedMethod("card")}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{t('creditCard')}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Visa, Mastercard</p>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedMethod === "bank" 
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" 
                  : "border-purple-200/30 bg-white/50 dark:bg-gray-700/50"
              }`}
              onClick={() => setSelectedMethod("bank")}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <Building className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{t('bankTransfer')}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">ACH, Wire Transfer</p>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedMethod === "binance" 
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" 
                  : "border-purple-200/30 bg-white/50 dark:bg-gray-700/50"
              }`}
              onClick={() => setSelectedMethod("binance")}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <Coins className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Binance Pay</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Crypto payments</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

            {/* Deposit Button */}
            <Button
              onClick={handleDeposit}
              disabled={depositMutation.isPending || !amount}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              {depositMutation.isPending ? t('processingDeposit') : `${t('depositButton')} $${amount || "0.00"}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}