import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { X, Gift, QrCode, CreditCard, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  
  // Fetch user cards
  const { data } = useQuery({
    queryKey: ['/api/cards'],
    enabled: !!user,
  });
  
  // Safely access data with fallback
  const cards = Array.isArray(data) ? data : [];
  const primaryCard = cards[0]; // Use first card as primary

  // Fetch balance for primary card
  const { data: balanceData } = useQuery({
    queryKey: ['/api/wallet/balance', primaryCard?.id],
    enabled: !!primaryCard,
  });

  // Deposit mutation
  const depositMutation = useMutation({
    mutationFn: async (depositAmount: number) => {
      return apiRequest("/api/wallet/deposit", "POST", {
        cardId: primaryCard?.id,
        amount: depositAmount
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Deposit completed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
      setIsDepositOpen(false);
      setAmount("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process deposit",
        variant: "destructive",
      });
    }
  });

  // Withdrawal mutation
  const withdrawMutation = useMutation({
    mutationFn: async (withdrawAmount: number) => {
      return apiRequest("/api/wallet/withdraw", "POST", {
        cardId: primaryCard?.id,
        amount: withdrawAmount
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Withdrawal completed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
      setIsWithdrawOpen(false);
      setAmount("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process withdrawal",
        variant: "destructive",
      });
    }
  });

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (depositAmount > 0) {
      depositMutation.mutate(depositAmount);
    }
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > 0) {
      withdrawMutation.mutate(withdrawAmount);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-20">
      <div className="max-w-lg mx-auto px-5 pt-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold dark:text-white">{t("wallet")}</h1>
          <div className="flex gap-4">
            <LanguageToggle />
            <ThemeToggle className="text-black dark:text-white" />
            <button className="text-black dark:text-white">
              <Gift size={22} />
            </button>
            <button className="text-black dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="mb-6">
          <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 py-1.5 px-3 rounded-full dark:text-white">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">$</span>
            </div>
            <span className="font-medium">{t("usd")}</span>
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Balance Section */}
        <div className="mb-8">
          <p className="text-gray-500 dark:text-gray-400 mb-1 flex items-center">
            {t("totalBalance")}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
          </p>
          <h2 className="text-5xl font-bold dark:text-white">$ {(balanceData as any)?.balance?.toFixed(2) || "5.00"}</h2>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
            <DialogTrigger asChild>
              <div className="flex flex-col items-center cursor-pointer">
                <div className="w-14 h-14 bg-black dark:bg-blue-600 rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white"><path d="M12 5v14M5 12h14"/></svg>
                </div>
                <span className="text-sm dark:text-white">{t("deposit")}</span>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("deposit")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button 
                  onClick={handleDeposit} 
                  disabled={depositMutation.isPending}
                  className="w-full"
                >
                  {depositMutation.isPending ? "Processing..." : "Deposit"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
            <DialogTrigger asChild>
              <div className="flex flex-col items-center cursor-pointer">
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="dark:text-white"><path d="M5 12h14"/></svg>
                </div>
                <span className="text-sm dark:text-white">{t("withdraw")}</span>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("withdraw")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button 
                  onClick={handleWithdraw} 
                  disabled={withdrawMutation.isPending}
                  className="w-full"
                >
                  {withdrawMutation.isPending ? "Processing..." : "Withdraw"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex flex-col items-center cursor-pointer" onClick={() => toast({ title: "Coming Soon", description: "Send feature will be available soon" })}>
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="dark:text-white"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            <span className="text-sm dark:text-white">{t("send")}</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer" onClick={() => toast({ title: "Coming Soon", description: "QR scan feature will be available soon" })}>
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-2">
              <QrCode size={24} className="dark:text-white" />
            </div>
            <span className="text-sm dark:text-white">{t("scan")}</span>
          </div>
        </div>

        {/* Beginner Guidance */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-8 relative">
          <button className="absolute top-3 right-3 dark:text-white">
            <X size={18} />
          </button>
          <h3 className="font-bold mb-2 dark:text-white">{t("guidanceForBeginnersTitle")}</h3>
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:text-white"><rect width="18" height="11" x="3" y="5" rx="2"/><path d="M3 7h18"/><path d="M7 11h2"/><path d="M7 15h8"/></svg>
            </div>
            <div>
              <p className="font-medium dark:text-white">يرجى التحقق من هويتك</p>
              <a href="#" className="text-red-500 dark:text-red-400 text-sm">انتقل للتحقق</a>
            </div>
          </div>
        </div>

        {/* Promotion Banner */}
        <div className="bg-red-600 text-white p-4 rounded-xl mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-1">عرض 11.11</h3>
            <div className="inline-block bg-black text-white text-xs px-3 py-1 rounded-full mb-3">
              خصم حتى 60%
            </div>
          </div>
          <div className="absolute bottom-0 right-0">
            <div className="relative w-32 h-20">
              <div className="absolute bottom-0 right-0 w-24 h-16 bg-purple-600 rounded-tl-xl"></div>
              <div className="absolute bottom-4 right-6 w-24 h-16 bg-black rounded-tl-xl"></div>
            </div>
          </div>
        </div>

        {/* Assets */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 dark:text-white">الأصول</h3>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">$</span>
              </div>
              <div>
                <p className="font-medium dark:text-white">USD</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">USD</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold dark:text-white">5.00</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">≈5.00 USD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
