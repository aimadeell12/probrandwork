import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, DollarSign, User, Mail, Phone, ArrowRightLeft } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/useLanguage";

export default function SendMoney() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const searchString = useSearch();
  
  const urlParams = new URLSearchParams(searchString);
  const initialAmount = urlParams.get('amount') || "";
  const fromCurrency = urlParams.get('from') || "USD";
  const toCurrency = urlParams.get('to') || "EUR";
  const exchangeRate = urlParams.get('rate') || "1";
  
  const [amount, setAmount] = useState(initialAmount);
  const [recipient, setRecipient] = useState("");
  const [recipientType, setRecipientType] = useState("email");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
    }
  }, [initialAmount]);

  const { data: balance } = useQuery({
    queryKey: ["/api/wallet/balance"],
  });

  const sendMutation = useMutation({
    mutationFn: async (data: { amount: number; recipient: string; type: string; note?: string }) => {
      return apiRequest("POST", "/api/wallet/send", data);
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Transfer Successful!",
        description: `$${amount} sent to ${recipient}. New balance: $${response?.newBalance?.toFixed(2) || '0.00'}`,
      });
      setAmount("");
      setRecipient("");
      setNote("");
      setLocation("/transactions");
    },
    onError: (error: any) => {
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to process transfer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    const sendAmount = parseFloat(amount);
    if (!sendAmount || sendAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    const walletBalance = (balance as any)?.balance || 0;
    if (sendAmount > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: `Your balance is $${Number(walletBalance).toFixed(2)}. Please add funds first.`,
        variant: "destructive",
      });
      return;
    }

    if (!recipient.trim()) {
      toast({
        title: "Recipient Required",
        description: "Please enter a valid email or phone number.",
        variant: "destructive",
      });
      return;
    }

    sendMutation.mutate({ 
      amount: sendAmount, 
      recipient: recipient.trim(), 
      type: recipientType,
      note: note.trim() || `Transfer from ${fromCurrency} to ${toCurrency}`
    });
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];
  const walletBalance = (balance as any)?.balance || 0;
  const currentAmount = parseFloat(amount) || 0;
  const convertedAmount = currentAmount > 0 && exchangeRate ? (currentAmount * parseFloat(exchangeRate)).toFixed(2) : null;

  const bgColor = '#0f0a19';
  const cardBg = '#1a1230';
  const borderColor = '#2a2040';

  return (
    <div className="min-h-screen relative overflow-hidden pb-24 lg:pb-6" style={{ backgroundColor: bgColor }}>
      
      <div className="p-4 lg:p-6 relative z-10" style={{ backgroundColor: bgColor, borderBottom: `1px solid ${borderColor}` }}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="p-2 text-purple-400 hover:bg-purple-500/20"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">
            {t('sendMoney')}
          </h1>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4 relative z-10 max-w-md lg:max-w-4xl mx-auto">
        
        <Card className="border shadow-xl" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-400 mb-1">{t('availableBalance')}</p>
            <p className="text-2xl font-bold text-white" data-testid="text-balance">
              ${Number(walletBalance).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        {fromCurrency !== toCurrency && (
          <Card className="border shadow-xl" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-3">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Sending</p>
                  <p className="text-xl font-bold text-white">${currentAmount.toFixed(2)} {fromCurrency}</p>
                </div>
                <ArrowRightLeft className="h-5 w-5 text-purple-400" />
                <div className="text-center">
                  <p className="text-sm text-gray-400">Receiver Gets</p>
                  <p className="text-xl font-bold text-green-400">{convertedAmount || "0.00"} {toCurrency}</p>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">
                Exchange Rate: 1 {fromCurrency} = {exchangeRate} {toCurrency}
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="border shadow-xl" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <div className="p-1 bg-blue-900/30 rounded-lg">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              {t('sendTo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex rounded-2xl p-1" style={{ backgroundColor: '#1f1730' }}>
              <button
                onClick={() => setRecipientType("email")}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  recipientType === "email"
                    ? "bg-purple-500 text-white shadow-sm"
                    : "text-gray-400"
                }`}
                data-testid="button-email-type"
              >
                <Mail className="h-4 w-4" />
                {t('emailAddress')}
              </button>
              <button
                onClick={() => setRecipientType("phone")}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  recipientType === "phone"
                    ? "bg-purple-500 text-white shadow-sm"
                    : "text-gray-400"
                }`}
                data-testid="button-phone-type"
              >
                <Phone className="h-4 w-4" />
                {t('phoneNumber')}
              </button>
            </div>

            <div>
              <Label htmlFor="recipient" className="text-gray-300">
                {recipientType === "email" ? t('emailAddress') : t('phoneNumber')}
              </Label>
              <Input
                id="recipient"
                type={recipientType === "email" ? "email" : "tel"}
                placeholder={recipientType === "email" ? "example@email.com" : "+1234567890"}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="bg-[#1f1730] border-[#2a2040] text-white placeholder:text-gray-500 focus:border-purple-500 rounded-2xl"
                data-testid="input-recipient"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-xl" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <div className="p-1 bg-green-900/30 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              {t('amount')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-gray-300">{t('amountInDollars')}</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl font-bold text-center bg-[#1f1730] border-[#2a2040] text-white placeholder:text-gray-500 focus:border-purple-500 rounded-2xl"
                data-testid="input-amount"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="bg-[#1f1730] border-[#2a2040] text-gray-300 hover:bg-purple-500/20 hover:border-purple-500/50"
                  data-testid={`button-quick-${quickAmount}`}
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-xl" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
          <CardContent className="p-4">
            <Label htmlFor="note" className="text-gray-300">{t('optionalNote')}</Label>
            <Input
              id="note"
              placeholder={t('addNote')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2 bg-[#1f1730] border-[#2a2040] text-white placeholder:text-gray-500 focus:border-purple-500 rounded-2xl"
              data-testid="input-note"
            />
          </CardContent>
        </Card>

        <Button
          onClick={handleSend}
          disabled={sendMutation.isPending || !amount || !recipient}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium py-4 rounded-2xl text-lg shadow-lg shadow-purple-500/30 transition-all duration-300"
          data-testid="button-send"
        >
          <Send className="h-5 w-5 mr-2" />
          {sendMutation.isPending ? "Sending..." : `Send $${amount || "0.00"}`}
        </Button>
      </div>
    </div>
  );
}
