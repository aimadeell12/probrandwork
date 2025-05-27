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
  Plus
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
      title: "Admin Settings",
      description: "Configure system settings and preferences",
      href: "/admin/settings", 
      icon: Settings,
      color: "bg-orange-500",
      isActive: location === "/admin/settings"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-purple-900">
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Administrative dashboard and management tools
              </p>
            </div>
          </div>
          
          <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            Administrator Access
          </Badge>
        </div>

        {/* Quick Return to Dashboard */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Home className="h-5 w-5 text-gray-600 dark:text-gray-400" />
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
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Admin Pages Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Administrative Tools
          </h2>
          
          {adminPages.map((page, index) => {
            const IconComponent = page.icon;
            
            return (
              <Link key={index} href={page.href}>
                <Card className={`hover:shadow-md transition-all duration-200 cursor-pointer border-2 ${
                  page.isActive 
                    ? 'border-purple-300 dark:border-purple-600 bg-purple-50/50 dark:bg-purple-900/20' 
                    : 'border-transparent hover:border-purple-200 dark:hover:border-purple-700'
                } transform hover:scale-[1.02]`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${page.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {page.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {page.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {page.isActive && (
                          <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            Active
                          </Badge>
                        )}
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/kyc-management">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white p-4 h-auto">
                <Shield className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Review KYC Requests</div>
                  <div className="text-sm opacity-90">Manage pending verifications</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start p-4 h-auto border-2">
                <Users className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Manage Users</div>
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