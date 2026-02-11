import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowUpDown, TrendingUp, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Currency() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const queryClient = useQueryClient();

  // Get exchange rates
  const { data: exchangeRates = [] } = useQuery({
    queryKey: ['/api/currency/rates'],
    queryFn: () => apiRequest('GET', '/api/currency/rates').then(res => res.json())
  });

  // Get conversion history
  const { data: conversionHistory = [] } = useQuery({
    queryKey: ['/api/currency/history'],
    queryFn: () => apiRequest('GET', '/api/currency/history').then(res => res.json())
  });

  // Convert currency mutation
  const convertMutation = useMutation({
    mutationFn: (data: { fromCurrency: string; toCurrency: string; amount: number }) =>
      apiRequest('POST', '/api/currency/convert', data).then(res => res.json()),
    onSuccess: (data) => {
      setConvertedAmount(data.toAmount.toFixed(4));
      toast({
        title: "Conversion Complete",
        description: `${amount} ${fromCurrency} = ${data.toAmount.toFixed(4)} ${toCurrency}`
      });
      // Refresh conversion history
      queryClient.invalidateQueries({ queryKey: ['/api/currency/history'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to convert currency",
        variant: "destructive"
      });
    }
  });

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" }
  ];

  const convertCurrency = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    convertMutation.mutate({
      fromCurrency,
      toCurrency,
      amount: parseFloat(amount)
    });
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setAmount("");
    setConvertedAmount("");
  };

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || code;
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
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Currency Converter
          </h1>
        </div>

        {/* Converter Card */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <ArrowUpDown className="h-5 w-5" />
              Convert Currency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1"
                />
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={swapCurrencies}
                className="rounded-full"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
              <div className="flex gap-2">
                <Input
                  placeholder="0.00"
                  value={convertedAmount}
                  readOnly
                  className="flex-1 bg-gray-50 dark:bg-gray-700"
                />
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={convertCurrency}
              className="w-full bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-red-800"
            >
              Convert
            </Button>
          </CardContent>
        </Card>

        {/* Exchange Rates */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <TrendingUp className="h-5 w-5" />
              Current Exchange Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {exchangeRates.slice(0, 6).map((rate: any) => (
                <div key={`${rate.fromCurrency}-${rate.toCurrency}`} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">
                    1 {rate.fromCurrency} = {parseFloat(rate.rate).toFixed(4)} {rate.toCurrency}
                  </span>
                </div>
              ))}
              {exchangeRates.length === 0 && (
                <div className="col-span-2 text-center text-gray-600 dark:text-gray-400 py-4">
                  No exchange rates available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Conversions */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Clock className="h-5 w-5" />
              Recent Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversionHistory.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400 py-4">
                  No conversion history found
                </div>
              ) : (
                conversionHistory.map((conversion: any) => (
                  <div key={conversion.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getCurrencySymbol(conversion.fromCurrency)}{conversion.fromAmount} → {getCurrencySymbol(conversion.toCurrency)}{conversion.toAmount}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {conversion.fromCurrency} to {conversion.toCurrency}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(conversion.createdAt).toLocaleDateString()}
                    </span>
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