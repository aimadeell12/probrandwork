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

  // Fetch users data
  const { data: usersData } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const totalKyc = kycStats?.length || 0;
  const pendingKyc = kycStats?.filter((k: any) => k.status === 'pending').length || 0;
  const approvedKyc = kycStats?.filter((k: any) => k.status === 'approved').length || 0;
  const rejectedKyc = kycStats?.filter((k: any) => k.status === 'rejected').length || 0;
  
  const totalUsers = usersData?.length || 0;
  const adminUsers = usersData?.filter((u: any) => u.role === 'admin').length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-gray-900 dark:via-red-900 dark:to-red-900">
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link href="/admin-panel">
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-violet-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                System Reports
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analytics and insights
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto sm:ml-auto">
            <Button className="bg-primary hover:bg-red-700 text-white w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">KYC Approved</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{approvedKyc}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{pendingKyc}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-primary dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Rejected</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{rejectedKyc}</p>
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
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Users</span>
                  <Badge variant="secondary">{totalUsers}</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Admin Users</span>
                  <Badge variant="secondary">{adminUsers}</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total KYC</span>
                  <Badge variant="secondary">{totalKyc}</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Approval Rate</span>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    {totalKyc > 0 ? Math.round((approvedKyc / totalKyc) * 100) : 0}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">System Status</span>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Online</Badge>
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
            <div className="space-y-3">
              {kycStats && kycStats.length > 0 ? (
                kycStats.slice(0, 3).map((kyc: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      kyc.status === 'approved' 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : kyc.status === 'pending'
                        ? 'bg-orange-100 dark:bg-orange-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      <Shield className={`h-4 w-4 ${
                        kyc.status === 'approved' 
                          ? 'text-green-600 dark:text-green-400' 
                          : kyc.status === 'pending'
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-primary dark:text-red-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        KYC {kyc.status === 'approved' ? 'Approved' : kyc.status === 'pending' ? 'Submitted' : 'Rejected'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {kyc.firstName} {kyc.lastName}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {kyc.submittedAt ? new Date(kyc.submittedAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">No recent activity</p>
                </div>
              )}

              {usersData && usersData.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Latest User</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {usersData[0]?.firstName} {usersData[0]?.lastName}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {usersData[0]?.createdAt ? new Date(usersData[0].createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}