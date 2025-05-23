import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import CardVisual from "@/components/card-visual";
import CreateCardModal from "@/components/create-card-modal";
import { cardApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, Pause, Ban, Settings, Snowflake, Play } from "lucide-react";

export default function Cards() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cards, isLoading } = useQuery({
    queryKey: ["/api/cards"],
  });

  const suspendCardMutation = useMutation({
    mutationFn: (cardId: string) => cardApi.suspendCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "تم تجميد البطاقة",
        description: "تم تجميد البطاقة بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تجميد البطاقة",
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

  const cardStats = {
    active: cards?.filter((card: any) => card.status === "active").length || 0,
    pending: cards?.filter((card: any) => card.status === "pending").length || 0,
    suspended: cards?.filter((card: any) => card.status === "suspended").length || 0,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="status-active">نشطة</Badge>;
      case "pending":
        return <Badge className="status-pending">معلقة</Badge>;
      case "suspended":
        return <Badge className="status-suspended">مجمدة</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCardTypeLabel = (type: string) => {
    switch (type) {
      case "credit":
        return "بطاقة ائتمان";
      case "debit":
        return "بطاقة خصم";
      case "prepaid":
        return "بطاقة مسبقة الدفع";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="banking-shadow">
                <CardContent className="p-6">
                  <div className="loading-skeleton h-32 rounded-xl mb-4"></div>
                  <div className="space-y-2">
                    <div className="loading-skeleton h-4 w-3/4"></div>
                    <div className="loading-skeleton h-4 w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">إدارة البطاقات</h1>
            <p className="text-muted-foreground">عرض وإدارة جميع بطاقاتك المصرفية</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} size="lg">
            <CreditCard className="ml-2 h-5 w-5" />
            إنشاء بطاقة جديدة
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="banking-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">البطاقات النشطة</p>
                  <p className="text-2xl font-bold text-foreground">{cardStats.active}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-secondary h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="banking-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">البطاقات المعلقة</p>
                  <p className="text-2xl font-bold text-foreground">{cardStats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Pause className="text-yellow-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="banking-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">البطاقات المجمدة</p>
                  <p className="text-2xl font-bold text-foreground">{cardStats.suspended}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Ban className="text-accent h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards Grid */}
        {cards && cards.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card: any) => (
              <Card key={card.id} className="banking-shadow hover:banking-shadow-lg transition-all">
                <CardContent className="p-6">
                  {/* Card Visual */}
                  <div className={`card-gradient-${card.design} rounded-xl p-6 text-white mb-4`}>
                    <div className="flex justify-between items-center mb-4">
                      <CreditCard className="h-8 w-8" />
                      <div className="text-right">
                        <div className="text-sm opacity-75">**** ****</div>
                        <div className="font-mono text-lg">{card.lastFour}</div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm opacity-75 mb-1">اسم حامل البطاقة</div>
                      <div className="font-semibold">{card.holderName}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm opacity-75">الرصيد</div>
                        <div className="font-bold text-lg">${card.balance}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-75">تاريخ الانتهاء</div>
                        <div className="font-mono">{card.expiryMonth}/{card.expiryYear}</div>
                      </div>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">نوع البطاقة</span>
                      <span className="text-sm font-medium text-foreground">{getCardTypeLabel(card.type)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">الحالة</span>
                      {getStatusBadge(card.status)}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">آخر معاملة</span>
                      <span className="text-sm text-muted-foreground">منذ ساعتين</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex space-x-2 space-x-reverse mt-6">
                    <Button size="sm" className="flex-1">
                      التفاصيل
                    </Button>
                    
                    {card.status === "active" ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => suspendCardMutation.mutate(card.id)}
                        disabled={suspendCardMutation.isPending}
                      >
                        <Snowflake className="ml-1 h-4 w-4" />
                        تجميد
                      </Button>
                    ) : card.status === "suspended" ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => activateCardMutation.mutate(card.id)}
                        disabled={activateCardMutation.isPending}
                      >
                        <Play className="ml-1 h-4 w-4" />
                        تفعيل
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => activateCardMutation.mutate(card.id)}
                        disabled={activateCardMutation.isPending}
                      >
                        <Play className="ml-1 h-4 w-4" />
                        تفعيل
                      </Button>
                    )}
                    
                    <Button size="sm" variant="outline" className="px-3">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="banking-shadow">
            <CardContent className="p-12 text-center">
              <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد بطاقات</h3>
              <p className="text-muted-foreground mb-6">ابدأ بإنشاء أول بطاقة لك</p>
              <Button onClick={() => setShowCreateModal(true)}>
                إنشاء بطاقة جديدة
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateCardModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}
