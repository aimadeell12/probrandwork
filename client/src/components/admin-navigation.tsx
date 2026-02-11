import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Users, 
  Shield, 
  FileText, 
  BarChart3, 
  Settings, 
  Home,
  ChevronRight,
  Crown,
  Building2,
  Gift,
  Ticket,
  DollarSign,
  MessageSquare,
  Plus,
  MessageCircle,
  Wifi
} from "lucide-react";

export default function AdminNavigation() {
  const [location] = useLocation();

  const adminPages = [
    {
      title: "KYC Management",
      description: "Review and manage identity verification requests",
      href: "/kyc-management",
      icon: Shield,
      color: "bg-blue-500",
      isActive: location === "/kyc-management"
    },
    {
      title: "User Management", 
      description: "Manage user accounts and permissions",
      href: "/admin/users",
      icon: Users,
      color: "bg-primary",
      isActive: location === "/admin/users"
    },
    {
      title: "System Reports",
      description: "View analytics and system reports", 
      href: "/admin/reports",
      icon: BarChart3,
      color: "bg-primary",
      isActive: location === "/admin/reports"
    },
    {
      title: "Bank Transfer Management",
      description: "Monitor and manage all bank transfers",
      href: "/admin/bank-transfers",
      icon: Building2,
      color: "bg-indigo-500",
      isActive: location === "/admin/bank-transfers"
    },
    {
      title: "Deposit Requests",
      description: "Review and approve deposit requests",
      href: "/admin/deposit-requests",
      icon: Plus,
      color: "bg-emerald-500",
      isActive: location === "/admin/deposit-requests"
    },
    {
      title: "Referral Management",
      description: "Manage referral programs and rewards",
      href: "/admin/referrals",
      icon: Gift,
      color: "bg-pink-500",
      isActive: location === "/admin/referrals"
    },
    {
      title: "Voucher Management", 
      description: "Create and manage discount vouchers",
      href: "/admin/vouchers",
      icon: Ticket,
      color: "bg-yellow-500",
      isActive: location === "/admin/vouchers"
    },
    {
      title: "Currency Management",
      description: "Manage exchange rates and conversions",
      href: "/admin/currency",
      icon: DollarSign,
      color: "bg-primary",
      isActive: location === "/admin/currency"
    },
    {
      title: "Community Management",
      description: "Moderate discussions and events",
      href: "/admin/community",
      icon: MessageSquare,
      color: "bg-blue-500",
      isActive: location === "/admin/community"
    },
    {
      title: "WhatsApp Settings",
      description: "Configure WhatsApp API and OTP templates",
      href: "/admin-panel/whatsapp",
      icon: MessageCircle,
      color: "bg-primary",
      isActive: location === "/admin-panel/whatsapp"
    },
    {
      title: "Admin Settings",
      description: "Configure system settings and preferences",
      href: "/admin/settings", 
      icon: Settings,
      color: "bg-orange-500",
      isActive: location === "/admin/settings"
    },
    {
      title: "Cardholder Test",
      description: "Test Airwallex cardholder creation functionality",
      href: "/admin/cardholder-test",
      icon: Shield,
      color: "bg-primary",
      isActive: location === "/admin/cardholder-test"
    },
    {
      title: "Airwallex API Test",
      description: "Test Airwallex API connection and endpoints",
      href: "/admin/airwallex-test",
      icon: Wifi,
      color: "bg-blue-500",
      isActive: location === "/admin/airwallex-test"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f23] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gradient-to-br from-red-200/15 to-pink-200/15 dark:from-red-500/10 dark:to-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-gradient-to-tr from-blue-200/10 to-red-200/10 dark:from-blue-500/10 dark:to-red-500/10 rounded-full blur-3xl"></div>
      
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 max-w-6xl mx-auto relative z-10">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" />
        </div>
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Administrative dashboard and management tools
              </p>
            </div>
          </div>
          
          <Badge className="bg-yellow-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-yellow-200 dark:border-red-700 px-4 py-2">
            Administrator Access
          </Badge>
        </div>

        {/* Quick Return to Dashboard */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:border-yellow-200 dark:hover:border-red-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center">
                      <Home className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Return to Dashboard
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Go back to main user dashboard
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Admin Pages Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Administrative Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {adminPages.map((page, index) => {
            const IconComponent = page.icon;
            
            return (
              <Link key={index} href={page.href}>
                <Card className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer ${
                  page.isActive 
                    ? 'border-red-300 dark:border-red-600 bg-yellow-50/50 dark:bg-red-900/20' 
                    : 'hover:border-yellow-200 dark:hover:border-red-700'
                } transform hover:scale-[1.02] h-full`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className={`w-12 h-12 ${page.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {page.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{page.description}</p>
                      </div>
                      {page.isActive && (
                        <Badge className="bg-yellow-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Link href="/kyc-management">
              <Button className="w-full justify-start bg-gradient-to-r from-red-500 to-pink-500 hover:from-primary hover:to-pink-600 text-white p-4 h-auto shadow-lg hover:shadow-xl transition-all duration-200">
                <Shield className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Review KYC Requests</div>
                  <div className="text-sm opacity-90">Manage pending verifications</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start p-4 h-auto border-2 border-yellow-200 dark:border-red-700 hover:border-red-300 dark:hover:border-red-600 hover:bg-yellow-50/50 dark:hover:bg-red-900/20 shadow-lg hover:shadow-xl transition-all duration-200">
                <Users className="h-5 w-5 mr-3 text-primary dark:text-red-400" />
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white">Manage Users</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">User administration</div>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}