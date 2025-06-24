import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowRight, QrCode, ChevronDown, Info, Gift, Bell, Crown, Grid3X3, AlertTriangle, CreditCard, Wallet, Settings, Activity, TrendingUp, Eye, EyeOff, Copy, Send, Smartphone, DollarSign, PiggyBank, Zap, Shield, MapPin, Clock, MoreHorizontal, ArrowUpRight, ArrowDownLeft, Building2, Banknote } from "lucide-react";
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

  return (
    <div className="dashboard-fixed h-screen h-[100dvh] bg-white w-full">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="dashboard-content h-full overflow-y-auto p-4 pb-24 max-w-md mx-auto">
          
          {/* Header - Fixed at top */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dashboard-sticky flex items-center justify-between mb-4 pt-2 top-0 pb-2 border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-700 dark:bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white dark:text-gray-700 font-bold text-lg">
                  {userInfo ? (userInfo as any).firstName.charAt(0) : 'A'}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  HELLO {userInfo ? (userInfo as any).firstName.toUpperCase() : 'AIMAD'}
                </h1>
                <p className="text-gray-600 text-sm">
                  HAPPY TO SEE YOU :)
                </p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-600 relative"
              onClick={() => setIsNotificationCenterOpen(true)}
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Button>
          </motion.div>

          {/* Account/Card Toggle - Fixed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="dashboard-sticky mb-4 top-16 py-2"
          >
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex">
              <Button
                variant="ghost"
                className="flex-1 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 font-medium"
              >
                ACCOUNT
              </Button>
              <Button
                variant="ghost"
                className="flex-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
              >
                CARD
              </Button>
            </div>
          </motion.div>

          {/* Balance Section - Fixed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="dashboard-sticky mb-4 text-center top-28 py-3 border-b border-gray-50"
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Compte chèque</p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <motion.h2 
                key={balance}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-gray-900 dark:text-white"
              >
                {isBalanceVisible ? `${balance.toLocaleString()} DH` : '******* DH'}
              </motion.h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              >
                {isBalanceVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </Button>
            </div>
          </motion.div>

          {/* Quick Actions - Scrollable content starts here */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 mt-4"
          >
            <div className="grid grid-cols-4 gap-4">
              <Link href="/send">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-center cursor-pointer"
                >
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 shadow-lg border border-gray-200 dark:border-gray-700">
                    <ArrowUpRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Send</span>
                </motion.div>
              </Link>

              <Link href="/pay">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-center cursor-pointer"
                >
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 shadow-lg border border-gray-200 dark:border-gray-700">
                    <Banknote className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Pay</span>
                </motion.div>
              </Link>

              <Link href="/cards">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-center cursor-pointer"
                >
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 shadow-lg border border-gray-200 dark:border-gray-700">
                    <CreditCard className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">BBAN</span>
                </motion.div>
              </Link>

              <Link href="/account">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-center cursor-pointer"
                >
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 shadow-lg border border-gray-200 dark:border-gray-700">
                    <MoreHorizontal className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">More</span>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Recent Transactions - Scrollable */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 flex-1"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent transactions</h3>
              <Link href="/transactions">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 font-medium">
                  See more <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-0 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {Array.isArray(transactions) && transactions.length > 0 ? (
                transactions.slice(0, 2).map((transaction: any, index: number) => (
                  <motion.div 
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-gray-900 dark:bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm uppercase">
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
                ))
              ) : (
                <div className="text-center p-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    لا توجد معاملات حتى الآن
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    ابدأ بإنشاء بطاقة لرؤية المعاملات
                  </p>
                </div>
              )}
            </div>
          </motion.div>

        </div>

        {/* Notification Center */}
        <NotificationCenter 
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
        />
      </PullToRefresh>
    </div>
  );
}