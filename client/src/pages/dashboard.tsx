import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowRight, QrCode, X, ChevronDown, Info, Gift, Bell, Globe, Crown, Grid3X3, AlertTriangle } from "lucide-react";
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
  const { data: kycStatus } = useQuery({
    queryKey: ["/api/kyc/status"],
  });

  const balance = (walletData as any)?.balance || 0;
  const unreadCount = (unreadData as any)?.count || 0;

  const handleRefresh = async () => {
    triggerHaptic();
    await queryClient.invalidateQueries();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div></div>
            <div className="flex items-center space-x-3">
              {kycStatus && (kycStatus as any).status === 'verified' ? (
                <div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              ) : (
                <div>
                  <Link href="/kyc-verification">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 cursor-pointer hover:from-orange-600 hover:to-red-600 transition-all duration-200">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      unverified
                    </Badge>
                  </Link>
                </div>
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

          {/* Main Content */}
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
                  <span className="text-gray-600 dark:text-gray-400">{t("totalBalance")}</span>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  ${balance.toLocaleString()}
                </h2>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-3 lg:gap-4">
                  <Link href="/deposit">
                    <div className="text-center cursor-pointer native-button haptic-light">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/90 dark:bg-gray-800/90 ios-blur border border-green-200/30 dark:border-green-700/30 rounded-full flex items-center justify-center mb-2 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Plus className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 font-medium">{t("deposit")}</span>
                    </div>
                  </Link>
                  
                  <Link href="/withdraw">
                    <div className="text-center cursor-pointer native-button haptic-light">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/90 dark:bg-gray-800/90 ios-blur border border-red-200/30 dark:border-red-700/30 rounded-full flex items-center justify-center mb-2 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Minus className="h-6 w-6 lg:h-8 lg:w-8 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 font-medium">{t("withdraw")}</span>
                    </div>
                  </Link>
                  
                  <Link href="/qr">
                    <div className="text-center cursor-pointer native-button haptic-light">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/90 dark:bg-gray-800/90 ios-blur border border-blue-200/30 dark:border-blue-700/30 rounded-full flex items-center justify-center mb-2 shadow-lg hover:shadow-xl transition-all duration-300">
                        <QrCode className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 font-medium">QR</span>
                    </div>
                  </Link>
                  
                  <Link href="/hub">
                    <div className="text-center cursor-pointer native-button haptic-light">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/90 dark:bg-gray-800/90 ios-blur border border-purple-200/30 dark:border-purple-700/30 rounded-full flex items-center justify-center mb-2 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Grid3X3 className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 font-medium">Hub</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Status Cards & Quick Actions */}
            <div className="lg:col-span-1 space-y-6">

              {/* KYC Status Card */}
              {kycStatus && (kycStatus as any).status !== 'verified' && (
                <Card className="bg-white/95 dark:bg-gray-800/95 ios-blur border border-white/30 shadow-xl rounded-3xl mb-6 native-card">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                        <Info className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {t("verifyIdentity")}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Complete verification to unlock all features
                        </p>
                      </div>
                      <Link href="/kyc">
                        <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 native-button haptic-medium">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
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