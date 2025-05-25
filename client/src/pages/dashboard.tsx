import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowRight, QrCode, X, ChevronDown, Info, Gift, Bell, Globe } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import NotificationCenter from "@/components/notification-center";

export default function Dashboard() {
  const { t } = useLanguage();
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  
  const { data: walletData } = useQuery({
    queryKey: ["/api/wallet/balance"],
  });

  // Fetch unread notifications count
  const { data: unreadData } = useQuery({
    queryKey: ["/api/notifications/unread-count"],
  });

  const balance = walletData?.balance || 5.00;
  const unreadCount = unreadData?.count || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-purple-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
              {t("wallet")}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400">
              <Gift className="h-5 w-5" />
            </Button>
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
        </div>

        {/* Currency Selector */}
        <div className="mb-6">
          <Button variant="outline" className="bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-2xl px-4 py-2">
            <span className="text-blue-600 mr-2">$</span>
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
          <div className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-8">
            $ {balance.toFixed(2)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          <Link href="/deposit">
            <div className="flex flex-col items-center cursor-pointer transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-purple-200/30 dark:border-purple-700/30 rounded-full flex items-center justify-center mb-2 shadow-lg hover:shadow-xl">
                <Plus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{t('deposit')}</span>
            </div>
          </Link>
          
          <Link href="/withdraw">
            <div className="flex flex-col items-center cursor-pointer transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-purple-200/30 dark:border-purple-700/30 rounded-full flex items-center justify-center mb-2 shadow-lg hover:shadow-xl">
                <Minus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{t('withdraw')}</span>
            </div>
          </Link>
          
          <Link href="/send">
            <div className="flex flex-col items-center cursor-pointer transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-purple-200/30 dark:border-purple-700/30 rounded-full flex items-center justify-center mb-2 shadow-lg hover:shadow-xl">
                <ArrowRight className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{t('send')}</span>
            </div>
          </Link>
          
          <Link href="/scan">
            <div className="flex flex-col items-center cursor-pointer transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-purple-200/30 dark:border-purple-700/30 rounded-full flex items-center justify-center mb-2 shadow-lg hover:shadow-xl">
                <QrCode className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{t('scan')}</span>
            </div>
          </Link>
        </div>

        {/* Notifications Card */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-xl rounded-3xl mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <div className="w-8 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="space-y-2">
                  <Link href="/nationality-selection">
                    <div className="cursor-pointer">
                      <h3 className="font-medium text-gray-900 dark:text-white">{t('guidanceForBeginnersTitle')}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('pleaseVerifyIdentity')}</p>
                      <p className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700">{t('clickToVerify')}</p>
                    </div>
                  </Link>

                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </div>
  );
}
