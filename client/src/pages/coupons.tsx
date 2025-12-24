import { useState } from "react";
import { ArrowLeft, Gift, Percent, Calendar, Copy, Check } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Coupons() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const coupons = [
    {
      id: 1,
      code: "WELCOME50",
      title: "Welcome Bonus",
      description: "50% off your first transaction",
      discount: "50%",
      expiryDate: "2024-12-31",
      type: "percentage",
      minAmount: 100,
      isActive: true
    },
    {
      id: 2,
      code: "CASHBACK20",
      title: "Cashback Offer",
      description: "$20 cashback on transactions over $200",
      discount: "$20",
      expiryDate: "2024-11-30",
      type: "cashback",
      minAmount: 200,
      isActive: true
    },
    {
      id: 3,
      code: "FRIEND25",
      title: "Refer a Friend",
      description: "25% bonus when you refer friends",
      discount: "25%",
      expiryDate: "2024-10-15",
      type: "percentage",
      minAmount: 50,
      isActive: false
    }
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Code Copied!",
      description: `Coupon code "${code}" copied to clipboard`,
    });
    
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-red-900 dark:to-blue-900 relative overflow-hidden pb-20">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-red-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-red-200/30 dark:border-red-700/30 p-4 relative z-10">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/account")}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Coupons & Offers
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 relative z-10 max-w-md space-y-4">
        
        {/* Active Coupons */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Available Offers
          </h2>
          
          {coupons.filter(coupon => coupon.isActive && !isExpired(coupon.expiryDate)).map((coupon) => (
            <Card key={coupon.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-red-200/30 dark:border-red-700/30 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Coupon Header */}
                  <div className="bg-gradient-to-r from-red-600 to-pink-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-full p-2 bg-white/20">
                          <Gift className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{coupon.title}</h3>
                          <p className="text-xs text-white/90">{coupon.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{coupon.discount}</div>
                        <div className="text-xs">OFF</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Coupon Details */}
                  <div className="p-4 space-y-3">
                    {/* Coupon Code */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-red-300 dark:border-red-600">
                      <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                        {coupon.code}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyCode(coupon.code)}
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        {copiedCode === coupon.code ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Details */}
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Percent className="h-3 w-3" />
                        <span>Min: ${coupon.minAmount}</span>
                      </div>
                    </div>
                    
                    {/* Apply Button */}
                    <Button
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white text-sm"
                      onClick={() => {
                        toast({
                          title: "Coupon Applied!",
                          description: `${coupon.code} will be applied to your next eligible transaction`,
                        });
                      }}
                    >
                      Apply Coupon
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Expired/Inactive Coupons */}
        {coupons.filter(coupon => !coupon.isActive || isExpired(coupon.expiryDate)).length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Expired Offers
            </h2>
            
            {coupons.filter(coupon => !coupon.isActive || isExpired(coupon.expiryDate)).map((coupon) => (
              <Card key={coupon.id} className="bg-gray-100/80 dark:bg-gray-800/50 backdrop-blur-sm border-gray-300/30 dark:border-gray-600/30 shadow-lg opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full p-2 bg-gray-300 dark:bg-gray-600">
                        <Gift className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">{coupon.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {isExpired(coupon.expiryDate) ? 'Expired' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                      {coupon.discount}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* How to Use */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-red-200/30 dark:border-red-700/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white text-base">
              How to Use Coupons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-red-600">1.</span>
              <span>Copy the coupon code by tapping the copy button</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-red-600">2.</span>
              <span>Apply the coupon during checkout or transaction</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-red-600">3.</span>
              <span>Enjoy your discount on eligible transactions</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}