import { useState } from "react";
import { ArrowLeft, Bell, Mail, MessageSquare, DollarSign, CreditCard, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Notifications() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden pb-20">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-purple-200/30 dark:border-purple-700/30 p-4 relative z-10">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/account")}
            className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            الإشعارات
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6 relative z-10">
        {/* Delivery Preferences */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-base">Delivery Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={() => handleSettingToggle('emailNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Bell className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Browser and app notifications</p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={() => handleSettingToggle('pushNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Text message alerts</p>
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
            <Card key={group.title} className="border-0 shadow-sm bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2 space-x-reverse">
                  <Icon className="h-5 w-5" />
                  <span>{group.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.settings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{setting.title}</p>
                      <p className="text-sm text-gray-500">{setting.description}</p>
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
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                // Enable all essential notifications
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
              className="w-full justify-start"
              onClick={() => {
                // Disable all marketing notifications
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