import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowRight, QrCode, ChevronDown, Info, Gift, Bell, Crown, Grid3X3, AlertTriangle, CreditCard, Wallet, Settings, Activity, TrendingUp, Eye, EyeOff, Copy, Send, Smartphone, DollarSign, PiggyBank, Zap, Shield, MapPin, Clock, MoreHorizontal, ArrowUpRight, ArrowDownLeft, Building2, Banknote, Heart, FileText } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { useNativeInteractions } from "@/hooks/useNativeInteractions";
import NotificationCenter from "@/components/notification-center";
import PullToRefresh from "@/components/pull-to-refresh";
// Removed DashboardSkeleton import to prevent duplicate loading screens

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
  const { data: notificationsData } = useQuery({
    queryKey: ["/api/notifications/unread-count"],
  });

  // Fetch recent transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const balance = walletData?.balance || 0;
  const unreadCount = notificationsData?.count || 0;

  // Pull to refresh function
  const handleRefresh = async () => {
    triggerHaptic();
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] }),
    ]);
  };

  // Get the first name from user info
  const getFirstName = () => {
    if (userInfo?.firstName) {
      return userInfo.firstName.toUpperCase();
    }
    return "USER";
  };

  // Remove skeleton loading - show dashboard immediately

  return (
    <div className="h-screen h-[100dvh] bg-white w-full overflow-hidden fixed">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="h-full flex flex-col max-w-md mx-auto overflow-hidden">
          {/* Fixed Header Area */}
          <div className="flex-shrink-0 bg-white">
            {/* User Greeting - Fixed */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {getFirstName().charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    HELLO {getFirstName()}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    HAPPY TO SEE YOU <Heart className="h-4 w-4 text-purple-500 fill-purple-500" />
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                onClick={() => setIsNotificationCenterOpen(true)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Account/Card Toggle - Fixed */}
            <div className="px-4 mb-2">
              <div className="bg-gray-200 rounded-full p-1 flex">
                <Button className="flex-1 rounded-full py-2 px-4 text-sm font-medium bg-purple-500 text-white">
                  ACCOUNT
                </Button>
                <Button 
                  variant="ghost"
                  className="flex-1 rounded-full py-2 px-4 text-sm font-medium text-gray-600 hover:bg-gray-300"
                >
                  CARD
                </Button>
              </div>
            </div>

            {/* Balance Section - Fixed */}
            <div className="mb-2 text-center py-2 border-b border-gray-50">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Balance account</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isBalanceVisible ? `${balance.toLocaleString()} USD` : '******* USD'}
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                  onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                >
                  {isBalanceVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Fixed Content Area - Completely Static */}
          <div className="flex-shrink-0 p-3 overflow-hidden">
            {/* Quick Actions - Fixed */}
            <div className="mb-6">
              <div className="grid grid-cols-4 gap-4">
                <Link href="/send">
                  <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-16 h-16 bg-purple-100/80 rounded-full flex items-center justify-center mb-2 shadow-sm mx-auto">
                      <ArrowUpRight className="h-6 w-6 text-purple-600" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium block">Send</span>
                  </div>
                </Link>

                <Link href="/deposit">
                  <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-16 h-16 bg-purple-100/80 rounded-full flex items-center justify-center mb-2 shadow-sm mx-auto">
                      <ArrowDownLeft className="h-6 w-6 text-purple-600" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium block">Deposit</span>
                  </div>
                </Link>

                <Link href="/withdraw">
                  <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-16 h-16 bg-purple-100/80 rounded-full flex items-center justify-center mb-2 shadow-sm mx-auto">
                      <Banknote className="h-6 w-6 text-purple-600" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium block">Withdraw</span>
                  </div>
                </Link>

                <Link href="/services">
                  <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-16 h-16 bg-purple-100/80 rounded-full flex items-center justify-center mb-2 shadow-sm mx-auto">
                      <Grid3X3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium block">More</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Transactions - Fixed */}
            <div className="pb-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent transactions</h3>
                <Link href="/transactions">
                  <Button variant="ghost" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
                    See more
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {transactionsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 2).map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {transaction.merchant || transaction.description || 'معاملة مالية'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Invalid Date
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-red-600 dark:text-red-400 text-sm">
                        -${typeof transaction.amount === 'string' ? transaction.amount : (transaction.amount / 100)?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                  </div>
                  <p className="text-sm">No recent transactions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </PullToRefresh>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </div>
  );
}