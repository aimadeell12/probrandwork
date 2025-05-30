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
  Phone
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
    <div className="min-h-screen bg-gray-900 relative overflow-hidden pb-20">
      
      {/* Header */}
      <div className="bg-gray-900 p-4 relative z-10">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-medium text-white">
            My
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 py-4 relative z-10 max-w-sm">
        
        {/* User Profile Card */}
        <Card className="bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 text-white mb-4 shadow-lg border-0 rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white/90 text-sm font-medium mb-1">Hello!</p>
                <p className="text-white text-lg font-semibold">
                  {formatPhoneNumber(user?.phone || "")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        {/* Settings Group */}
        <Card className="bg-gray-800 border-gray-700 shadow-lg mb-3 rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={() => navigateTo("/account/language")} 
              className="w-full p-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors border-b border-gray-700 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Globe className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-white font-medium text-sm">
                  Language
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/account/payment-password")} 
              className="w-full p-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Settings className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-white font-medium text-sm">
                  Setting Payment Password
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* Support Group */}
        <Card className="bg-gray-800 border-gray-700 shadow-lg mb-3 rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={() => navigateTo("/customer-service")} 
              className="w-full p-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors border-b border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Phone className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-white font-medium text-sm">
                  Customer Service
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/security-privacy")} 
              className="w-full p-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-white font-medium text-sm">
                  Security Settings
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* Cards & Services Group */}
        <Card className="bg-gray-800 border-gray-700 shadow-lg mb-3 rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={() => navigateTo("/card-purchase-record")} 
              className="w-full p-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors border-b border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <CreditCard className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-white font-medium text-sm">
                  Card Purchase Record
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/coupons")} 
              className="w-full p-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors border-b border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Gift className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-white font-medium text-sm">
                  Coupons
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/about")} 
              className="w-full p-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <HelpCircle className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-white font-medium text-sm block">
                    About PayouCard
                  </span>
                </div>
                <span className="text-gray-400 text-xs mr-2">v2.0.21</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="bg-gray-800 border-gray-700 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={handleLogout}
              className="w-full p-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <LogOut className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-white font-medium text-sm">
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