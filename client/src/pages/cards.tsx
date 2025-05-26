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
  const { toast } = useToast();

  const { data: cards = [], isLoading } = useQuery<Card[]>({
    queryKey: ["/api/cards"],
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
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-12">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">بطاقاتي</h1>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full p-3"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Cards List */}
        {Array.isArray(cards) && cards.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">لا توجد بطاقات</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">ابدأ بإنشاء أول بطاقة لك</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            >
              إنشاء بطاقة جديدة
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.isArray(cards) && cards.map((card: Card) => (
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
                    <div className="absolute top-1/4 right-6 text-white font-bold text-lg tracking-wider transform rotate-90 origin-center">
                      DIGITAL
                    </div>
                    
                    {/* Card number */}
                    <div className="absolute top-1/2 left-6 transform -translate-y-1/2">
                      <div className="text-white font-mono text-lg tracking-widest">
                        {formatCardNumber(card.lastFour)}
                      </div>
                    </div>
                    
                    {/* Card details */}
                    <div className="absolute bottom-16 left-6 right-6 flex justify-between z-10">
                      <div>
                        <div className="text-gray-300 text-xs uppercase tracking-wide mb-1">Valid Thru</div>
                        <div className="text-white font-semibold text-sm">
                          {String(card.expiryMonth).padStart(2, '0')}/{String(card.expiryYear).slice(-2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold text-sm">{card.holderName.toUpperCase()}</div>
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
        )}

      </div>

      {/* Create Card Modal */}
      <CreateCardModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}