import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Check, 
  X, 
  Search, 
  Filter, 
  Download, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  CreditCard,
  Building,
  Coins
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/useLanguage";
import AdminNavigation from "@/components/admin-navigation";

interface DepositRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export default function DepositRequests() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<DepositRequest | null>(null);

  // Fetch deposit requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ["/api/admin/deposit-requests"],
  });

  // Approve deposit request
  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      return apiRequest(`/api/admin/deposit-requests/${requestId}/approve`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/deposit-requests"] });
      toast({
        title: "طلب موافق عليه",
        description: "تم الموافقة على طلب الإيداع بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الموافقة على الطلب",
        variant: "destructive",
      });
    },
  });

  // Reject deposit request
  const rejectMutation = useMutation({
    mutationFn: async (requestId: string) => {
      return apiRequest(`/api/admin/deposit-requests/${requestId}/reject`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/deposit-requests"] });
      toast({
        title: "طلب مرفوض",
        description: "تم رفض طلب الإيداع",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفض الطلب",
        variant: "destructive",
      });
    },
  });

  const filteredRequests = requests?.filter((request: DepositRequest) => {
    const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "card": return <CreditCard className="w-4 h-4" />;
      case "bank": return <Building className="w-4 h-4" />;
      case "crypto": return <Coins className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case "card": return "بطاقة ائتمانية";
      case "bank": return "تحويل بنكي";
      case "crypto": return "عملة رقمية";
      default: return method;
    }
  };

  const pendingCount = filteredRequests.filter((r: DepositRequest) => r.status === "pending").length;
  const approvedCount = filteredRequests.filter((r: DepositRequest) => r.status === "approved").length;
  const rejectedCount = filteredRequests.filter((r: DepositRequest) => r.status === "rejected").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 relative z-10 max-w-7xl mx-auto">
        
        <AdminNavigation />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            إدارة طلبات الإيداع
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            مراجعة والموافقة على طلبات الإيداع المقدمة من المستخدمين
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8 space-y-6 lg:space-y-0">
          
          {/* Left Column - Stats & Filters */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Statistics Cards */}
            <div className="space-y-4">
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">طلبات معلقة</p>
                      <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">{pendingCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">طلبات موافق عليها</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-200">{approvedCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">طلبات مرفوضة</p>
                      <p className="text-2xl font-bold text-red-900 dark:text-red-200">{rejectedCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="w-5 h-5 text-purple-600" />
                  الفلاتر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    حالة الطلب
                  </label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border border-purple-200 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">جميع الطلبات</option>
                    <option value="pending">معلقة</option>
                    <option value="approved">موافق عليها</option>
                    <option value="rejected">مرفوضة</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Requests List */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="البحث بالاسم أو البريد الإلكتروني أو رقم الطلب..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 dark:bg-gray-700/80 border-purple-200/30 focus:border-purple-500 rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Requests List */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    طلبات الإيداع ({filteredRequests.length})
                  </CardTitle>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    تصدير
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">جاري تحميل الطلبات...</p>
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">لا توجد طلبات إيداع</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRequests.map((request: DepositRequest) => (
                      <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                              {request.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{request.userName}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{request.userEmail}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {getMethodIcon(request.method)}
                                  <span className="mr-1">{getMethodName(request.method)}</span>
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(request.createdAt).toLocaleDateString('ar')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                ${request.amount.toFixed(2)}
                              </p>
                              <Badge className={getStatusColor(request.status)}>
                                {getStatusIcon(request.status)}
                                <span className="mr-1">
                                  {request.status === "pending" ? "معلق" :
                                   request.status === "approved" ? "موافق عليه" : "مرفوض"}
                                </span>
                              </Badge>
                            </div>

                            {request.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => approveMutation.mutate(request.id)}
                                  disabled={approveMutation.isPending}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => rejectMutation.mutate(request.id)}
                                  disabled={rejectMutation.isPending}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}