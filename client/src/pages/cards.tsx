import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cardApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { CreditCard, Plus, MoreVertical, Settings, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateCardModal from "@/components/create-card-modal";
import type { Card } from "shared/schema";

export default function Cards() {
  const { t } = useLanguage();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<"virtual" | "physical">("virtual");
  const [showChooseCard, setShowChooseCard] = useState(false);
  const { toast } = useToast();

  const { data: cards = [], isLoading } = useQuery<Card[]>({
    queryKey: ["/api/cards"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const { data: balance = { balance: 0 } } = useQuery({
    queryKey: ["/api/wallet/balance"],
  });

  const suspendCardMutation = useMutation({
    mutationFn: (cardId: string) => cardApi.suspendCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "تم إيقاف البطاقة",
        description: "تم إيقاف البطاقة بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إيقاف البطاقة",
        variant: "destructive",
      });
    },
  });

  const activateCardMutation = useMutation({
    mutationFn: (cardId: string) => cardApi.activateCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "تم تفعيل البطاقة",
        description: "تم تفعيل البطاقة بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تفعيل البطاقة",
        variant: "destructive",
      });
    },
  });

  const createCardMutation = useMutation({
    mutationFn: (cardData: any) => cardApi.createCard(cardData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] });
      setShowChooseCard(false); // Hide choose card view after creation
      toast({
        title: "🎉 تم إنشاء البطاقة بنجاح",
        description: "بطاقتك الجديدة جاهزة للاستخدام الآن",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message === "Insufficient balance" 
        ? "رصيدك غير كافي لإنشاء هذه البطاقة"
        : "حدث خطأ أثناء إنشاء البطاقة";
      
      toast({
        title: "⚠️ لا يمكن إنشاء البطاقة",
        description: errorMessage,
        variant: "default",
        duration: 4000,
      });
    },
  });

  const getCardGradient = (design: string) => {
    switch (design) {
      case "green":
        return "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700";
      case "purple":
        return "bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700";
      case "black":
        return "bg-gradient-to-br from-gray-800 via-gray-900 to-black";
      default:
        return "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700";
    }
  };

  const formatCardNumber = (lastFour: string) => {
    return `•••• •••• •••• ${lastFour}`;
  };

  const handleCreateCard = () => {
    const cardCost = selectedCardType === "virtual" ? 8 : 90;
    
    // Check if user has sufficient balance
    if ((balance as any)?.balance < cardCost) {
      toast({
        title: "💳 رصيد غير كافي",
        description: `نحتاج إلى ${cardCost} دولار لإنشاء هذه البطاقة\nرصيدك الحالي: ${(balance as any)?.balance || 0} دولار`,
        variant: "default",
        duration: 4000,
      });
      return;
    }

    const userName = (user as any)?.firstName && (user as any)?.lastName 
      ? `${(user as any).firstName} ${(user as any).lastName}`
      : (user as any)?.email?.split('@')[0] || "Card Holder";

    const cardData = {
      holderName: userName,
      type: selectedCardType,
      design: selectedCardType === "virtual" ? "black" : "purple",
      currency: "USD",
      expiryMonth: 12,
      expiryYear: 2028,
      lastFour: Math.floor(1000 + Math.random() * 9000).toString(),
      cost: cardCost,
    };
    
    createCardMutation.mutate(cardData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">جاري تحميل البطاقات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 py-8 max-w-md relative z-10">
        
        {/* Check if there are cards and not showing choose card view */}
        {Array.isArray(cards) && cards.length > 0 && !showChooseCard ? (
          <>
            {/* Header for existing cards */}
            <div className="flex items-center justify-between mb-8 pt-12">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">بطاقاتي</h1>
              <Button
                onClick={() => setShowChooseCard(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full p-3"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {/* Card Type Filter */}
            <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-1 mb-8 max-w-xs mx-auto shadow-lg border border-white/30">
              <button
                onClick={() => setSelectedCardType("virtual")}
                className={cn(
                  "flex-1 py-2 px-4 rounded-full text-xs font-medium transition-all",
                  selectedCardType === "virtual"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                Virtual Card
              </button>
              <button
                onClick={() => setSelectedCardType("physical")}
                className={cn(
                  "flex-1 py-2 px-4 rounded-full text-xs font-medium transition-all",
                  selectedCardType === "physical"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                Physical Card
              </button>
            </div>

            {/* Cards List */}
            <div className="space-y-6">
              {cards.filter((card: Card) => card.type === selectedCardType).map((card: Card) => (
                <div key={card.id} className="relative">
                  {/* Card Visual */}
                  <div className="relative w-full aspect-[1.6/1] max-w-sm mx-auto">
                    <div className={cn(
                      "absolute inset-0 rounded-2xl shadow-2xl overflow-hidden",
                      getCardGradient(card.design)
                    )}>
                      
                      {/* Card design elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
                      
                      {/* Card type indicator */}
                      <div className="absolute top-6 left-6">
                        <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-sm"></div>
                      </div>
                      
                      {/* Card actions */}
                      <div className="absolute top-6 right-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              الإعدادات
                            </DropdownMenuItem>
                            {card.status === "active" ? (
                              <DropdownMenuItem
                                onClick={() => suspendCardMutation.mutate(card.id)}
                                className="text-red-600"
                              >
                                <Lock className="mr-2 h-4 w-4" />
                                إيقاف البطاقة
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => activateCardMutation.mutate(card.id)}
                                className="text-green-600"
                              >
                                <Lock className="mr-2 h-4 w-4" />
                                تفعيل البطاقة
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {/* Digital text */}
                      <div className="absolute top-1/4 right-8 text-white font-bold text-xs tracking-wider transform rotate-90 origin-center opacity-80">
                        DIGITAL
                      </div>
                      
                      {/* Card number */}
                      <div className="absolute top-16 left-6 right-20">
                        <div className="text-white font-mono text-base tracking-widest">
                          {formatCardNumber(card.lastFour || card.last_four || "1234")}
                        </div>
                      </div>
                      
                      {/* Card details */}
                      <div className="absolute bottom-14 left-6 right-6 flex justify-between z-10">
                        <div>
                          <div className="text-white/60 text-xs uppercase tracking-wide mb-1">VALID THRU</div>
                          <div className="text-white font-mono text-sm">
                            {String(card.expiryMonth).padStart(2, '0')}/{String(card.expiryYear).slice(-2)}
                          </div>
                        </div>
                        <div className="text-right max-w-[100px]">
                          <div className="text-white/60 text-xs uppercase tracking-wide mb-1">CARDHOLDER</div>
                          <div className="text-white font-medium text-xs uppercase truncate">
                            {card.holderName}
                          </div>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="absolute bottom-6 left-6">
                        <div className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          card.status === "active" 
                            ? "bg-green-500/20 text-green-100" 
                            : card.status === "suspended"
                            ? "bg-red-500/20 text-red-100"
                            : "bg-yellow-500/20 text-yellow-100"
                        )}>
                          {card.status === "active" ? "نشطة" : card.status === "suspended" ? "معلقة" : "في الانتظار"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card info */}
                  <div className="text-center mt-4">
                    <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                      قابلة للتخصيص
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                      {card.type === "virtual" ? "بطاقة افتراضية" : "بطاقة فيزيائية"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      قابلة للتخصيص
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Extra space for bottom navigation */}
            <div className="mb-24"></div>
          </>
        ) : showChooseCard || cards.length === 0 ? (
          <>
            {/* Header - Choose Card Design */}
            <div className="text-center mb-8 pt-12">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Choose Card</h1>
            </div>

            {/* Card Type Selector */}
            <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-1 mb-12 max-w-xs mx-auto shadow-lg border border-white/30">
              <button
                onClick={() => setSelectedCardType("virtual")}
                className={cn(
                  "flex-1 py-2 px-4 rounded-full text-xs font-medium transition-all",
                  selectedCardType === "virtual"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                Virtual Card
              </button>
              <button
                onClick={() => setSelectedCardType("physical")}
                className={cn(
                  "flex-1 py-2 px-4 rounded-full text-xs font-medium transition-all",
                  selectedCardType === "physical"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                Physical Card
              </button>
            </div>

            {/* Sample Card Display */}
            <div className="mb-8 px-4">
              <div className="relative w-full aspect-[1.6/1] max-w-sm mx-auto">
                {/* Card background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden">
                  
                  {/* Card design elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full blur-lg"></div>
                  
                  {/* Mastercard logo placeholder */}
                  <div className="absolute top-6 left-6">
                    <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-sm"></div>
                  </div>
                  

                </div>
              </div>
            </div>

            {/* Customizable Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                Customizable
              </div>
            </div>

            {/* Card Type Info */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedCardType === "virtual" ? "Virtual Card" : "Physical Card"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Customizable
              </p>
            </div>

            {/* Create Card Button */}
            <div className="px-4 mb-24 pb-8">
              <Button 
                onClick={handleCreateCard}
                disabled={createCardMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
              >
                {createCardMutation.isPending ? "جاري الإنشاء..." : selectedCardType === "virtual" ? "إنشاء بطاقة 8 USD" : "إنشاء بطاقة 90 USD"}
              </Button>
            </div>
          </>
        ) : null}

      </div>

      {/* Create Card Modal */}
      <CreateCardModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}