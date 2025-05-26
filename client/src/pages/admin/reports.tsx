import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Shield, 
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowLeft,
  Download,
  Calendar
} from "lucide-react";
import { Link } from "wouter";

export default function SystemReports() {
  // Fetch KYC stats
  const { data: kycStats } = useQuery({
    queryKey: ["/api/admin/kyc"],
  });

  const totalKyc = kycStats?.length || 0;
  const pendingKyc = kycStats?.filter((k: any) => k.status === 'pending').length || 0;
  const approvedKyc = kycStats?.filter((k: any) => k.status === 'approved').length || 0;
  const rejectedKyc = kycStats?.filter((k: any) => k.status === 'rejected').length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-purple-900">
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin-panel">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                System Reports
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Analytics and system performance insights
              </p>
            </div>
          </div>

          <div className="ml-auto">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+12%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">KYC Approved</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedKyc}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+8%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingKyc}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">-3%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Cards</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">892</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+15%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KYC Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                KYC Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900 dark:text-white">Approved</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedKyc}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {totalKyc > 0 ? Math.round((approvedKyc / totalKyc) * 100) : 0}% of total
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium text-gray-900 dark:text-white">Pending</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingKyc}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {totalKyc > 0 ? Math.round((pendingKyc / totalKyc) * 100) : 0}% of total
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-gray-900 dark:text-white">Rejected</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{rejectedKyc}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {totalKyc > 0 ? Math.round((rejectedKyc / totalKyc) * 100) : 0}% of total
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">New Users Today</span>
                  <Badge variant="secondary">+23</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">KYC Submissions</span>
                  <Badge variant="secondary">+{pendingKyc}</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cards Issued</span>
                  <Badge variant="secondary">+12</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</span>
                  <Badge variant="secondary">187</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">System Uptime</span>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">99.9%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent System Activity
              </CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">KYC Verification Approved</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">User John Doe's identity verification was approved</p>
                </div>
                <span className="text-sm text-gray-500">2 minutes ago</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">New User Registration</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sarah Smith registered a new account</p>
                </div>
                <span className="text-sm text-gray-500">15 minutes ago</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Virtual Card Issued</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Virtual card issued to verified user</p>
                </div>
                <span className="text-sm text-gray-500">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}