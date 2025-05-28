import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowRight, QrCode, X, ChevronDown, Info, Gift, Bell, Globe, Crown, Grid3X3 } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { useNativeInteractions } from "@/hooks/useNativeInteractions";
import NotificationCenter from "@/components/notification-center";
import PullToRefresh from "@/components/pull-to-refresh";

export default function Dashboard() {
  const { t } = useLanguage();
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
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
  const { data: kycData } = useQuery({
    queryKey: ["/api/kyc/status"],
  });

  const balance = (walletData as any)?.balance || 5.00;
  const unreadCount = (unreadData as any)?.count || 0;
  const kycStatus = kycData;
  const isAdmin = (userInfo as any)?.role === 'admin';

  // دالة تحديث البيانات عند السحب للتحديث
  const handleRefresh = async () => {
    triggerHaptic({ type: 'medium' });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/kyc/status"] }),
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-purple-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 status-bar-safe">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
              {t("wallet")}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link href="/admin-panel">
                <Button variant="ghost" size="icon" className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 native-button haptic-light touch-target" title="Admin Panel">
                  <Crown className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 native-button haptic-light touch-target">
              <Gift className="h-5 w-5" />
            </Button>
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
          </div>
        </div>

        {/* Main Content - Desktop Layout */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
          
          {/* Left Column - Main Wallet Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Currency Selector */}
            <div className="mb-6">
              <Button variant="outline" className="bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-2xl px-4 py-2">
                <span className="text-purple-600 mr-2">$</span>
                {t("usd")}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Balance Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm">{t("totalBalance")}</span>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
                $ {balance.toFixed(2)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-12">
              <Link href="/deposit">
                <div className="flex flex-col items-center cursor-pointer native-button haptic-medium touch-target">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/90 dark:bg-gray-800/90 ios-blur border border-purple-200/30 dark:border-purple-700/30 rounded-full flex items-center justify-center mb-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 font-medium">{t('deposit')}</span>
                </div>
              </Link>
              
              <Link href="/withdraw">
                <div className="flex flex-col items-center cursor-pointer native-button haptic-medium touch-target">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/90 dark:bg-gray-800/90 ios-blur border border-purple-200/30 dark:border-purple-700/30 rounded-full flex items-center justify-center mb-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Minus className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 font-medium">{t('withdraw')}</span>
                </div>
              </Link>
              
              <Link href="/send">
                <div className="flex flex-col items-center cursor-pointer native-button haptic-medium touch-target">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/90 dark:bg-gray-800/90 ios-blur border border-purple-200/30 dark:border-purple-700/30 rounded-full flex items-center justify-center mb-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <ArrowRight className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 font-medium">{t('send')}</span>
                </div>
              </Link>
              
              <Link href="/services">
                <div className="flex flex-col items-center cursor-pointer native-button haptic-medium touch-target">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/90 dark:bg-gray-800/90 ios-blur border border-purple-200/30 dark:border-purple-700/30 rounded-full flex items-center justify-center mb-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Grid3X3 className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 font-medium">Hub</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column - Status Cards & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">

        {/* KYC Status Card */}
        {kycStatus && (kycStatus as any).status !== 'verified' && (
          <Card className="bg-white/95 dark:bg-gray-800/95 ios-blur border border-white/30 shadow-xl rounded-3xl mb-6 native-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    (kycStatus as any).status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    (kycStatus as any).status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30' :
                    'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    <Info className={`h-6 w-6 ${
                      (kycStatus as any).status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                      (kycStatus as any).status === 'rejected' ? 'text-red-600 dark:text-red-400' :
                      'text-green-600 dark:text-green-400'
                    }`} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {(kycStatus as any).status === 'pending' ? 'Identity Verification Submitted' :
                       (kycStatus as any).status === 'rejected' ? 'Identity Verification Rejected' :
                       'Identity Verification Completed'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(kycStatus as any).status === 'pending' ? 'Your KYC verification is currently under review' :
                       (kycStatus as any).status === 'rejected' ? 'Your KYC verification was rejected. Please resubmit.' :
                       'Your identity has been successfully verified'}
                    </p>
                    <Badge variant="secondary" className={
                      (kycStatus as any).status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                      (kycStatus as any).status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    }>
                      {(kycStatus as any).status === 'pending' ? 'Under Review' : 
                       (kycStatus as any).status === 'verified' ? 'Verified' : 'Rejected'}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="native-button haptic-light touch-target">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications Card - Only show if no KYC submitted */}
        {!kycStatus && (
          <Card className="bg-white/95 dark:bg-gray-800/95 ios-blur border border-white/30 shadow-xl rounded-3xl mb-6 native-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <div className="w-8 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <Link href="/kyc-verification">
                      <div className="cursor-pointer native-button haptic-medium">
                        <h3 className="font-medium text-gray-900 dark:text-white">{t('guidanceForBeginnersTitle')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('pleaseVerifyIdentity')}</p>
                        <p className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700">{t('clickToVerify')}</p>
                      </div>
                    </Link>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-400 native-button haptic-light touch-target">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

          </div>
        </div>

          {/* Notification Center */}
          <NotificationCenter 
            isOpen={isNotificationCenterOpen}
            onClose={() => setIsNotificationCenterOpen(false)}
          />
        </div>
      </PullToRefresh>
    </div>
  );
}
