
import { useState } from "react";
import { ArrowLeft, Copy, ExternalLink, CreditCard, Building2, Zap } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

interface DepositOption {
  id: string;
  title: string;
  description: string;
  fee: string;
  processingTime: string;
  icon: any;
  available: boolean;
  minAmount?: string;
  maxAmount?: string;
}

export default function DepositOptions() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  
  // Get currency from localStorage
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const stored = localStorage.getItem("selectedCurrency");
    if (stored) {
      const currency = JSON.parse(stored);
      return currency;
    }
    return { symbol: "USDT", name: "Tether USD", icon: "💎", color: "bg-teal-500" };
  });

  const depositOptions: DepositOption[] = [
    {
      id: "bank_transfer",
      title: "Bank Transfer",
      description: "Transfer from your bank account",
      fee: "Free",
      processingTime: "1-3 business days",
      icon: Building2,
      available: true,
      minAmount: "$10",
      maxAmount: "$50,000"
    },
    {
      id: "debit_card",
      title: "Debit Card",
      description: "Instant deposit with your debit card",
      fee: "2.9%",
      processingTime: "Instant",
      icon: CreditCard,
      available: true,
      minAmount: "$1",
      maxAmount: "$2,500"
    },
    {
      id: "crypto_network",
      title: "Crypto Network",
      description: "Deposit from external wallet",
      fee: "Network fees apply",
      processingTime: "10-30 minutes",
      icon: Zap,
      available: true,
      minAmount: "0.1 USDT",
      maxAmount: "Unlimited"
    }
  ];

  const handleOptionSelect = (option: DepositOption) => {
    console.log("Selected deposit option:", option);
    // Navigate to specific deposit flow based on option
    if (option.id === "crypto_network") {
      setLocation("/deposit/crypto");
    } else if (option.id === "bank_transfer") {
      setLocation("/deposit/bank");
    } else if (option.id === "debit_card") {
      setLocation("/deposit/card");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background text-black dark:text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/deposit")}
          className="p-2"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <div className="text-center">
          <h1 className="text-xl font-semibold">Deposit {selectedCurrency.symbol}</h1>
          <p className="text-sm text-gray-500 dark:text-muted-foreground">Choose deposit method</p>
        </div>
        
        <ThemeToggle className="text-black dark:text-foreground" />
      </div>

      {/* Currency Info */}
      <div className="p-4 border-b border-gray-200 dark:border-border">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${selectedCurrency.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
            {selectedCurrency.icon}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{selectedCurrency.symbol}</h2>
            <p className="text-gray-500 dark:text-muted-foreground text-sm">{selectedCurrency.name}</p>
          </div>
          <div className="ml-auto">
            <Badge variant="secondary" className="bg-green-600 text-white">
              Available
            </Badge>
          </div>
        </div>
      </div>

      {/* Deposit Options */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold mb-4">Available Deposit Methods</h3>
        
        {depositOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card 
              key={option.id}
              className={`border-gray-200 dark:border-border transition-colors cursor-pointer ${
                option.available 
                  ? 'bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted' 
                  : 'bg-gray-100 dark:bg-muted opacity-50 cursor-not-allowed'
              }`}
              onClick={() => option.available && handleOptionSelect(option)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-black dark:text-white">{option.title}</h4>
                      <div className="text-right">
                        <p className="text-green-600 dark:text-green-400 text-sm font-semibold">{option.fee}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-500 dark:text-muted-foreground text-sm mb-2">{option.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-muted-foreground">
                      <span>⏱️ {option.processingTime}</span>
                      <span>{option.minAmount} - {option.maxAmount}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 text-gray-400 dark:text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Info */}
      <div className="p-4 mt-6">
        <div className="bg-gray-50 dark:bg-card rounded-lg p-4 border border-gray-200 dark:border-border">
          <h3 className="font-semibold mb-2 flex items-center text-black dark:text-white">
            🔒 Security Information
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-muted-foreground">
            <p>• All deposits are secured with bank-level encryption</p>
            <p>• Your funds are protected by insurance coverage</p>
            <p>• We never store your banking credentials</p>
            <p>• 24/7 monitoring for suspicious activity</p>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="p-4">
        <div className="text-center">
          <p className="text-gray-500 dark:text-muted-foreground text-sm mb-2">Need help with deposits?</p>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
