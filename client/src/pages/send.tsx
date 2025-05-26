import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, DollarSign, User, Mail, Phone } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/useLanguage";

export default function SendMoney() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientType, setRecipientType] = useState("email");
  const [note, setNote] = useState("");

  // Get current balance
  const { data: balance } = useQuery({
    queryKey: ["/api/wallet/balance"],
  });

  const sendMutation = useMutation({
    mutationFn: async (data: { amount: number; recipient: string; type: string; note?: string }) => {
      return apiRequest(`/api/wallet/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "تم الإرسال بنجاح",
        description: `تم إرسال $${amount} بنجاح`,
      });
      setAmount("");
      setRecipient("");
      setNote("");
      setLocation("/dashboard");
    },
    onError: () => {
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء عملية الإرسال",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    const sendAmount = parseFloat(amount);
    if (!sendAmount || sendAmount <= 0) {
      toast({
        title: "مبلغ غير صحيح",
        description: "يرجى إدخال مبلغ صحيح",
        variant: "destructive",
      });
      return;
    }

    if (sendAmount > ((balance as any)?.balance || 0)) {
      toast({
        title: "رصيد غير كافي",
        description: "الرصيد المتاح غير كافي لهذه العملية",
        variant: "destructive",
      });
      return;
    }

    if (!recipient.trim()) {
      toast({
        title: "يرجى إدخال المستلم",
        description: "يجب إدخال بريد إلكتروني أو رقم هاتف صحيح",
        variant: "destructive",
      });
      return;
    }

    sendMutation.mutate({ 
      amount: sendAmount, 
      recipient: recipient.trim(), 
      type: recipientType,
      note: note.trim() 
    });
  };

  const quickAmounts = [5, 10, 25, 50, 100, 250];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-purple-200/30 dark:border-purple-700/30 p-4 relative z-10">
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
            {t('sendMoney')}
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6 relative z-10 max-w-md mx-auto">
        
        {/* Balance Display */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('availableBalance')}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${((balance as any)?.balance || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        {/* Recipient Input */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              {t('sendTo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recipient Type Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-2xl p-1">
              <button
                onClick={() => setRecipientType("email")}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  recipientType === "email"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <Mail className="h-4 w-4" />
                {t('emailAddress')}
              </button>
              <button
                onClick={() => setRecipientType("phone")}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  recipientType === "phone"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <Phone className="h-4 w-4" />
                {t('phoneNumber')}
              </button>
            </div>

            <div>
              <Label htmlFor="recipient" className="text-gray-700 dark:text-gray-300">
                {recipientType === "email" ? t('emailAddress') : t('phoneNumber')}
              </Label>
              <Input
                id="recipient"
                type={recipientType === "email" ? "email" : "tel"}
                placeholder={recipientType === "email" ? "example@email.com" : "+1234567890"}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="bg-white/80 dark:bg-gray-700/80 border-purple-200/30 focus:border-purple-500 rounded-2xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Amount Input */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              {t('amount')}
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

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="bg-white/80 dark:bg-gray-700/80 border-purple-200/30 hover:bg-purple-50 hover:border-purple-400"
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Note (Optional) */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
          <CardContent className="p-4">
            <Label htmlFor="note" className="text-gray-700 dark:text-gray-300">{t('optionalNote')}</Label>
            <Input
              id="note"
              placeholder={t('addNote')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2 bg-white/80 dark:bg-gray-700/80 border-purple-200/30 focus:border-purple-500 rounded-2xl"
            />
          </CardContent>
        </Card>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={sendMutation.isPending || !amount || !recipient}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
        >
          <Send className="h-5 w-5 mr-2" />
          {sendMutation.isPending ? "جاري الإرسال..." : `إرسال $${amount || "0.00"}`}
        </Button>
      </div>
    </div>
  );
}