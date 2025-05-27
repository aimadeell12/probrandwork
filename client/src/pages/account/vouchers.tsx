import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Ticket, CheckCircle, Clock, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Vouchers() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [voucherCode, setVoucherCode] = useState("");

  const vouchers = [
    {
      id: 1,
      code: "WELCOME50",
      title: "$50 Welcome Bonus",
      description: "First-time user bonus",
      amount: 50,
      status: "used",
      expiresAt: "2024-12-31",
      usedAt: "2024-01-15"
    },
    {
      id: 2,
      code: "CASHBACK25",
      title: "$25 Cashback",
      description: "Monthly cashback reward",
      amount: 25,
      status: "active",
      expiresAt: "2024-12-31"
    },
    {
      id: 3,
      code: "FRIEND10",
      title: "$10 Friend Bonus",
      description: "Referral bonus",
      amount: 10,
      status: "expired",
      expiresAt: "2024-02-28"
    }
  ];

  const redeemVoucher = () => {
    if (!voucherCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a voucher code",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success!",
      description: `Voucher ${voucherCode} redeemed successfully!`
    });
    setVoucherCode("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "used":
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case "expired":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case "used":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
      case "expired":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-purple-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/services")}
            className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30"
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
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                Redeem
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vouchers List */}
        <div className="space-y-4">
          {vouchers.map((voucher) => (
            <Card key={voucher.id} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Ticket className="h-6 w-6 text-purple-600" />
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
          ))}
        </div>

        {/* Available Vouchers */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 mt-6">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Available Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200/30">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">SAVE20</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">$20 off next transaction</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setVoucherCode("SAVE20")}
                  >
                    Apply
                  </Button>
                </div>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200/30">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">BONUS15</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">$15 account credit</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setVoucherCode("BONUS15")}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}