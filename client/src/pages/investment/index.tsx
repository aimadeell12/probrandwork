import {
  TrendingUp, Clock, ArrowRight, Wallet, History, Info,
  Loader2, CheckCircle2, DollarSign, Zap, Star, Trophy,
  ArrowDownToLine, BarChart3, RefreshCw, ChevronRight
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Investment } from "@shared/schema";

const PLANS = [
  {
    id: "standard",
    name: "Standard",
    nameAr: "الخطة الأساسية",
    rate: 10,
    minAmount: 100,
    icon: <Star className="w-5 h-5" />,
    color: "from-blue-500 to-blue-700",
    badgeColor: "bg-blue-100 text-blue-700",
    description: "Best for beginners",
    descriptionAr: "مثالية للمبتدئين",
  },
  {
    id: "premium",
    name: "Premium",
    nameAr: "الخطة المميزة",
    rate: 15,
    minAmount: 500,
    icon: <Zap className="w-5 h-5" />,
    color: "from-purple-500 to-purple-700",
    badgeColor: "bg-purple-100 text-purple-700",
    description: "Higher returns",
    descriptionAr: "عوائد أعلى",
    popular: true,
  },
  {
    id: "vip",
    name: "VIP",
    nameAr: "خطة VIP",
    rate: 20,
    minAmount: 1000,
    icon: <Trophy className="w-5 h-5" />,
    color: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-100 text-amber-700",
    description: "Maximum profit",
    descriptionAr: "أقصى ربح",
  },
];

function formatTimeAgo(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (diffH >= 24) return `${Math.floor(diffH / 24)}d ago`;
  if (diffH > 0) return `${diffH}h ${diffM}m ago`;
  return `${diffM}m ago`;
}

function getNextProfitIn(lastProfitAt: string | Date | null | undefined): string {
  if (!lastProfitAt) return "24h";
  const last = new Date(lastProfitAt);
  const next = new Date(last.getTime() + 24 * 60 * 60 * 1000);
  const now = new Date();
  const diff = next.getTime() - now.getTime();
  if (diff <= 0) return "Due now";
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${h}h ${m}m`;
}

export default function InvestmentSystem() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isInvesting, setIsInvesting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);
  const [customAmount, setCustomAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"invest" | "history">("invest");

  const isArabic = language === 'ar';

  const { data: investments, isLoading: loadingInvestments } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
    enabled: !!user,
    refetchOnWindowFocus: true,
  });

  const { data: profits, isLoading: loadingProfits } = useQuery<any[]>({
    queryKey: ["/api/investment-profits"],
    enabled: !!user && activeTab === "history",
  });

  const activeInvestment = investments?.find(inv => inv.status === 'active');
  const completedInvestments = investments?.filter(inv => inv.status !== 'active') || [];
  const totalProfits = investments?.reduce((sum, inv) => sum + parseFloat(inv.totalProfit || "0"), 0) || 0;

  const handleInvest = async () => {
    if (!user) { setLocation("/login"); return; }
    if (activeInvestment) {
      toast({
        title: isArabic ? "لديك استثمار نشط" : "Active investment exists",
        description: isArabic ? "يجب سحب استثمارك الحالي أولاً." : "You must withdraw your current investment first.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(customAmount) || selectedPlan.minAmount;
    if (amount < selectedPlan.minAmount) {
      toast({
        title: isArabic ? "مبلغ غير كافٍ" : "Amount too low",
        description: isArabic
          ? `الحد الأدنى لهذه الخطة هو $${selectedPlan.minAmount}`
          : `Minimum for this plan is $${selectedPlan.minAmount}`,
        variant: "destructive",
      });
      return;
    }

    const balance = parseFloat(user.walletBalance || "0");
    if (balance < amount) {
      toast({
        title: isArabic ? "رصيد غير كافٍ" : "Insufficient Balance",
        description: isArabic
          ? `رصيدك الحالي $${balance.toFixed(2)}`
          : `Your current balance is $${balance.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    setIsInvesting(true);
    try {
      await apiRequest("POST", "/api/invest", {
        amount,
        planName: selectedPlan.name,
        dailyProfitRate: selectedPlan.rate,
      });
      toast({
        title: isArabic ? "تم بدء الاستثمار!" : "Investment Started!",
        description: isArabic
          ? `تم استثمار $${amount} بنجاح. ستحصل على ${selectedPlan.rate}% يومياً.`
          : `$${amount} invested successfully. You'll earn ${selectedPlan.rate}% daily.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      setCustomAmount("");
    } catch (error: any) {
      toast({
        title: isArabic ? "خطأ" : "Error",
        description: error.message || (isArabic ? "حدث خطأ" : "Something went wrong"),
        variant: "destructive",
      });
    } finally {
      setIsInvesting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!activeInvestment) return;
    setIsWithdrawing(true);
    try {
      await apiRequest("POST", `/api/investments/${activeInvestment.id}/withdraw`, {});
      toast({
        title: isArabic ? "تم السحب بنجاح!" : "Withdrawn Successfully!",
        description: isArabic
          ? `تم إعادة المبلغ والأرباح إلى محفظتك.`
          : `Your investment and profits have been returned to your wallet.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
    } catch (error: any) {
      toast({
        title: isArabic ? "خطأ" : "Error",
        description: error.message || (isArabic ? "حدث خطأ أثناء السحب" : "Withdrawal failed"),
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f23] pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white pt-10 pb-8 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-10 -mb-10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black">
                {isArabic ? "نظام الاستثمار" : "Investment System"}
              </h1>
              <p className="text-white/70 text-sm mt-1">
                {isArabic ? "استثمر واربح يومياً" : "Invest and earn daily"}
              </p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur">
              <p className="text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">
                {isArabic ? "رصيد المحفظة" : "Balance"}
              </p>
              <p className="text-lg font-black">${parseFloat(user?.walletBalance || "0").toFixed(2)}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur">
              <p className="text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">
                {isArabic ? "إجمالي الأرباح" : "Total Profits"}
              </p>
              <p className="text-lg font-black text-green-300">${totalProfits.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur">
              <p className="text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">
                {isArabic ? "الاستثمارات" : "Investments"}
              </p>
              <p className="text-lg font-black">{investments?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-4 mt-5">
        <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("invest")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "invest"
                ? "bg-red-600 text-white shadow"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {isArabic ? "الاستثمار" : "Invest"}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "history"
                ? "bg-red-600 text-white shadow"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {isArabic ? "السجل" : "History"}
          </button>
        </div>
      </div>

      <div className="px-4 mt-5 space-y-4 max-w-lg mx-auto">

        {/* ─────────── INVEST TAB ─────────── */}
        {activeTab === "invest" && (
          <>
            {/* Active Investment Card */}
            {activeInvestment ? (
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white rounded-[2rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-lg leading-tight">
                          {isArabic ? "استثمار نشط" : "Active Investment"}
                        </h3>
                        <p className="text-white/70 text-xs">
                          {activeInvestment.planName || "Standard"} Plan
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      {isArabic ? "يعمل" : "Live"}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-center py-5 border-y border-white/20 mb-5">
                    <p className="text-white/60 text-xs mb-1">{isArabic ? "المبلغ المستثمر" : "Invested Amount"}</p>
                    <p className="text-5xl font-black tracking-tight">
                      ${parseFloat(activeInvestment.amount).toLocaleString()}
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <div className="text-center">
                        <p className="text-white/60 text-[10px] uppercase font-bold">{isArabic ? "الربح اليومي" : "Daily Rate"}</p>
                        <p className="text-xl font-black text-green-200">
                          {activeInvestment.dailyProfitRate || 10}%
                        </p>
                      </div>
                      <div className="w-px h-10 bg-white/20" />
                      <div className="text-center">
                        <p className="text-white/60 text-[10px] uppercase font-bold">{isArabic ? "الربح التراكمي" : "Total Earned"}</p>
                        <p className="text-xl font-black text-yellow-200">
                          +${parseFloat(activeInvestment.totalProfit || "0").toFixed(2)}
                        </p>
                      </div>
                      <div className="w-px h-10 bg-white/20" />
                      <div className="text-center">
                        <p className="text-white/60 text-[10px] uppercase font-bold">{isArabic ? "الربح التالي" : "Next Profit"}</p>
                        <p className="text-xl font-black flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {getNextProfitIn(activeInvestment.lastProfitAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expected daily profit */}
                  <div className="bg-white/10 rounded-2xl p-4 mb-4 flex justify-between items-center">
                    <div>
                      <p className="text-white/60 text-xs mb-1">{isArabic ? "الربح اليومي المتوقع" : "Expected Daily Profit"}</p>
                      <p className="text-2xl font-black text-yellow-200">
                        +${(parseFloat(activeInvestment.amount) * parseFloat(activeInvestment.dailyProfitRate || "10") / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs mb-1">{isArabic ? "تاريخ البدء" : "Started"}</p>
                      <p className="text-sm font-bold">{new Date(activeInvestment.createdAt!).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Withdraw Button */}
                  <Button
                    onClick={handleWithdraw}
                    disabled={isWithdrawing}
                    className="w-full h-13 bg-white text-green-700 hover:bg-white/90 font-black rounded-2xl text-base shadow-lg"
                  >
                    {isWithdrawing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <ArrowDownToLine className="w-5 h-5 mr-2" />
                        {isArabic ? "سحب الاستثمار والأرباح" : "Withdraw Investment + Profits"}
                      </>
                    )}
                  </Button>
                  <p className="text-center text-white/50 text-xs mt-2">
                    {isArabic
                      ? `ستسترد $${(parseFloat(activeInvestment.amount) + parseFloat(activeInvestment.totalProfit || "0")).toFixed(2)} عند السحب`
                      : `You'll receive $${(parseFloat(activeInvestment.amount) + parseFloat(activeInvestment.totalProfit || "0")).toFixed(2)} on withdrawal`}
                  </p>
                </CardContent>
              </Card>
            ) : loadingInvestments ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              </div>
            ) : (
              <>
                {/* Plans Selection */}
                <div>
                  <h2 className="text-base font-black text-gray-800 dark:text-white mb-3">
                    {isArabic ? "اختر خطة الاستثمار" : "Choose Investment Plan"}
                  </h2>
                  <div className="space-y-3">
                    {PLANS.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => { setSelectedPlan(plan); setCustomAmount(""); }}
                        className={`w-full text-left transition-all duration-200 ${
                          selectedPlan.id === plan.id ? "scale-[1.02]" : ""
                        }`}
                      >
                        <Card className={`border-2 ${
                          selectedPlan.id === plan.id
                            ? "border-red-500 shadow-lg shadow-red-100 dark:shadow-red-900/20"
                            : "border-gray-100 dark:border-gray-700"
                        } rounded-2xl`}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center text-white shadow-md`}>
                                {plan.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-gray-900 dark:text-white">
                                    {isArabic ? plan.nameAr : plan.name}
                                  </span>
                                  {plan.popular && (
                                    <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase">
                                      {isArabic ? "الأكثر شيوعاً" : "Popular"}
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">
                                  {isArabic ? plan.descriptionAr : plan.description} · {isArabic ? "الحد الأدنى" : "Min"} ${plan.minAmount}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className={`text-2xl font-black bg-gradient-to-br ${plan.color} bg-clip-text text-transparent`}>
                                  {plan.rate}%
                                </div>
                                <p className="text-gray-400 text-[10px]">
                                  {isArabic ? "يومياً" : "daily"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-gray-800">
                  <CardContent className="p-5">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      {isArabic ? "مبلغ الاستثمار" : "Investment Amount"}
                    </p>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={e => setCustomAmount(e.target.value)}
                        placeholder={`${selectedPlan.minAmount}`}
                        min={selectedPlan.minAmount}
                        className="w-full pl-9 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-lg font-bold focus:border-red-500 outline-none bg-transparent dark:text-white"
                      />
                    </div>
                    <div className="flex gap-2 mt-3">
                      {[selectedPlan.minAmount, selectedPlan.minAmount * 2, selectedPlan.minAmount * 5].map(amt => (
                        <button
                          key={amt}
                          onClick={() => setCustomAmount(String(amt))}
                          className="flex-1 py-2 text-sm font-bold border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-red-400 hover:text-red-600 transition-all dark:text-gray-300"
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>

                    {/* Profit Preview */}
                    {(parseFloat(customAmount) || selectedPlan.minAmount) >= selectedPlan.minAmount && (
                      <div className="mt-4 bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-200 dark:border-green-800">
                        <p className="text-green-700 dark:text-green-400 text-xs font-bold mb-1">
                          {isArabic ? "معاينة الأرباح" : "Profit Preview"}
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-[10px] text-gray-500">{isArabic ? "يومي" : "Daily"}</p>
                            <p className="text-sm font-black text-green-600">
                              +${((parseFloat(customAmount) || selectedPlan.minAmount) * selectedPlan.rate / 100).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500">{isArabic ? "أسبوعي" : "Weekly"}</p>
                            <p className="text-sm font-black text-green-600">
                              +${((parseFloat(customAmount) || selectedPlan.minAmount) * selectedPlan.rate / 100 * 7).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500">{isArabic ? "شهري" : "Monthly"}</p>
                            <p className="text-sm font-black text-green-600">
                              +${((parseFloat(customAmount) || selectedPlan.minAmount) * selectedPlan.rate / 100 * 30).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleInvest}
                      disabled={isInvesting}
                      className="w-full h-14 mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-base font-black rounded-2xl shadow-lg shadow-red-500/30 transition-all active:scale-95"
                    >
                      {isInvesting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          {isArabic ? "ابدأ الاستثمار الآن" : "Start Investing Now"}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* How It Works */}
            <Card className="border-0 shadow-sm rounded-2xl bg-white dark:bg-gray-800">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-red-500" />
                  <h3 className="font-black text-gray-800 dark:text-white">
                    {isArabic ? "كيف يعمل النظام" : "How It Works"}
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      icon: <DollarSign className="w-4 h-4 text-blue-600" />,
                      bg: "bg-blue-100 dark:bg-blue-900/30",
                      text: isArabic ? "اختر خطة الاستثمار وحدد المبلغ" : "Choose a plan and set your investment amount",
                    },
                    {
                      icon: <TrendingUp className="w-4 h-4 text-green-600" />,
                      bg: "bg-green-100 dark:bg-green-900/30",
                      text: isArabic ? "تُضاف أرباحك يومياً تلقائياً إلى محفظتك" : "Daily profits are automatically added to your wallet",
                    },
                    {
                      icon: <ArrowDownToLine className="w-4 h-4 text-purple-600" />,
                      bg: "bg-purple-100 dark:bg-purple-900/30",
                      text: isArabic ? "اسحب استثمارك والأرباح في أي وقت تشاء" : "Withdraw your investment and profits anytime",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 ${item.bg} rounded-full flex items-center justify-center shrink-0`}>
                        {item.icon}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 pt-1">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* ─────────── HISTORY TAB ─────────── */}
        {activeTab === "history" && (
          <>
            {/* Summary Card */}
            <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white">
              <CardContent className="p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white/70 text-xs">{isArabic ? "إجمالي الأرباح المحققة" : "Total Profits Earned"}</p>
                    <p className="text-3xl font-black mt-1">${totalProfits.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs">{isArabic ? "عدد الاستثمارات" : "Total Investments"}</p>
                    <p className="text-3xl font-black mt-1">{investments?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investments List */}
            <div>
              <h3 className="text-sm font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                {isArabic ? "سجل الاستثمارات" : "Investment Records"}
              </h3>
              {loadingInvestments ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                </div>
              ) : investments && investments.length > 0 ? (
                <div className="space-y-3">
                  {investments.map((inv) => (
                    <Card key={inv.id} className="border-0 shadow-sm rounded-2xl bg-white dark:bg-gray-800">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              inv.status === 'active'
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-gray-100 dark:bg-gray-700"
                            }`}>
                              {inv.status === 'active' ? (
                                <TrendingUp className="w-5 h-5 text-green-600" />
                              ) : (
                                <CheckCircle2 className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-sm">
                                {inv.planName || "Standard"} Plan
                              </p>
                              <p className="text-gray-400 text-xs">
                                {new Date(inv.createdAt!).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-gray-900 dark:text-white">
                              ${parseFloat(inv.amount).toFixed(2)}
                            </p>
                            <div className="flex items-center gap-1 justify-end mt-0.5">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                inv.status === 'active'
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                              }`}>
                                {inv.status === 'active'
                                  ? (isArabic ? "نشط" : "Active")
                                  : (isArabic ? "مسحوب" : "Withdrawn")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between text-xs">
                          <span className="text-gray-500">
                            {isArabic ? "نسبة الربح" : "Rate"}: <span className="font-bold text-red-600">{inv.dailyProfitRate || 10}%</span>
                          </span>
                          <span className="text-gray-500">
                            {isArabic ? "إجمالي الأرباح" : "Total Profit"}: <span className="font-bold text-green-600">+${parseFloat(inv.totalProfit || "0").toFixed(2)}</span>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">
                    {isArabic ? "لا توجد استثمارات بعد" : "No investments yet"}
                  </p>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab("invest")}
                    className="mt-3 text-red-600 font-bold"
                  >
                    {isArabic ? "ابدأ الاستثمار" : "Start Investing"}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
