import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Building } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import binanceIcon from "@assets/pngwing.com.png";

export default function Deposit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState("card");

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-6 pb-20">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="p-2 hover:bg-purple-100 text-gray-700"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">
            Deposit Money
          </h1>
        </div>

        {/* Payment Method Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Payment Method
          </h2>
          
          <div className="space-y-3">
            {/* Credit Card Option */}
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedMethod === "card" 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => {
                setSelectedMethod("card");
                toast({
                  title: "Credit Card",
                  description: "Credit card payment will be available soon",
                });
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Credit Card</p>
                  <p className="text-sm text-gray-600">Visa, Mastercard</p>
                </div>
              </div>
            </div>

            {/* Bank Transfer Option */}
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedMethod === "bank" 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => setLocation("/bank-transfer")}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Building className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Bank Transfer</p>
                  <p className="text-sm text-gray-600">ACH, Wire Transfer</p>
                </div>
              </div>
            </div>

            {/* Binance Pay Option */}
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedMethod === "binance" 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => setLocation("/binance-pay")}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <img 
                    src={binanceIcon} 
                    alt="Binance" 
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Binance Pay</p>
                  <p className="text-sm text-gray-600">Crypto payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}