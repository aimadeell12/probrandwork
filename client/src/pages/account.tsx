import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Settings, 
  Shield, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight
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
      await apiRequest("/api/auth/logout", "POST");
      window.location.reload();
    } catch (error) {
      toast({
        title: t("error"),
        description: t("logoutError"),
        variant: "destructive",
      });
    }
  };

  // Define the settings menu items based on the screenshot
  const settingsItems = [
    {
      icon: Settings,
      title: t("accountSettings"),
      description: t("editPreferences"),
      path: "/account/settings"
    },
    {
      icon: Shield,
      title: t("securityPrivacy"),
      description: t("managePasswords"),
      path: "/account/security"
    },
    {
      icon: CreditCard,
      title: t("cardManagement"),
      description: t("manageCards"),
      path: "/cards"
    },
    {
      icon: Bell,
      title: t("notifications"),
      description: t("customizeAlerts"),
      path: "/account/notifications"
    },
    {
      icon: HelpCircle,
      title: t("helpSupport"),
      description: t("helpSupportDesc"),
      path: "/support"
    }
  ];

  const handleSettingClick = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1 text-center">
            {t("accountSettings")}
          </h1>
          <LanguageToggle className="absolute right-4" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Settings Items based on the screenshot */}
        {settingsItems.map((item, index) => (
          <Card key={index} className="border-0 shadow-sm bg-white dark:bg-gray-900">
            <CardContent className="p-0">
              <Button
                variant="ghost"
                className="w-full justify-between p-5 h-auto"
                onClick={() => handleSettingClick(item.path)}
              >
                <div className="flex items-center space-x-5">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
                    <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full mt-4"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 ml-2" />
          {t("logout")}
        </Button>
      </div>
    </div>
  );
}