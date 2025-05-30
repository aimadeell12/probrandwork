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
      <div className="container mx-auto px-4 py-6 relative z-10 max-w-md">
        
        {/* User Profile Card */}
        <Card className="bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 text-white mb-6 shadow-xl border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white/90 text-lg font-medium mb-1">Hello!</p>
                <p className="text-white text-xl font-semibold">
                  {formatPhoneNumber(user?.phone || "")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        {/* Settings Group */}
        <Card className="bg-gray-800 border-gray-700 shadow-lg mb-4 rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={() => navigateTo("/account/language")} 
              className="w-full p-5 flex items-center justify-between hover:bg-gray-700/50 transition-colors border-b border-gray-700 last:border-b-0"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-xl p-2">
                  <Globe className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-white font-medium">
                  Language
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/account/payment-password")} 
              className="w-full p-5 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-xl p-2">
                  <Settings className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-white font-medium">
                  Setting Payment Password
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* Support Group */}
        <Card className="bg-gray-800 border-gray-700 shadow-lg mb-4 rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={() => navigateTo("/customer-service")} 
              className="w-full p-5 flex items-center justify-between hover:bg-gray-700/50 transition-colors border-b border-gray-700"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-xl p-2">
                  <Phone className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-white font-medium">
                  Customer Service
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/security-privacy")} 
              className="w-full p-5 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-xl p-2">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-white font-medium">
                  Security Settings
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* Cards & Services Group */}
        <Card className="bg-gray-800 border-gray-700 shadow-lg mb-4 rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={() => navigateTo("/card-purchase-record")} 
              className="w-full p-5 flex items-center justify-between hover:bg-gray-700/50 transition-colors border-b border-gray-700"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-xl p-2">
                  <CreditCard className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-white font-medium">
                  Card Purchase Record
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/coupons")} 
              className="w-full p-5 flex items-center justify-between hover:bg-gray-700/50 transition-colors border-b border-gray-700"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-xl p-2">
                  <Gift className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-white font-medium">
                  Coupons
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/about")} 
              className="w-full p-5 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-xl p-2">
                  <HelpCircle className="h-6 w-6 text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-white font-medium block">
                    About PayouCard
                  </span>
                </div>
                <span className="text-gray-400 text-sm mr-2">v2.0.21</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="bg-gray-800 border-gray-700 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={handleLogout}
              className="w-full p-5 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-xl p-2">
                  <LogOut className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-white font-medium">
                  Log out
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}