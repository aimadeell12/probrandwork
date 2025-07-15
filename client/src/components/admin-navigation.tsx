import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  MessageCircle
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
      color: "bg-green-500",
      isActive: location === "/admin/users"
    },
    {
      title: "System Reports",
      description: "View analytics and system reports", 
      href: "/admin/reports",
      icon: BarChart3,
      color: "bg-purple-500",
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
      color: "bg-green-500",
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
      color: "bg-green-500",
      isActive: location === "/admin-panel/whatsapp"
    },
    {
      title: "Admin Settings",
      description: "Configure system settings and preferences",
      href: "/admin/settings", 
      icon: Settings,
      color: "bg-orange-500",
      isActive: location === "/admin/settings"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Admin Panel
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Administrative dashboard and management tools
              </p>
            </div>
          </div>
          
          <Badge className="bg-purple-100/80 text-purple-700 border-purple-200 px-4 py-2">
            Administrator Access
          </Badge>
        </div>

        {/* Quick Return to Dashboard */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-500/80 to-gray-600/80 rounded-lg flex items-center justify-center">
                      <Home className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Return to Dashboard
                      </h3>
                      <p className="text-sm text-gray-600">
                        Go back to main user dashboard
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Admin Pages Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Administrative Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {adminPages.map((page, index) => {
            const IconComponent = page.icon;
            
            return (
              <Link key={index} href={page.href}>
                <Card className={`bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer ${
                  page.isActive 
                    ? 'border-purple-300 bg-purple-50/50' 
                    : 'hover:border-purple-200'
                } transform hover:scale-[1.02] h-full`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className={`w-12 h-12 ${page.color}/80 rounded-xl flex items-center justify-center shadow-lg`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                          {page.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">{page.description}</p>
                      </div>
                      {page.isActive && (
                        <Badge className="bg-purple-100/80 text-purple-700 text-xs">
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Link href="/kyc-management">
              <Button className="w-full justify-start bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 text-white p-4 h-auto shadow-lg hover:shadow-xl transition-all duration-200">
                <Shield className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Review KYC Requests</div>
                  <div className="text-sm opacity-90">Manage pending verifications</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start p-4 h-auto border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50/50 shadow-lg hover:shadow-xl transition-all duration-200">
                <Users className="h-5 w-5 mr-3 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Manage Users</div>
                  <div className="text-sm text-gray-600">User administration</div>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}