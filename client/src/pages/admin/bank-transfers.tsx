import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Building2, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Banknote,
  ArrowUpDown,
  Eye,
  Edit
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

interface AdminBankTransfer {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: string;
  currency: string;
  recipientName: string | null;
  recipientBank: string | null;
  recipientAccount: string | null;
  senderName: string | null;
  senderBank: string | null;
  senderAccount: string | null;
  reference: string | null;
  description: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  feeAmount: string | null;
  createdAt: string;
  processedAt: string | null;
  userId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
}

export default function AdminBankTransfers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedTransfer, setSelectedTransfer] = useState<AdminBankTransfer | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");

  // Fetch transfers
  const { data: transfers = [], isLoading } = useQuery<AdminBankTransfer[]>({
    queryKey: ['/api/admin/bank-transfers'],
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ transferId, status }: { transferId: string; status: string }) =>
      apiRequest(`/api/admin/bank-transfers/${transferId}/status`, 'PATCH', { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bank-transfers'] });
      setShowStatusDialog(false);
      setSelectedTransfer(null);
      toast({
        title: "تم تحديث الحالة",
        description: "تم تحديث حالة التحويل بنجاح"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث حالة التحويل",
        variant: "destructive"
      });
    }
  });

  // Filter transfers
  const filteredTransfers = transfers.filter((transfer) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      transfer.userFirstName?.toLowerCase().includes(searchLower) ||
      transfer.userLastName?.toLowerCase().includes(searchLower) ||
      transfer.userEmail?.toLowerCase().includes(searchLower) ||
      transfer.recipientName?.toLowerCase().includes(searchLower) ||
      transfer.senderName?.toLowerCase().includes(searchLower) ||
      transfer.reference?.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter;
    const matchesType = typeFilter === "all" || transfer.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <ArrowUpDown className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-yellow-100 text-green-800';
      case 'failed': return 'bg-yellow-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'معلق';
      case 'processing': return 'قيد المعالجة';
      case 'completed': return 'مكتمل';
      case 'failed': return 'فاشل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    return type === 'incoming' ? 'وارد' : 'صادر';
  };

  const handleStatusUpdate = () => {
    if (selectedTransfer && newStatus) {
      updateStatusMutation.mutate({ 
        transferId: selectedTransfer.id, 
        status: newStatus 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة التحويلات المصرفية</h1>
            <p className="text-gray-600">مراقبة وإدارة جميع التحويلات المصرفية</p>
          </div>
        </div>
        <Link href="/admin/reports">
          <Button variant="outline">العودة للتقارير</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث بالاسم، البريد الإلكتروني، أو المرجع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="تصفية بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">معلق</SelectItem>
                <SelectItem value="processing">قيد المعالجة</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="failed">فاشل</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="تصفية بالنوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="incoming">وارد</SelectItem>
                <SelectItem value="outgoing">صادر</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 ml-2" />
              عدد النتائج: {filteredTransfers.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي التحويلات</p>
                <p className="text-2xl font-bold text-gray-900">{transfers.length}</p>
              </div>
              <Banknote className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">معلقة</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {transfers.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مكتملة</p>
                <p className="text-2xl font-bold text-primary">
                  {transfers.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">فاشلة</p>
                <p className="text-2xl font-bold text-primary">
                  {transfers.filter(t => t.status === 'failed').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة التحويلات المصرفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-medium text-gray-600">المستخدم</th>
                  <th className="text-right p-3 font-medium text-gray-600">النوع</th>
                  <th className="text-right p-3 font-medium text-gray-600">المبلغ</th>
                  <th className="text-right p-3 font-medium text-gray-600">التفاصيل</th>
                  <th className="text-right p-3 font-medium text-gray-600">الحالة</th>
                  <th className="text-right p-3 font-medium text-gray-600">التاريخ</th>
                  <th className="text-right p-3 font-medium text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransfers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500">
                      لا توجد تحويلات مطابقة للبحث
                    </td>
                  </tr>
                ) : (
                  filteredTransfers.map((transfer) => (
                    <tr key={transfer.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {transfer.userFirstName} {transfer.userLastName}
                          </p>
                          <p className="text-sm text-gray-600">{transfer.userEmail}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {getTypeText(transfer.type)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {parseFloat(transfer.amount).toFixed(2)} {transfer.currency}
                          </p>
                          {transfer.feeAmount && parseFloat(transfer.feeAmount) > 0 && (
                            <p className="text-sm text-gray-600">
                              رسوم: {parseFloat(transfer.feeAmount).toFixed(2)} {transfer.currency}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="max-w-48">
                          {transfer.type === 'outgoing' ? (
                            <div>
                              <p className="text-sm font-medium">إلى: {transfer.recipientName || 'غير محدد'}</p>
                              <p className="text-xs text-gray-600">{transfer.recipientBank}</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm font-medium">من: {transfer.senderName || 'غير محدد'}</p>
                              <p className="text-xs text-gray-600">{transfer.senderBank}</p>
                            </div>
                          )}
                          {transfer.reference && (
                            <p className="text-xs text-gray-500 mt-1">مرجع: {transfer.reference}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={`${getStatusColor(transfer.status)} flex items-center gap-1`}>
                          {getStatusIcon(transfer.status)}
                          {getStatusText(transfer.status)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="text-sm text-gray-900">
                            {format(new Date(transfer.createdAt), 'yyyy/MM/dd')}
                          </p>
                          <p className="text-xs text-gray-600">
                            {format(new Date(transfer.createdAt), 'HH:mm')}
                          </p>
                          {transfer.processedAt && (
                            <p className="text-xs text-primary">
                              معالج: {format(new Date(transfer.processedAt), 'MM/dd HH:mm')}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedTransfer(transfer);
                              setNewStatus(transfer.status);
                              setShowStatusDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تحديث حالة التحويل</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTransfer && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {selectedTransfer.userFirstName} {selectedTransfer.userLastName}
                </p>
                <p className="text-sm text-gray-600">
                  {parseFloat(selectedTransfer.amount).toFixed(2)} {selectedTransfer.currency}
                </p>
                <p className="text-sm text-gray-600">
                  {getTypeText(selectedTransfer.type)} - {selectedTransfer.reference || 'بدون مرجع'}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحالة الجديدة
              </label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">معلق</SelectItem>
                  <SelectItem value="processing">قيد المعالجة</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="failed">فاشل</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                إلغاء
              </Button>
              <Button 
                onClick={handleStatusUpdate}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? "جاري التحديث..." : "تحديث الحالة"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}