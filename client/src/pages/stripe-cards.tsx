import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Plus, 
  Pause, 
  Play, 
  Eye, 
  EyeOff, 
  Smartphone,
  Car,
  Settings
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface StripeCard {
  id: string;
  userId: string;
  stripeCardId: string;
  stripeCardholderId: string;
  holderName: string;
  lastFour: string;
  type: "virtual" | "physical";
  status: "active" | "inactive" | "canceled";
  brand: string;
  currency: string;
  design: string;
  expiryMonth: number;
  expiryYear: number;
  createdAt: string;
}

export default function StripeCards() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});

  // Fetch cards
  const { data: cards = [], isLoading } = useQuery<StripeCard[]>({
    queryKey: ['/api/cards'],
  });

  // Create card mutation
  const createCardMutation = useMutation({
    mutationFn: async (cardData: { type: string; currency: string; design: string }) => {
      const response = await apiRequest("POST", "/api/cards", cardData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      toast({
        title: "تم إنشاء البطاقة بنجاح",
        description: "تم إنشاء بطاقتك الجديدة باستخدام Stripe Issuing",
      });
    },
    onError: (error: any) => {
      toast({
        title: "فشل في إنشاء البطاقة",
        description: error.message || "حدث خطأ أثناء إنشاء البطاقة",
        variant: "destructive",
      });
    },
  });

  // Freeze/Unfreeze card mutation
  const toggleCardStatusMutation = useMutation({
    mutationFn: async ({ cardId, action }: { cardId: string; action: 'freeze' | 'unfreeze' }) => {
      const endpoint = action === 'freeze' ? `/api/cards/${cardId}/freeze` : `/api/cards/${cardId}/unfreeze`;
      const response = await apiRequest("PATCH", endpoint);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      toast({
        title: "تم تحديث حالة البطاقة",
        description: "تم تحديث حالة البطاقة بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "فشل في تحديث البطاقة",
        description: error.message || "حدث خطأ أثناء تحديث البطاقة",
        variant: "destructive",
      });
    },
  });

  const handleCreateCard = (type: "virtual" | "physical") => {
    createCardMutation.mutate({
      type,
      currency: "USD",
      design: "blue"
    });
  };

  const handleToggleCardStatus = (cardId: string, currentStatus: string) => {
    const action = currentStatus === "active" ? "freeze" : "unfreeze";
    toggleCardStatusMutation.mutate({ cardId, action });
  };

  const toggleCardDetails = (cardId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "inactive": return "bg-yellow-500";
      case "canceled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "نشطة";
      case "inactive": return "متوقفة";
      case "canceled": return "ملغية";
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            بطاقات Stripe Issuing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            إدارة بطاقاتك المصرفية الافتراضية والفيزيائية بواسطة تقنية Stripe المتقدمة
          </p>
        </div>

        {/* Create Card Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => handleCreateCard("virtual")}
            disabled={createCardMutation.isPending}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 rounded-xl flex items-center gap-3 shadow-lg"
          >
            <Smartphone className="w-5 h-5" />
            إنشاء بطاقة افتراضية
          </Button>
          <Button
            onClick={() => handleCreateCard("physical")}
            disabled={createCardMutation.isPending}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl flex items-center gap-3 shadow-lg"
          >
            <CreditCard className="w-5 h-5" />
            إنشاء بطاقة فيزيائية
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card key={card.id} className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              {/* Card Visual */}
              <div className={`relative h-48 bg-gradient-to-br ${
                card.design === "blue" ? "from-blue-500 to-blue-700" :
                card.design === "purple" ? "from-purple-500 to-purple-700" :
                card.design === "green" ? "from-green-500 to-green-700" :
                "from-gray-500 to-gray-700"
              } text-white p-6 rounded-t-xl`}>
                
                {/* Status Badge */}
                <Badge className={`absolute top-4 right-4 ${getStatusColor(card.status)} text-white`}>
                  {getStatusText(card.status)}
                </Badge>

                {/* Card Type Icon */}
                <div className="absolute top-4 left-4">
                  {card.type === "virtual" ? (
                    <Smartphone className="w-6 h-6" />
                  ) : (
                    <CreditCard className="w-6 h-6" />
                  )}
                </div>

                {/* Chip */}
                <div className="absolute top-16 left-6 w-12 h-8 bg-yellow-400 rounded-md"></div>

                {/* Card Number */}
                <div className="absolute bottom-16 left-6 font-mono text-lg tracking-wider">
                  •••• •••• •••• {card.lastFour}
                </div>

                {/* Card Details */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div>
                    <div className="text-xs opacity-70">صالحة حتى</div>
                    <div className="font-mono text-sm">
                      {showDetails[card.id] 
                        ? `${card.expiryMonth.toString().padStart(2, '0')}/${card.expiryYear.toString().slice(-2)}`
                        : "••/••"
                      }
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-70">حامل البطاقة</div>
                    <div className="text-sm font-medium truncate max-w-32">
                      {card.holderName.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Brand Logo */}
                <div className="absolute bottom-6 right-6 text-right">
                  <div className="text-lg font-bold">{card.brand.toUpperCase()}</div>
                </div>
              </div>

              {/* Card Controls */}
              <div className="p-4 space-y-3">
                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleCardDetails(card.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    {showDetails[card.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showDetails[card.id] ? "إخفاء" : "عرض"}
                  </Button>
                  
                  <Button
                    onClick={() => handleToggleCardStatus(card.id, card.status)}
                    disabled={toggleCardStatusMutation.isPending || card.status === "canceled"}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    {card.status === "active" ? (
                      <>
                        <Pause className="w-4 h-4" />
                        تجميد
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        تفعيل
                      </>
                    )}
                  </Button>
                </div>

                {/* Card Info */}
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>النوع:</span>
                    <span>{card.type === "virtual" ? "افتراضية" : "فيزيائية"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>العملة:</span>
                    <span>{card.currency}</span>
                  </div>
                  {showDetails[card.id] && (
                    <>
                      <div className="flex justify-between">
                        <span>Stripe Card ID:</span>
                        <span className="font-mono text-xs">{card.stripeCardId?.slice(-8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>تاريخ الإنشاء:</span>
                        <span>{new Date(card.createdAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {cards.length === 0 && (
          <div className="text-center py-16">
            <CreditCard className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              لا توجد بطاقات حتى الآن
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              ابدأ بإنشاء بطاقتك الأولى باستخدام Stripe Issuing
            </p>
            <Button
              onClick={() => handleCreateCard("virtual")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              إنشاء بطاقة جديدة
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}