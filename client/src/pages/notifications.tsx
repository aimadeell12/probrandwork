import { useState } from "react";
import { ArrowLeft, Bell, Mail, MessageSquare, DollarSign, CreditCard, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { NotificationsSkeleton } from "@/components/skeletons";

export default function Notifications() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch user notifications settings
  const { data: userSettings, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const [notificationSettings, setNotificationSettings] = useState({
    // Transaction notifications
    transactionAlerts: true,
    largeTransactions: true,
    failedTransactions: true,
    
    // Account notifications
    loginAlerts: true,
    passwordChanges: true,
    accountChanges: true,
    
    // Marketing
    promotions: false,
    newsletters: true,
    productUpdates: true,
    
    // Delivery preferences
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false
  });

  const handleSettingToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast({
      title: "Settings Updated",
      description: "Notification preferences saved successfully",
    });
  };

  const notificationGroups = [
    {
      title: "Transaction Notifications",
      icon: DollarSign,
      settings: [
        {
          key: "transactionAlerts" as keyof typeof notificationSettings,
          title: "Transaction Alerts",
          description: "Get notified for all transactions"
        },
        {
          key: "largeTransactions" as keyof typeof notificationSettings,
          title: "Large Transaction Alerts",
          description: "Alerts for transactions over $1,000"
        },
        {
          key: "failedTransactions" as keyof typeof notificationSettings,
          title: "Failed Transaction Alerts",
          description: "Notifications when transactions fail"
        }
      ]
    },
    {
      title: "Security Notifications",
      icon: AlertTriangle,
      settings: [
        {
          key: "loginAlerts" as keyof typeof notificationSettings,
          title: "Login Alerts",
          description: "New device or location logins"
        },
        {
          key: "passwordChanges" as keyof typeof notificationSettings,
          title: "Password Changes",
          description: "When password is changed"
        },
        {
          key: "accountChanges" as keyof typeof notificationSettings,
          title: "Account Changes",
          description: "Profile or settings modifications"
        }
      ]
    },
    {
      title: "Marketing & Updates",
      icon: Bell,
      settings: [
        {
          key: "promotions" as keyof typeof notificationSettings,
          title: "Promotional Offers",
          description: "Special deals and offers"
        },
        {
          key: "newsletters" as keyof typeof notificationSettings,
          title: "Newsletters",
          description: "Monthly product newsletters"
        },
        {
          key: "productUpdates" as keyof typeof notificationSettings,
          title: "Product Updates",
          description: "New features and improvements"
        }
      ]
    }
  ];

  // Show skeleton while loading
  if (isLoading) {
    return <NotificationsSkeleton />;
  }

  const bgColor = '#0f0a19';
  const cardBg = '#1a1230';
  const borderColor = '#2a2040';

  return (
    <div className="min-h-screen relative overflow-hidden pb-20" style={{ backgroundColor: bgColor }}>
      
      {/* Header */}
      <div className="p-4 relative z-10" style={{ backgroundColor: bgColor, borderBottom: `1px solid ${borderColor}` }}>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/account")}
            className="p-2 text-purple-400 hover:bg-purple-500/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">
            الإشعارات
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6 relative z-10">
        {/* Delivery Preferences */}
        <Card className="border shadow-xl" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
          <CardHeader>
            <CardTitle className="text-base text-white">Delivery Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="font-medium text-white">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={() => handleSettingToggle('emailNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Bell className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="font-medium text-white">Push Notifications</p>
                  <p className="text-sm text-gray-400">Browser and app notifications</p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={() => handleSettingToggle('pushNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="font-medium text-white">SMS Notifications</p>
                  <p className="text-sm text-gray-400">Text message alerts</p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.smsNotifications}
                onCheckedChange={() => handleSettingToggle('smsNotifications')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Categories */}
        {notificationGroups.map((group) => {
          const Icon = group.icon;
          return (
            <Card key={group.title} className="border shadow-sm" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2 space-x-reverse text-white">
                  <Icon className="h-5 w-5 text-purple-400" />
                  <span>{group.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.settings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{setting.title}</p>
                      <p className="text-sm text-gray-400">{setting.description}</p>
                    </div>
                    <Switch
                      checked={notificationSettings[setting.key]}
                      onCheckedChange={() => handleSettingToggle(setting.key)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}

        {/* Quick Actions */}
        <Card className="border shadow-sm" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
          <CardHeader>
            <CardTitle className="text-base text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-[#2a2040] text-gray-300 hover:bg-purple-500/20"
              onClick={() => {
                setNotificationSettings(prev => ({
                  ...prev,
                  transactionAlerts: true,
                  largeTransactions: true,
                  failedTransactions: true,
                  loginAlerts: true,
                  passwordChanges: true,
                  accountChanges: true
                }));
                toast({
                  title: "All Essential Notifications Enabled",
                  description: "Security and transaction alerts are now active",
                });
              }}
            >
              Enable All Essential Notifications
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start border-[#2a2040] text-gray-300 hover:bg-purple-500/20"
              onClick={() => {
                setNotificationSettings(prev => ({
                  ...prev,
                  promotions: false,
                  newsletters: false,
                  productUpdates: false
                }));
                toast({
                  title: "Marketing Notifications Disabled",
                  description: "You will no longer receive promotional content",
                });
              }}
            >
              Disable All Marketing
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}