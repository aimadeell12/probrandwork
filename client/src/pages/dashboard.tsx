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
import KycWarning from "@/components/kyc-warning";

export default function Dashboard() {
  const { t, language } = useLanguage();
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const queryClient = useQueryClient();
  const { triggerHaptic } = useNativeInteractions();
  
  // Fetch user info
  const { data: userInfo } = useQuery<any>({
    queryKey: ["/api/auth/user"],
  });
  
  const { data: walletData } = useQuery<any>({
    queryKey: ["/api/wallet/balance"],
  });

  // Fetch pending balances
  const { data: pendingBalances = [], isLoading: pendingLoading } = useQuery<any[]>({
    queryKey: ["/api/wallet/pending-balances"],
  });

  // Fetch unread notifications count
  const { data: notificationsData } = useQuery<any>({
    queryKey: ["/api/notifications/unread-count"],
  });

  // Fetch recent transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<any[]>({
    queryKey: ["/api/transactions"],
  });

  // Fetch KYC status
  const { data: kycStatus } = useQuery<any>({
    queryKey: ["/api/user/kyc-status"],
  });

  const balance = walletData?.balance || 0;
  const pendingBalance = walletData?.pendingBalance || 0;
  const unreadCount = notificationsData?.count || 0;

  // Pull to refresh function
  const handleRefresh = async () => {
    triggerHaptic();
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/pending-balances"] }),
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
    <div className="h-screen bg-gray-50 dark:bg-background lg:h-auto lg:overflow-auto overflow-hidden pb-24 lg:pb-6">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="h-full flex flex-col max-w-md lg:max-w-none mx-auto lg:p-6 overflow-hidden">
          {/* Fixed Header Area */}
          <div className="flex-shrink-0 bg-white dark:bg-background lg:bg-transparent lg:rounded-xl lg:p-4">
            {/* User Greeting - Fixed */}
            <div className="flex items-center justify-between px-4 lg:px-6 py-4 lg:bg-white lg:dark:bg-background lg:rounded-xl lg:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {getFirstName().charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {language === 'ar' ? 'مرحباً' : 'HELLO'} {getFirstName()}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    {language === 'ar' ? 'يسعدنا رؤيتك' : 'HAPPY TO SEE YOU'} <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-muted rounded-full"
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
            <div className="px-4 lg:px-6 mb-2 lg:mb-0 lg:mt-4">
              <div className="bg-gray-200 dark:bg-muted rounded-full p-1 flex lg:max-w-md lg:mx-auto">
                <Button className="flex-1 rounded-full py-2 px-4 text-sm font-medium bg-red-500 text-white">
                  {language === 'ar' ? 'الحساب' : 'ACCOUNT'}
                </Button>
                <Button 
                  variant="ghost"
                  className="flex-1 rounded-full py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-border"
                >
                  {language === 'ar' ? 'البطاقة' : 'CARD'}
                </Button>
              </div>
            </div>

            {/* Balance Section - Fixed */}
            <div className="mb-2 py-4 border-b border-gray-50 dark:border-border lg:border-0 lg:py-6 lg:bg-white lg:dark:bg-background lg:rounded-xl lg:shadow-sm lg:mt-4 lg:mx-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">{language === 'ar' ? 'إجمالي الرصيد' : 'Total Balance'}</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-muted rounded-full h-6 w-6"
                  onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                >
                  {isBalanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="text-center mb-3">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isBalanceVisible ? `${(balance + pendingBalance).toLocaleString()} USD` : '******* USD'}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3 px-4 mt-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet className="h-4 w-4 text-green-600" />
                    <p className="text-xs text-green-600 font-medium">{language === 'ar' ? 'متاح' : 'Available'}</p>
                  </div>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400">
                    {isBalanceVisible ? `${balance.toLocaleString()} USD` : '*******'}
                  </p>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <p className="text-xs text-primary font-medium">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</p>
                  </div>
                  <p className="text-lg font-bold text-red-700 dark:text-red-400">
                    {isBalanceVisible ? `${pendingBalance.toLocaleString()} USD` : '*******'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Content Area - Completely Static */}
          <div className="flex-shrink-0 p-3 lg:p-0 lg:mt-6 overflow-hidden">
            {/* KYC Warning */}
            {kycStatus && !kycStatus.isVerified && (
              <div className="mb-6 lg:mx-4">
                <KycWarning status={kycStatus.status} message={kycStatus.message} />
              </div>
            )}

            {/* Quick Actions - Fixed */}
            <div className="mb-6 lg:bg-white lg:dark:bg-background lg:rounded-xl lg:shadow-sm lg:p-6 lg:mx-4">
              <h3 className="hidden lg:block text-lg font-semibold text-gray-900 dark:text-white mb-4">{language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}</h3>
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
                <Link href={kycStatus?.isVerified ? "/send" : "#"}>
                  <div className={`text-center cursor-pointer hover:opacity-80 transition-opacity ${!kycStatus?.isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="w-16 h-16 bg-red-100/80 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-2 shadow-sm mx-auto">
                      <ArrowUpRight className="h-6 w-6 text-primary dark:text-red-300" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium block">{language === 'ar' ? 'إرسال' : 'Send'}</span>
                  </div>
                </Link>

                <Link href={kycStatus?.isVerified ? "/deposit" : "#"}>
                  <div className={`text-center cursor-pointer hover:opacity-80 transition-opacity ${!kycStatus?.isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="w-16 h-16 bg-red-100/80 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-2 shadow-sm mx-auto">
                      <ArrowDownLeft className="h-6 w-6 text-primary dark:text-red-300" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium block">{language === 'ar' ? 'إيداع' : 'Deposit'}</span>
                  </div>
                </Link>

                <Link href={kycStatus?.isVerified ? "/withdraw" : "#"}>
                  <div className={`text-center cursor-pointer hover:opacity-80 transition-opacity ${!kycStatus?.isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="w-16 h-16 bg-red-100/80 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-2 shadow-sm mx-auto">
                      <Banknote className="h-6 w-6 text-primary dark:text-red-300" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium block">{language === 'ar' ? 'سحب' : 'Withdraw'}</span>
                  </div>
                </Link>

                <Link href={kycStatus?.isVerified ? "/services" : "#"}>
                  <div className={`text-center cursor-pointer hover:opacity-80 transition-opacity ${!kycStatus?.isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="w-16 h-16 bg-red-100/80 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-2 shadow-sm mx-auto">
                      <Grid3X3 className="h-6 w-6 text-primary dark:text-red-300" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium block">{language === 'ar' ? 'المزيد' : 'More'}</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Pending Balances Section */}
            {pendingBalances.length > 0 && (
              <div className="mb-6 lg:bg-white lg:dark:bg-background lg:rounded-xl lg:shadow-sm lg:p-6 lg:mx-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">Pending Funds</h3>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    {pendingBalances.length} pending
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {pendingBalances.map((pending: any) => {
                    const releaseDate = new Date(pending.releaseDate);
                    const now = new Date();
                    const daysLeft = Math.max(0, Math.ceil((releaseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                    const isAvailableNow = daysLeft === 0;
                    
                    return (
                      <div key={pending.id} className={`p-3 rounded-lg border ${isAvailableNow ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                              {pending.description || 'Payment Link Transaction'}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span className={isAvailableNow ? 'text-green-600 dark:text-green-400 font-semibold' : ''}>
                                {isAvailableNow
                                  ? 'Releasing now...'
                                  : `Available in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Release: {releaseDate.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-sm ${isAvailableNow ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                              +${parseFloat(pending.amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {pending.currency}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      For your security, funds from payment links are held for 7 days before being released to your wallet.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Transactions - Fixed */}
            <div className="pb-3 lg:bg-white lg:dark:bg-background lg:rounded-xl lg:shadow-sm lg:p-6 lg:mx-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">{language === 'ar' ? 'المعاملات الأخيرة' : 'Recent transactions'}</h3>
                <Link href="/transactions">
                  <Button variant="ghost" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
                    {language === 'ar' ? 'عرض الكل' : 'See more'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {transactionsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-gray-50 dark:bg-muted rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-border rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-border rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-border rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-border rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 2).map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {transaction.merchant || transaction.description || (language === 'ar' ? 'معاملة مالية' : 'Transaction')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : (language === 'ar' ? 'تاريخ غير صالح' : 'Invalid Date')}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-primary dark:text-red-400 text-sm">
                        -${typeof transaction.amount === 'string' ? transaction.amount : (transaction.amount / 100)?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
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