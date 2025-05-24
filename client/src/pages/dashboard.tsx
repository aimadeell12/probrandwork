import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import CardVisual from "@/components/card-visual";
import { CreditCard, Wallet, TrendingUp, CheckCircle, Bell, Home, Headphones } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: cards, isLoading: cardsLoading } = useQuery({
    queryKey: ["/api/cards"],
  });

  const stats = {
    totalCards: cards?.length || 0,
    activeCards: cards?.filter((card: any) => card.status === "active").length || 0,
    totalBalance: cards?.reduce((sum: number, card: any) => sum + parseFloat(card.balance || "0"), 0) || 0,
    todayTransactions: 12, // This would come from actual transaction data
  };

  if (cardsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="banking-shadow">
                <CardContent className="p-6">
                  <div className="loading-skeleton h-12 w-12 rounded-xl mb-4"></div>
                  <div className="loading-skeleton h-4 w-20 mb-2"></div>
                  <div className="loading-skeleton h-8 w-16"></div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="banking-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">إجمالي البطاقات</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalCards}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-primary h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="banking-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">الرصيد الإجمالي</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalBalance.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Wallet className="text-secondary h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="banking-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">المعاملات اليوم</p>
                  <p className="text-2xl font-bold text-foreground">{stats.todayTransactions}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-accent h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="banking-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">البطاقات النشطة</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeCards}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-green-500 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle>البطاقات الأخيرة</CardTitle>
              </CardHeader>
              <CardContent>
                {cards && cards.length > 0 ? (
                  <div className="space-y-4">
                    {cards.slice(0, 3).map((card: any) => (
                      <div key={card.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <CardVisual design={card.design} />
                          <div>
                            <p className="font-medium text-foreground">**** **** **** {card.lastFour}</p>
                            <p className="text-sm text-muted-foreground">{card.type}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-foreground">${card.balance}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            card.status === "active" ? "status-active" : 
                            card.status === "pending" ? "status-pending" : "status-suspended"
                          }`}>
                            {card.status === "active" ? "نشطة" : 
                             card.status === "pending" ? "معلقة" : "مجمدة"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لا توجد بطاقات متاحة</p>
                    <Button className="mt-4">إنشاء بطاقة جديدة</Button>
                  </div>
                )}
                
                {cards && cards.length > 0 && (
                  <Button variant="outline" className="w-full mt-4">
                    عرض جميع البطاقات
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  إنشاء بطاقة جديدة
                </Button>
                <Button variant="outline" className="w-full">
                  عرض المعاملات
                </Button>
                <Button variant="outline" className="w-full">
                  إضافة رصيد
                </Button>
              </CardContent>
            </Card>

            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">معاملة جديدة</p>
                    <p className="text-xs text-muted-foreground">تم خصم $25.99 من البطاقة</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">بطاقة مُفعلة</p>
                    <p className="text-xs text-muted-foreground">تم تفعيل البطاقة بنجاح</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="flex justify-around py-3">
          <Link href="/" className="flex flex-col items-center gap-1 cursor-pointer">
            <Home className="w-5 h-5 text-gray-500" />
            <span className="text-xs text-gray-500">الرئيسية</span>
          </Link>
          <Link href="/cards" className="flex flex-col items-center gap-1 cursor-pointer">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <span className="text-xs text-gray-500">البطاقات</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center gap-1 cursor-pointer">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <span className="text-xs text-red-500">لوحة التحكم</span>
          </Link>
          <Link href="/support" className="flex flex-col items-center gap-1 cursor-pointer">
            <Headphones className="w-5 h-5 text-gray-500" />
            <span className="text-xs text-gray-500">الدعم</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
