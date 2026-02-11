import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  Eye,
  EyeOff,
  TrendingUp,
  Clock,
  CreditCard
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { useNativeInteractions } from "@/hooks/useNativeInteractions";
import PullToRefresh from "@/components/pull-to-refresh";

export default function WalletPage() {
  const { t } = useLanguage();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const queryClient = useQueryClient();
  const { triggerHaptic } = useNativeInteractions();

  const { data: walletData } = useQuery({
    queryKey: ["/api/wallet/balance"],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const balance = walletData?.balance || 0;
  const pendingBalance = walletData?.pendingBalance || 0;
  const totalBalance = balance + pendingBalance;

  const handleRefresh = async () => {
    triggerHaptic();
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] }),
    ]);
  };

  const recentTransactions = (transactions as any[]).slice(0, 5);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
      case "withdraw":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case "receive":
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="max-w-md lg:max-w-6xl mx-auto lg:p-6">
          
          {/* Header - Mobile & Desktop */}
          <div className="bg-white lg:rounded-xl lg:shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Wallet className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">My Wallet</h1>
                  <p className="text-sm text-gray-600">Manage your funds</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="rounded-full"
              >
                {isBalanceVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Total Balance */}
              <Card className="bg-gradient-to-br from-red-600 to-red-700 border-0 text-white lg:col-span-2">
                <CardContent className="p-6">
                  <p className="text-sm opacity-90 mb-2">Total Balance</p>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    {isBalanceVisible ? `$${totalBalance.toLocaleString()}` : '*******'}
                  </h2>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <TrendingUp className="h-4 w-4" />
                    <span>+5.2% this month</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet className="h-4 w-4 text-green-600" />
                      <p className="text-xs text-green-600 font-medium">Available</p>
                    </div>
                    <p className="text-lg font-bold text-green-700">
                      {isBalanceVisible ? `$${balance.toLocaleString()}` : '******'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-red-600" />
                      <p className="text-xs text-red-600 font-medium">Pending</p>
                    </div>
                    <p className="text-lg font-bold text-red-700">
                      {isBalanceVisible ? `$${pendingBalance.toLocaleString()}` : '******'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Quick Actions */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/send">
                    <Button className="w-full bg-red-600 hover:bg-red-700" data-testid="button-send">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </Link>
                  <Link href="/deposit">
                    <Button variant="outline" className="w-full" data-testid="button-deposit">
                      <ArrowDownLeft className="h-4 w-4 mr-2" />
                      Deposit
                    </Button>
                  </Link>
                  <Link href="/withdraw">
                    <Button variant="outline" className="w-full" data-testid="button-withdraw">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Withdraw
                    </Button>
                  </Link>
                  <Link href="/cards">
                    <Button variant="outline" className="w-full" data-testid="button-cards">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Cards
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <Link href="/transactions">
                  <Button variant="link" className="text-red-600 p-0 h-auto">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransactions.map((transaction: any) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${
                            transaction.type === 'deposit' || transaction.type === 'receive'
                              ? 'bg-green-100'
                              : 'bg-red-100'
                          }`}>
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {transaction.description || transaction.type}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.type === 'deposit' || transaction.type === 'receive'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {transaction.type === 'deposit' || transaction.type === 'receive' ? '+' : '-'}
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <Badge 
                            variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No transactions yet</p>
                    <Link href="/deposit">
                      <Button variant="link" className="text-red-600 mt-2">
                        Make your first deposit
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </PullToRefresh>
    </div>
  );
}
