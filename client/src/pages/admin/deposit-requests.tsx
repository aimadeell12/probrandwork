import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  DollarSign, 
  Search, 
  Check,
  X,
  Filter,
  Calendar,
  User,
  CreditCard,
  ArrowLeft,
  MoreVertical
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

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
  adminNotes?: string;
}

export default function DepositRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<DepositRequest | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch deposit requests data
  const { data: requestsData, isLoading } = useQuery({
    queryKey: ["/api/admin/deposit-requests"],
  });

  const requests = requestsData || [];
  
  const filteredRequests = requests.filter((request: DepositRequest) => {
    const matchesSearch = request.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.amount.toString().includes(searchTerm);
    
    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && request.status === filterStatus;
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (requestId: string) => 
      apiRequest("POST", `/api/admin/deposit-requests/${requestId}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/deposit-requests"] });
      toast({
        title: "Request Approved",
        description: "Deposit request has been approved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve request",
        variant: "destructive",
      });
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ requestId, notes }: { requestId: string; notes: string }) => 
      apiRequest("POST", `/api/admin/deposit-requests/${requestId}/reject`, { notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/deposit-requests"] });
      setSelectedRequest(null);
      setRejectNotes("");
      toast({
        title: "Request Rejected",
        description: "Deposit request has been rejected.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject request",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (requestId: string) => {
    approveMutation.mutate(requestId);
  };

  const handleReject = (request: DepositRequest) => {
    setSelectedRequest(request);
  };

  const confirmReject = () => {
    if (selectedRequest) {
      rejectMutation.mutate({ 
        requestId: selectedRequest.id, 
        notes: rejectNotes 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'approved': return 'bg-yellow-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-yellow-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'bank': return <DollarSign className="h-4 w-4" />;
      case 'crypto': return <DollarSign className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  // Statistics
  const stats = {
    total: requests.length,
    pending: requests.filter((r: DepositRequest) => r.status === "pending").length,
    approved: requests.filter((r: DepositRequest) => r.status === "approved").length,
    rejected: requests.filter((r: DepositRequest) => r.status === "rejected").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-gray-900 dark:via-red-900 dark:to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading deposit requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-gray-900 dark:via-red-900 dark:to-red-900">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin-panel">
              <Button variant="ghost" size="sm" className="text-primary hover:text-red-700 dark:text-red-400">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <DollarSign className="h-8 w-8 text-primary mr-3" />
                Deposit Requests
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Review and manage deposit requests from users
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-yellow-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
                  <p className="text-2xl font-bold text-primary dark:text-red-400">{stats.total}</p>
                </div>
                <DollarSign className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-yellow-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-primary dark:text-green-400">{stats.approved}</p>
                </div>
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-yellow-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-primary dark:text-red-400">{stats.rejected}</p>
                </div>
                <X className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-yellow-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by user name, email, or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-900"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-yellow-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Deposit Requests ({filteredRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No deposit requests found</p>
              </div>
            ) : (
              <div className="space-y-0">
                {filteredRequests.map((request: DepositRequest) => (
                  <div key={request.id} className="border-b dark:border-gray-700 last:border-b-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-yellow-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                            {getMethodIcon(request.method)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {request.userName}
                            </p>
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {request.userEmail}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              ${request.amount}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                              via {request.method}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {request.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(request)}
                            className="text-primary border-red-300 hover:bg-yellow-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                            disabled={rejectMutation.isPending}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            className="bg-primary hover:bg-green-700 text-white"
                            disabled={approveMutation.isPending}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reject Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white dark:bg-gray-800 w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Reject Deposit Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to reject the deposit request of ${selectedRequest.amount} from {selectedRequest.userName}?
                </p>
                <Textarea
                  placeholder="Add rejection notes (optional)..."
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRequest(null);
                      setRejectNotes("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmReject}
                    disabled={rejectMutation.isPending}
                    className="bg-primary hover:bg-red-700 text-white"
                  >
                    {rejectMutation.isPending ? "Rejecting..." : "Reject Request"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}