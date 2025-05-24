import { useState } from "react";
import { ArrowLeft } from "lucide-react";
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
    // Store selected currency in localStorage and navigate to options
    localStorage.setItem("selectedCurrency", JSON.stringify(currency));
    setLocation("/deposit/options");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/")}
          className="p-2"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <h1 className="text-xl font-semibold text-foreground">{t("selectCurrency")}</h1>

        <div className="w-10"></div> {/* فراغ للحفاظ على التوازن */}
      </div>

      {/* Currency List */}
      <div className="p-4 space-y-3">
        {currencies.map((currency) => (
          <Card 
            key={currency.id}
            className="bg-card border-border hover:bg-accent transition-colors cursor-pointer"
            onClick={() => handleCurrencySelect(currency)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${currency.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {currency.icon}
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold text-lg">{currency.symbol}</h3>
                    <p className="text-muted-foreground text-sm">{currency.name}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-foreground font-semibold text-lg">{currency.balance.toFixed(2)}</p>
                  <p className="text-muted-foreground text-sm">≈${currency.usdValue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <div className="p-4 mt-8">
        <div className="bg-card rounded-lg p-4 border border-border">
          <h3 className="text-foreground font-semibold mb-2">{t("depositInformation")}</h3>
          <p className="text-muted-foreground text-sm mb-2">
            {t("selectCurrencyToView")}
          </p>
          <p className="text-muted-foreground text-sm mb-2">
            {t("minimumDepositApply")}
          </p>
          <p className="text-muted-foreground text-sm">
            {t("processingTimesVary")}
          </p>
        </div>
      </div>
    </div>
  );
}