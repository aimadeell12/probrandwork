import { useState } from "react";
import { ArrowLeft, Copy } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

interface Currency {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  usdValue: number;
  icon: string;
  color: string;
}

export default function Deposit() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const currencies: Currency[] = [
    {
      id: "usdt",
      name: "USDT",
      symbol: "USDT",
      balance: 0.00,
      usdValue: 0.00,
      icon: "💎",
      color: "bg-teal-500"
    },
    {
      id: "usdc",
      name: "USDC",
      symbol: "USDC", 
      balance: 0.00,
      usdValue: 0.00,
      icon: "$",
      color: "bg-blue-500"
    },
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      balance: 0.00,
      usdValue: 0.00,
      icon: "₿",
      color: "bg-orange-500"
    },
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      balance: 0.00,
      usdValue: 0.00,
      icon: "Ξ",
      color: "bg-purple-500"
    },
    {
      id: "usd",
      name: "USD",
      symbol: "USD",
      balance: 0.00,
      usdValue: 0.00,
      icon: "$",
      color: "bg-green-500"
    }
  ];

  const handleCurrencySelect = (currency: Currency) => {
    // Navigate to deposit amount page or show deposit options
    console.log("Selected currency:", currency);
    // You can implement the next step here
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/")}
          className="text-white p-2"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <h1 className="text-xl font-semibold">{t("selectCurrency")}</h1>
        
        <Button variant="ghost" size="sm" className="text-white p-2">
          <Copy className="h-6 w-6" />
        </Button>
      </div>

      {/* Currency List */}
      <div className="p-4 space-y-3">
        {currencies.map((currency) => (
          <Card 
            key={currency.id}
            className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer"
            onClick={() => handleCurrencySelect(currency)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${currency.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {currency.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{currency.symbol}</h3>
                    <p className="text-gray-400 text-sm">{currency.name}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-semibold text-lg">{currency.balance.toFixed(2)}</p>
                  <p className="text-gray-400 text-sm">≈${currency.usdValue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <div className="p-4 mt-8">
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h3 className="text-white font-semibold mb-2">{t("depositInformation")}</h3>
          <p className="text-gray-400 text-sm mb-2">
            {t("selectCurrencyToView")}
          </p>
          <p className="text-gray-400 text-sm mb-2">
            {t("minimumDepositApply")}
          </p>
          <p className="text-gray-400 text-sm">
            {t("processingTimesVary")}
          </p>
        </div>
      </div>
    </div>
  );
}