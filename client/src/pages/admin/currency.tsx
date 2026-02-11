import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, DollarSign, Plus, Search, TrendingUp, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminCurrency() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRate, setNewRate] = useState({
    fromCurrency: '',
    toCurrency: '',
    rate: ''
  });

  // Get all exchange rates
  const { data: exchangeRates = [] } = useQuery({
    queryKey: ['/api/admin/currency/rates'],
    queryFn: () => apiRequest('GET', '/api/admin/currency/rates').then(res => res.json())
  });

  // Get currency statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/currency/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/currency/stats').then(res => res.json())
  });

  // Get conversion history
  const { data: conversions = [] } = useQuery({
    queryKey: ['/api/admin/currency/conversions'],
    queryFn: () => apiRequest('GET', '/api/admin/currency/conversions').then(res => res.json())
  });

  // Create exchange rate mutation
  const createRateMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest('POST', '/api/admin/currency/rates', data).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Exchange rate created successfully"
      });
      setIsCreateDialogOpen(false);
      setNewRate({ fromCurrency: '', toCurrency: '', rate: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/currency/rates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/currency/stats'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create exchange rate",
        variant: "destructive"
      });
    }
  });

  // Update exchange rate mutation
  const updateRateMutation = useMutation({
    mutationFn: ({ id, rate }: { id: string; rate: number }) =>
      apiRequest('PATCH', `/api/admin/currency/rates/${id}`, { rate }).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Exchange rate updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/currency/rates'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update exchange rate",
        variant: "destructive"
      });
    }
  });

  const handleCreateRate = () => {
    const rateData = {
      ...newRate,
      rate: parseFloat(newRate.rate)
    };
    createRateMutation.mutate(rateData);
  };

  const filteredRates = exchangeRates.filter((rate: any) =>
    rate.fromCurrency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.toCurrency?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SAR", "AED"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 dark:from-gray-900 dark:via-green-900 dark:to-blue-900 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 dark:bg-green-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
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
              Currency Management
            </h1>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Exchange Rate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Exchange Rate</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fromCurrency">From Currency</Label>
                  <select
                    id="fromCurrency"
                    value={newRate.fromCurrency}
                    onChange={(e) => setNewRate({...newRate, fromCurrency: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  >
                    <option value="">Select currency</option>
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="toCurrency">To Currency</Label>
                  <select
                    id="toCurrency"
                    value={newRate.toCurrency}
                    onChange={(e) => setNewRate({...newRate, toCurrency: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  >
                    <option value="">Select currency</option>
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="rate">Exchange Rate</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.0001"
                    value={newRate.rate}
                    onChange={(e) => setNewRate({...newRate, rate: e.target.value})}
                    placeholder="1.2500"
                  />
                </div>
                <Button 
                  onClick={handleCreateRate} 
                  className="w-full"
                  disabled={createRateMutation.isPending}
                >
                  Add Rate
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.totalRates || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Exchange Rates</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.totalConversions || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Conversions</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <RefreshCw className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.todayConversions || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Today</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">${stats?.totalVolume || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Volume</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search exchange rates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Exchange Rates */}
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Exchange Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredRates.length === 0 ? (
                  <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                    No exchange rates found
                  </div>
                ) : (
                  filteredRates.map((rate: any) => (
                    <div key={rate.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {rate.fromCurrency} → {rate.toCurrency}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Rate: {parseFloat(rate.rate).toFixed(4)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Updated: {new Date(rate.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.0001"
                          defaultValue={rate.rate}
                          className="w-24 h-8"
                          onBlur={(e) => {
                            const newRateValue = parseFloat(e.target.value);
                            if (newRateValue !== rate.rate && newRateValue > 0) {
                              updateRateMutation.mutate({ id: rate.id, rate: newRateValue });
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Conversions */}
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Recent Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversions.length === 0 ? (
                  <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                    No conversions found
                  </div>
                ) : (
                  conversions.slice(0, 10).map((conversion: any) => (
                    <div key={conversion.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {conversion.fromAmount} {conversion.fromCurrency} → {conversion.toAmount} {conversion.toCurrency}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Rate: {parseFloat(conversion.rate).toFixed(4)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(conversion.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}