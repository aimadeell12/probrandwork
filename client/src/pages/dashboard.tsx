import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowRight, QrCode, ChevronDown, Info, Gift, Bell, Crown, Grid3X3, AlertTriangle, CreditCard, Wallet, Settings, Activity, TrendingUp, Eye, EyeOff, Copy, Send, Smartphone, DollarSign, PiggyBank, Zap, Shield, MapPin, Clock } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { useNativeInteractions } from "@/hooks/useNativeInteractions";
import NotificationCenter from "@/components/notification-center";
import PullToRefresh from "@/components/pull-to-refresh";
import { motion, AnimatePresence } from "framer-motion";

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

  // Fetch real transactions
  const { data: transactionsData } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const balance = (walletData as any)?.balance || 0;
  const unreadCount = (unreadData as any)?.count || 0;
  const transactions = (transactionsData as any) || [];

  const handleRefresh = async () => {
    triggerHaptic();
    await queryClient.invalidateQueries();
  };

  // Quick actions for modern dashboard
  const quickActions = [
    { 
      title: "إيداع", 
      icon: Plus, 
      href: "/deposit", 
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-700 dark:text-emerald-300"
    },
    { 
      title: "سحب", 
      icon: Minus, 
      href: "/withdraw", 
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-300"
    },
    { 
      title: "QR", 
      icon: QrCode, 
      href: "/qr", 
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-300"
    },
    { 
      title: "إرسال", 
      icon: Send, 
      href: "/send", 
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-700 dark:text-purple-300"
    }
  ];

  // Service cards for quick access
  const serviceCards = [
    {
      title: "البطاقات",
      description: "إدارة بطاقاتك المصرفية",
      icon: CreditCard,
      href: "/cards",
      color: "from-blue-600 to-purple-600"
    },
    {
      title: "المعاملات",
      description: "تاريخ المعاملات المالية", 
      icon: Activity,
      href: "/transactions",
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "الإعدادات",
      description: "إعدادات الحساب",
      icon: Settings,
      href: "/account",
      color: "from-orange-600 to-red-600"
    },
    {
      title: "المساعدة",
      description: "الدعم والأسئلة الشائعة",
      icon: Shield,
      href: "/account/help",
      color: "from-purple-600 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 relative">
      {/* Modern floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="relative z-10 p-4 pb-24 max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  مرحباً بك في PayDota
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {userInfo ? `أهلاً ${(userInfo as any).firstName}` : 'إدارة أموالك بسهولة'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {kycStatus && (kycStatus as any).status === 'verified' ? (
                <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0">
                  <Crown className="h-3 w-3 mr-1" />
                  موثق
                </Badge>
              ) : (
                <Link href="/kyc-verification">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 cursor-pointer hover:from-amber-600 hover:to-orange-700 transition-all">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    غير موثق
                  </Badge>
                </Link>
              )}
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600 dark:text-gray-400 relative"
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
            </div>
          </motion.div>

          {/* Main Balance Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 text-white border-0 shadow-2xl rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl"></div>
              
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white/90 font-medium">الرصيد الإجمالي</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-full"
                    onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                  >
                    {isBalanceVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </Button>
                </div>

                <div className="mb-8">
                  <motion.h2 
                    key={balance}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl lg:text-6xl font-bold text-white mb-3"
                  >
                    {isBalanceVisible ? `$${balance.toLocaleString()}` : '••••••'}
                  </motion.h2>
                  <div className="flex items-center gap-2 text-white/80">
                    <TrendingUp className="h-4 w-4 text-emerald-300" />
                    <span className="text-sm">+2.5% هذا الشهر</span>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-center cursor-pointer"
                      >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center mb-3 hover:bg-white/30 transition-all duration-300">
                          <action.icon className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-sm text-white/90 font-medium">{action.title}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">الخدمات السريعة</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {serviceCards.map((service, index) => (
                <Link key={index} href={service.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                          <service.icon className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{service.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{service.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          {Array.isArray(transactions) && transactions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                      المعاملات الأخيرة
                    </CardTitle>
                    <Link href="/transactions">
                      <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                        عرض الكل
                        <ArrowRight className="h-4 w-4 mr-2" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 3).map((transaction: any, index: number) => (
                      <motion.div 
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 hover:bg-gray-100/50 dark:hover:bg-gray-900/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {transaction.merchant?.name || 'معاملة مالية'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(transaction.created).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600 dark:text-red-400 text-sm">
                            -${(transaction.amount / 100).toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Financial Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm opacity-90">الدخل الشهري</p>
                  <p className="text-xl font-bold">+$${Math.floor(balance * 0.15)}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 rotate-180" />
                  <p className="text-sm opacity-90">المصروفات</p>
                  <p className="text-xl font-bold">-$${Math.floor(balance * 0.08)}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 col-span-2 lg:col-span-1">
                <CardContent className="p-4 text-center">
                  <PiggyBank className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm opacity-90">الهدف الادخاري</p>
                  <p className="text-xl font-bold">75%</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* KYC Alert */}
          <AnimatePresence>
            {kycStatus && (kycStatus as any).status !== 'verified' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center">
                        <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                          أكمل التحقق من الهوية
                        </h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          لفتح جميع المزايا والخدمات المصرفية
                        </p>
                      </div>
                      <Link href="/kyc-verification">
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                          ابدأ الآن
                          <ArrowRight className="h-4 w-4 mr-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification Center */}
          <AnimatePresence>
            {isNotificationCenterOpen && (
              <NotificationCenter 
                isOpen={isNotificationCenterOpen}
                onClose={() => setIsNotificationCenterOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </PullToRefresh>
    </div>
  );
}