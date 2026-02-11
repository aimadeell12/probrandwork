import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Ticket, Plus, Search, Calendar, DollarSign } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminVouchers() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newVoucher, setNewVoucher] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minAmount: '',
    maxUsage: '',
    expiryDate: ''
  });

  // Get all vouchers
  const { data: vouchers = [] } = useQuery({
    queryKey: ['/api/admin/vouchers'],
    queryFn: () => apiRequest('GET', '/api/admin/vouchers').then(res => res.json())
  });

  // Get voucher statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/vouchers/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/vouchers/stats').then(res => res.json())
  });

  // Create voucher mutation
  const createVoucherMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest('POST', '/api/admin/vouchers', data).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Voucher created successfully"
      });
      setIsCreateDialogOpen(false);
      setNewVoucher({
        code: '',
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minAmount: '',
        maxUsage: '',
        expiryDate: ''
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vouchers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vouchers/stats'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create voucher",
        variant: "destructive"
      });
    }
  });

  // Update voucher status
  const updateVoucherMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest('PATCH', `/api/admin/vouchers/${id}`, { status }).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Voucher status updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vouchers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vouchers/stats'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update voucher status",
        variant: "destructive"
      });
    }
  });

  const handleCreateVoucher = () => {
    const voucherData = {
      ...newVoucher,
      discountValue: parseFloat(newVoucher.discountValue),
      minAmount: newVoucher.minAmount ? parseFloat(newVoucher.minAmount) : null,
      maxUsage: newVoucher.maxUsage ? parseInt(newVoucher.maxUsage) : null,
      expiryDate: newVoucher.expiryDate ? new Date(newVoucher.expiryDate).toISOString() : null
    };
    createVoucherMutation.mutate(voucherData);
  };

  const filteredVouchers = vouchers.filter((voucher: any) =>
    voucher.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-gray-900 dark:via-red-900 dark:to-red-900 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-300 dark:bg-primary rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 p-4 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/admin")}
              className="shrink-0 hover:bg-white/20 dark:hover:bg-gray-800/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Voucher Management
            </h1>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-red-800">
                <Plus className="h-4 w-4 mr-2" />
                Create Voucher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Voucher</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code">Voucher Code</Label>
                  <Input
                    id="code"
                    value={newVoucher.code}
                    onChange={(e) => setNewVoucher({...newVoucher, code: e.target.value})}
                    placeholder="SAVE20"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newVoucher.title}
                    onChange={(e) => setNewVoucher({...newVoucher, title: e.target.value})}
                    placeholder="Save 20% on your purchase"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newVoucher.description}
                    onChange={(e) => setNewVoucher({...newVoucher, description: e.target.value})}
                    placeholder="Get 20% off on all services"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discountType">Discount Type</Label>
                    <Select value={newVoucher.discountType} onValueChange={(value) => setNewVoucher({...newVoucher, discountType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="discountValue">Discount Value</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      value={newVoucher.discountValue}
                      onChange={(e) => setNewVoucher({...newVoucher, discountValue: e.target.value})}
                      placeholder="20"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minAmount">Min Amount</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      value={newVoucher.minAmount}
                      onChange={(e) => setNewVoucher({...newVoucher, minAmount: e.target.value})}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxUsage">Max Usage</Label>
                    <Input
                      id="maxUsage"
                      type="number"
                      value={newVoucher.maxUsage}
                      onChange={(e) => setNewVoucher({...newVoucher, maxUsage: e.target.value})}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newVoucher.expiryDate}
                    onChange={(e) => setNewVoucher({...newVoucher, expiryDate: e.target.value})}
                  />
                </div>
                <Button 
                  onClick={handleCreateVoucher} 
                  className="w-full"
                  disabled={createVoucherMutation.isPending}
                >
                  Create Voucher
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <Ticket className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.totalVouchers || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Vouchers</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.activeVouchers || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.totalUsed || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Times Used</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">${stats?.totalSavings || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Savings</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vouchers by code or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Vouchers List */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">All Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredVouchers.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No vouchers found
                </div>
              ) : (
                filteredVouchers.map((voucher: any) => (
                  <div key={voucher.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-lg">
                          <Ticket className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {voucher.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Code: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{voucher.code}</span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {voucher.discountType === 'percentage' ? `${voucher.discountValue}% off` : `$${voucher.discountValue} off`}
                            {voucher.minAmount && ` • Min: $${voucher.minAmount}`}
                            {voucher.maxUsage && ` • Max uses: ${voucher.maxUsage}`}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Used: {voucher.usedCount || 0} times
                            {voucher.expiryDate && ` • Expires: ${new Date(voucher.expiryDate).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={
                          voucher.status === 'active' ? 'default' :
                          voucher.status === 'expired' ? 'secondary' : 'destructive'
                        }
                      >
                        {voucher.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateVoucherMutation.mutate({ 
                            id: voucher.id, 
                            status: voucher.status === 'active' ? 'inactive' : 'active'
                          })}
                          disabled={updateVoucherMutation.isPending}
                        >
                          {voucher.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}