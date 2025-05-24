import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Settings, 
  Shield, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LanguageToggle } from "@/components/language-toggle";

export default function Account() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

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

  const menuItems = [
    {
      icon: Settings,
      title: "إعدادات الحساب",
      description: "تعديل المعلومات الشخصية والتفضيلات",
      action: () => toast({ title: "قريباً", description: "هذه الميزة ستكون متاحة قريباً" })
    },
    {
      icon: Shield,
      title: "الأمان والخصوصية",
      description: "إدارة كلمات المرور والحماية",
      action: () => toast({ title: "قريباً", description: "هذه الميزة ستكون متاحة قريباً" })
    },
    {
      icon: CreditCard,
      title: "إدارة البطاقات",
      description: "عرض وإدارة جميع البطاقات",
      action: () => window.location.href = "/cards"
    },
    {
      icon: Bell,
      title: "الإشعارات",
      description: "تخصيص الإشعارات والتنبيهات",
      action: () => toast({ title: "قريباً", description: "هذه الميزة ستكون متاحة قريباً" })
    },
    {
      icon: HelpCircle,
      title: "المساعدة والدعم",
      description: "الحصول على المساعدة والدعم الفني",
      action: () => window.location.href = "/support"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center">
          حسابي
        </h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {(user as any)?.username?.charAt(0)?.toUpperCase() || "م"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {(user as any)?.username || "مستخدم"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(user as any)?.email || "user@example.com"}
                </p>
                <Badge variant="secondary" className="mt-2">
                  حساب مفعل
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-base">معلومات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">رقم الهاتف</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">+966 50 123 4567</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center space-x-3 space-x-reverse">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">البريد الإلكتروني</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{(user as any)?.email || "user@example.com"}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center space-x-3 space-x-reverse">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">العنوان</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-6 h-auto"
                    onClick={item.action}
                  >
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <Icon className="h-5 w-5 text-gray-400" />
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                  {index < menuItems.length - 1 && <Separator />}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardContent className="p-6">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}