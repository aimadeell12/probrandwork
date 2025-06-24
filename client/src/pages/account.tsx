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
  User,
  Gift,
  Phone,
  Crown
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

  const navigateTo = (path: string) => {
    setLocation(path);
  };

  // Format phone number with masking
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "Phone not set";
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Format as XXX***XXXX
    if (digits.length >= 7) {
      const start = digits.slice(0, 3);
      const end = digits.slice(-4);
      return `${start}***${end}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden pb-20">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-purple-200/30 dark:border-purple-700/30 p-4 relative z-10">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-medium text-gray-900 dark:text-white">
            My
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 py-4 relative z-10 max-w-sm">
        
        {/* User Profile Card */}
        <Card className="bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 text-white mb-4 shadow-lg border-0 rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <button 
              onClick={() => navigateTo("/profile")}
              className="w-full flex items-center space-x-3 hover:bg-white/10 transition-colors rounded-lg p-1"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white/90 text-sm font-medium mb-1">Hello!</p>
                <p className="text-white text-lg font-semibold">
                  {formatPhoneNumber(user?.phone || "")}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-white/70" />
            </button>
          </CardContent>
        </Card>

        {/* Menu Items */}
        {/* Settings Group */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 dark:border-purple-700/30 shadow-lg mb-3 rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={() => navigateTo("/account/language")} 
              className="w-full p-3 flex items-center justify-between hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors border-b border-purple-100/30 dark:border-purple-700/30 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Language
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/account/payment-password")} 
              className="w-full p-3 flex items-center justify-between hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Setting Payment Password
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* Support Group */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 dark:border-purple-700/30 shadow-lg mb-3 rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={() => navigateTo("/customer-service")} 
              className="w-full p-3 flex items-center justify-between hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors border-b border-purple-100/30 dark:border-purple-700/30"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Customer Service
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/security-privacy")} 
              className="w-full p-3 flex items-center justify-between hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Security Settings
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* Cards & Services Group */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 dark:border-purple-700/30 shadow-lg mb-3 rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={() => navigateTo("/card-purchase-record")} 
              className="w-full p-3 flex items-center justify-between hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors border-b border-purple-100/30 dark:border-purple-700/30"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Card Purchase Record
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/coupons")} 
              className="w-full p-3 flex items-center justify-between hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors border-b border-purple-100/30 dark:border-purple-700/30"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Gift className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Coupons
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/about")} 
              className="w-full p-3 flex items-center justify-between hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-gray-900 dark:text-white font-medium text-sm block">
                    About PayouCard
                  </span>
                </div>
                <span className="text-gray-400 text-xs mr-2">v2.0.21</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Admin Panel - Only show for admin users */}
        {user && user.role === "admin" && (
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border-purple-300/50 dark:border-purple-600/50 shadow-lg mb-3 rounded-xl overflow-hidden">
            <CardContent className="p-0">
              <button 
                onClick={() => navigateTo("/admin-panel")}
                className="w-full p-3 flex items-center justify-between hover:bg-purple-50/70 dark:hover:bg-purple-900/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg p-1.5 bg-gradient-to-r from-purple-600 to-pink-600">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-purple-700 dark:text-purple-300 font-semibold text-sm block">
                      Admin Panel
                    </span>
                    <span className="text-purple-600/70 dark:text-purple-400/70 text-xs">
                      Manage platform settings
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-purple-500" />
              </button>
            </CardContent>
          </Card>
        )}

        {/* Logout */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 dark:border-purple-700/30 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={handleLogout}
              className="w-full p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-red-600 dark:text-red-400 font-medium text-sm">
                  Log out
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}