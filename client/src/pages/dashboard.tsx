import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowRight, QrCode, X, ChevronDown, Info, Gift, Bell, Globe, Crown, Grid3X3, AlertTriangle, CreditCard, Wallet, Settings, Activity, TrendingUp, Eye, EyeOff, Copy, Star, Users, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { useNativeInteractions } from "@/hooks/useNativeInteractions";
import NotificationCenter from "@/components/notification-center";
import PullToRefresh from "@/components/pull-to-refresh";

export default function Dashboard() {
  const { t } = useLanguage();
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const queryClient = useQueryClient();
  const { triggerHaptic } = useNativeInteractions();
  
  // Fetch user info
  const { data: userInfo } = useQuery({
    queryKey: ["/api/auth/user"],
  });
  
  const { data: walletData } = useQuery({
    queryKey: ["/api/wallet/balance"],
  });

  // Fetch unread notifications count
  const { data: unreadData } = useQuery({
    queryKey: ["/api/notifications/unread-count"],
  });

  // Fetch KYC status
  const { data: kycStatus } = useQuery({
    queryKey: ["/api/kyc/status"],
  });

  const balance = (walletData as any)?.balance || 0;
  const unreadCount = (unreadData as any)?.count || 0;

  const handleRefresh = async () => {
    triggerHaptic();
    await queryClient.invalidateQueries();
  };

  // Mock data for enhanced desktop features
  const recentTransactions = [
    { id: 1, type: 'deposit', amount: 100, description: 'Bank Transfer', time: '2 hours ago' },
    { id: 2, type: 'withdraw', amount: -50, description: 'ATM Withdrawal', time: '1 day ago' },
    { id: 3, type: 'transfer', amount: -25, description: 'Online Payment', time: '2 days ago' },
  ];

  const quickStats = [
    { label: 'This Month', value: '$2,450', trend: '+12%', positive: true },
    { label: 'Total Spent', value: '$1,250', trend: '-8%', positive: false },
    { label: 'Savings Goal', value: '75%', trend: '+5%', positive: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 relative overflow-hidden">
      {/* Enhanced Background Elements for Desktop */}
      <div className="hidden lg:block absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      <div className="hidden lg:block absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/15 to-purple-200/15 rounded-full blur-3xl"></div>
      <div className="hidden xl:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-100/10 to-pink-100/10 rounded-full blur-[100px]"></div>

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 relative z-10">
          
          {/* Enhanced Header with Welcome Message */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
            <div className="hidden lg:block">
              <h1 className="text-2xl xl:text-3xl font-bold text-gray-900 dark:text-white">
                مرحباً بك في PAYdota
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                إدارة أموالك بسهولة وأمان
              </p>
            </div>
            
            <div className="flex items-center space-x-3 w-full lg:w-auto justify-end">
              {kycStatus && (kycStatus as any).status === 'verified' ? (
                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                  <Crown className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Link href="/kyc-verification">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 cursor-pointer hover:from-orange-600 hover:to-red-600 transition-all duration-200">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    unverified
                  </Badge>
                </Link>
              )}
              
              <Link href="/coupons">
                <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 native-button haptic-light touch-target">
                  <Gift className="h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600 dark:text-gray-400 relative native-button haptic-light touch-target"
                onClick={() => setIsNotificationCenterOpen(true)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
              </Button>
              
              <Link href="/account">
                <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 native-button haptic-light touch-target">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 space-y-8 lg:space-y-0">
            
            {/* Left Column - Main Wallet Info (Mobile: full width, Desktop: 8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Enhanced Balance Card */}
              <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 dark:from-purple-800 dark:via-blue-800 dark:to-purple-900 text-white border-0 shadow-2xl rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-2xl"></div>
                
                <CardContent className="p-6 lg:p-8 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-2xl px-4 py-2">
                        <span className="text-white mr-2">$</span>
                        {t("usd")}
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white/80 hover:text-white hover:bg-white/20"
                        onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                      >
                        {isBalanceVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white/80 hover:text-white hover:bg-white/20"
                      >
                        <Copy className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-white/80 text-lg">{t("totalBalance")}</span>
                      <Info className="h-5 w-5 text-white/60" />
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-bold text-white mb-2">
                      {isBalanceVisible ? `$${balance.toLocaleString()}` : '••••••'}
                    </h2>
                    <div className="flex items-center gap-2 text-white/80">
                      <TrendingUp className="h-4 w-4 text-green-300" />
                      <span className="text-sm">+$125 this month</span>
                    </div>
                  </div>
                  
                  {/* Enhanced Quick Actions */}
                  <div className="grid grid-cols-4 gap-4 lg:gap-6">
                    <Link href="/deposit">
                      <div className="text-center cursor-pointer group">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-white/30 group-hover:scale-105 transition-all duration-300">
                          <Plus className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                        </div>
                        <span className="text-sm lg:text-base text-white/90 font-medium">{t("deposit")}</span>
                      </div>
                    </Link>
                    
                    <Link href="/withdraw">
                      <div className="text-center cursor-pointer group">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-white/30 group-hover:scale-105 transition-all duration-300">
                          <Minus className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                        </div>
                        <span className="text-sm lg:text-base text-white/90 font-medium">{t("withdraw")}</span>
                      </div>
                    </Link>
                    
                    <Link href="/qr">
                      <div className="text-center cursor-pointer group">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-white/30 group-hover:scale-105 transition-all duration-300">
                          <QrCode className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                        </div>
                        <span className="text-sm lg:text-base text-white/90 font-medium">QR</span>
                      </div>
                    </Link>
                    
                    <Link href="/hub">
                      <div className="text-center cursor-pointer group">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-white/30 group-hover:scale-105 transition-all duration-300">
                          <Grid3X3 className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                        </div>
                        <span className="text-sm lg:text-base text-white/90 font-medium">Hub</span>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Desktop-Only Quick Stats Row */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-6">
                {quickStats.map((stat, index) => (
                  <Card key={index} className="bg-white/90 dark:bg-gray-800/90 border border-white/30 shadow-lg rounded-2xl backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                        <div className={`flex items-center text-sm font-medium ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          <TrendingUp className={`h-4 w-4 mr-1 ${!stat.positive && 'rotate-180'}`} />
                          {stat.trend}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop-Only Recent Transactions */}
              <div className="hidden lg:block">
                <Card className="bg-white/90 dark:bg-gray-800/90 border border-white/30 shadow-lg rounded-2xl backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        المعاملات الأخيرة
                      </CardTitle>
                      <Link href="/transactions">
                        <Button variant="ghost" className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                          <span className="ml-2">عرض الكل</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 hover:bg-gray-100/50 dark:hover:bg-gray-900/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              transaction.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/30' :
                              transaction.type === 'withdraw' ? 'bg-red-100 dark:bg-red-900/30' :
                              'bg-blue-100 dark:bg-blue-900/30'
                            }`}>
                              {transaction.type === 'deposit' ? (
                                <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
                              ) : transaction.type === 'withdraw' ? (
                                <Minus className="h-6 w-6 text-red-600 dark:text-red-400" />
                              ) : (
                                <ArrowRight className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{transaction.description}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.time}</p>
                            </div>
                          </div>
                          <div className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Sidebar Content (Mobile: full width, Desktop: 4 columns) */}
            <div className="lg:col-span-4 space-y-6">

              {/* KYC Status Card */}
              {kycStatus && (kycStatus as any).status !== 'verified' && (
                <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-xl rounded-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-3 rounded-full">
                        <Info className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-1">
                          {t("verifyIdentity")}
                        </h3>
                        <p className="text-white/80 text-sm">
                          أكمل التحقق لإلغاء القيود
                        </p>
                      </div>
                      <Link href="/kyc">
                        <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cards Quick Access */}
              <Card className="bg-white/90 dark:bg-gray-800/90 border border-white/30 shadow-lg rounded-2xl backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    البطاقات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/cards">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">إدارة البطاقات</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">عرض وإدارة بطاقاتك</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </Link>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">طلب بطاقة جديدة</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">احصل على بطاقة فورية</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        طلب
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Services */}
              <Card className="bg-white/90 dark:bg-gray-800/90 border border-white/30 shadow-lg rounded-2xl backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    الخدمات السريعة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/transfer">
                      <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">تحويل</p>
                      </div>
                    </Link>
                    
                    <Link href="/bills">
                      <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">الفواتير</p>
                      </div>
                    </Link>
                    
                    <Link href="/analytics">
                      <div className="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                          <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">تحليلات</p>
                      </div>
                    </Link>
                    
                    <Link href="/wallet">
                      <div className="text-center p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Wallet className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">المحفظة</p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Notification Center */}
          {isNotificationCenterOpen && (
            <NotificationCenter 
              isOpen={isNotificationCenterOpen}
              onClose={() => setIsNotificationCenterOpen(false)}
            />
          )}
        </div>
      </PullToRefresh>
    </div>
  );
}