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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 relative z-10">
        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">إجمالي البطاقات</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCards}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-purple-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">الرصيد الإجمالي</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalBalance.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-xl flex items-center justify-center">
                  <Wallet className="text-blue-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">المعاملات اليوم</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayTransactions}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-600/20 to-pink-700/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-pink-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">البطاقات النشطة</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeCards}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-green-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">البطاقات الأخيرة</CardTitle>
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
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl shadow-xl">
                  إنشاء بطاقة جديدة
                </Button>
                <Button variant="outline" className="w-full border-2 border-purple-300/60 text-purple-700 dark:text-purple-300 rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white/95 dark:hover:bg-gray-700/95">
                  عرض المعاملات
                </Button>
                <Button variant="outline" className="w-full border-2 border-purple-300/60 text-purple-700 dark:text-purple-300 rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white/95 dark:hover:bg-gray-700/95">
                  إضافة رصيد
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-2xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Bell className="h-5 w-5 text-purple-600" />
                  الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">معاملة جديدة</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">تم خصم $25.99 من البطاقة</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">بطاقة مُفعلة</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">تم تفعيل البطاقة بنجاح</p>
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
