import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Settings, 
  Shield, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Globe,
  User
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocation } from "wouter";

export default function Account() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      window.location.href = "/login";
    } catch (error) {
      toast({
        title: t("error"),
        description: t("logoutError"),
        variant: "destructive",
      });
    }
  };

  // Define the settings menu items
  const settingsItems = [
    {
      icon: User,
      title: "تعديل الملف الشخصي",
      description: "إدخال البيانات الحقيقية والكاملة",
      path: "/edit-profile",
      color: "purple"
    },
    {
      icon: Settings,
      title: t("accountSettings"),
      description: t("editPreferences"),
      path: "/account/settings",
      color: "blue"
    },
    {
      icon: Shield,
      title: t("securityPrivacy"),
      description: t("managePasswords"),
      path: "/account/security",
      color: "green"
    },
    {
      icon: CreditCard,
      title: t("cardManagement"),
      description: t("manageCards"),
      path: "/cards",
      color: "blue"
    },
    {
      icon: Bell,
      title: t("notifications"),
      description: t("customizeAlerts"),
      path: "/account/notifications",
      color: "orange"
    },
    {
      icon: HelpCircle,
      title: t("helpSupport"),
      description: t("helpSupportDesc"),
      path: "/support",
      color: "pink"
    }
  ];

  const handleSettingClick = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden pb-20">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-purple-200/30 dark:border-purple-700/30 p-4 relative z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1 text-left">
            {t('myAccount')}
          </h1>
          <LanguageToggle className="absolute right-4" />
        </div>
      </div>

      <div className="p-4 space-y-6 relative z-10">
        {/* Settings Items */}
        {settingsItems.map((item, index) => (
          <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl hover:shadow-2xl transition-all duration-200">
            <CardContent className="p-0">
              <Button
                variant="ghost"
                className="w-full justify-between p-5 h-auto hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                onClick={() => handleSettingClick(item.path)}
              >
                <div className="flex items-center space-x-5">
                  <div className={`rounded-xl p-3 ${
                    item.color === "purple" 
                      ? "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40" 
                      : item.color === "green"
                      ? "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40"
                      : item.color === "blue"
                      ? "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40"
                      : item.color === "orange" 
                      ? "bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40" 
                      : item.color === "pink"
                      ? "bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/40 dark:to-pink-800/40"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}>
                    <item.icon className={`h-5 w-5 ${
                      item.color === "purple" 
                        ? "text-purple-600 dark:text-purple-300" 
                        : item.color === "green"
                        ? "text-green-600 dark:text-green-300"
                        : item.color === "blue"
                        ? "text-blue-600 dark:text-blue-300"
                        : item.color === "orange" 
                        ? "text-orange-600 dark:text-orange-300" 
                        : item.color === "pink"
                        ? "text-pink-600 dark:text-pink-300"
                        : "text-gray-600 dark:text-gray-300"
                    }`} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Language Settings */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div className="rounded-xl p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40">
                  <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t('language')}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('selectAppLanguage')}
                  </p>
                </div>
              </div>
              <LanguageToggle />
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full mt-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 ml-2" />
          {t('logout')}
        </Button>
      </div>
    </div>
  );
}