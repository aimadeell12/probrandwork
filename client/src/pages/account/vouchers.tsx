import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Ticket, CheckCircle, Clock, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Vouchers() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [voucherCode, setVoucherCode] = useState("");
  const queryClient = useQueryClient();

  // Get user's vouchers
  const { data: userVouchers = [], isLoading } = useQuery({
    queryKey: ['/api/vouchers/my-vouchers'],
    queryFn: () => apiRequest('GET', '/api/vouchers/my-vouchers').then(res => res.json())
  });

  // Get available vouchers
  const { data: availableVouchers = [] } = useQuery({
    queryKey: ['/api/vouchers/available'],
    queryFn: () => apiRequest('GET', '/api/vouchers/available').then(res => res.json())
  });

  // Redeem voucher mutation
  const redeemMutation = useMutation({
    mutationFn: (code: string) => 
      apiRequest('POST', '/api/vouchers/redeem', { voucherCode: code }).then(res => res.json()),
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: `Voucher redeemed! You received $${data.amount}`
      });
      setVoucherCode("");
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/vouchers/my-vouchers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/vouchers/available'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to redeem voucher",
        variant: "destructive"
      });
    }
  });

  const redeemVoucher = () => {
    if (!voucherCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a voucher code",
        variant: "destructive"
      });
      return;
    }

    redeemMutation.mutate(voucherCode);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case "used":
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case "expired":
        return <XCircle className="h-5 w-5 text-primary" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-primary bg-yellow-50 dark:bg-green-900/20";
      case "used":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
      case "expired":
        return "text-primary bg-yellow-50 dark:bg-red-900/20";
      default:
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-gray-900 dark:via-red-900 dark:to-red-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-red-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/services")}
            className="p-2 hover:bg-yellow-100 dark:hover:bg-red-900/30"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            My Vouchers
          </h1>
        </div>

        {/* Redeem New Voucher */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Plus className="h-5 w-5" />
              Redeem Voucher
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter voucher code"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button 
                onClick={redeemVoucher}
                className="bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-red-800"
              >
                Redeem
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vouchers List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : userVouchers.length === 0 ? (
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
              <CardContent className="p-8 text-center">
                <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No vouchers found</p>
              </CardContent>
            </Card>
          ) : (
            userVouchers.map((voucher: any) => (
              <Card key={voucher.id} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-100 dark:bg-red-900/30 rounded-lg">
                        <Ticket className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {voucher.title}
                          </h3>
                          {getStatusIcon(voucher.status)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {voucher.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Code: {voucher.code}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Expires: {new Date(voucher.expiresAt).toLocaleDateString()}
                        </p>
                        {voucher.usedAt && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Used: {new Date(voucher.usedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        ${voucher.amount}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(voucher.status)}`}>
                        {voucher.status.charAt(0).toUpperCase() + voucher.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Available Vouchers */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 mt-6">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Available Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableVouchers.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400 py-4">
                  No available vouchers at the moment
                </p>
              ) : (
                availableVouchers.map((voucher: any) => (
                  <div key={voucher.id} className="p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border border-yellow-200/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{voucher.code}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{voucher.description}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setVoucherCode(voucher.code)}
                        disabled={redeemMutation.isPending}
                      >
                        Apply
                      </Button>
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