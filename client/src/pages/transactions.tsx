import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter,
  Calendar,
  FileText,
  DollarSign
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useNativeInteractions } from "@/hooks/useNativeInteractions";
import PullToRefresh from "@/components/pull-to-refresh";
import { TransactionsSkeleton } from "@/components/skeletons";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { triggerHaptic } = useNativeInteractions();

  const handleRefresh = async () => {
    triggerHaptic();
    await queryClient.invalidateQueries();
  };

  // Get transactions
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const typedTransactions = transactions as Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    status: string;
    createdAt: string;
    [key: string]: any;
  }>;

  const filteredTransactions = typedTransactions.filter((transaction) => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.amount?.toString().includes(searchTerm);
    const matchesFilter = selectedFilter === "all" || 
                         transaction.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case "receive":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case "withdraw":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "send": return "Send";
      case "receive": return "Receive";
      case "deposit": return "Deposit";
      case "withdraw": return "Withdraw";
      default: return "Transaction";
    }
  };

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  // Show skeleton while loading
  if (isLoading) {
    return <TransactionsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background lg:h-auto lg:overflow-auto overflow-y-auto pb-24 lg:pb-6">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="h-full flex flex-col max-w-md lg:max-w-4xl mx-auto lg:p-6">
          
          {/* Fixed Header Area */}
          <div className="flex-shrink-0 bg-white dark:bg-background lg:bg-transparent lg:rounded-xl lg:shadow-sm lg:p-6 border-b lg:border-0 border-gray-100 dark:border-border pt-safe-top lg:pt-0">
            {/* Header - Fixed */}
            <div className="flex items-center justify-between px-4 lg:px-0 py-4 lg:py-0 lg:mb-4">
              <h1 className="text-xl lg:text-3xl font-semibold text-gray-900 dark:text-white">Transactions</h1>
              <Button variant="outline" size="icon" className="bg-white dark:bg-background border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Search - Fixed */}
            <div className="relative px-4 lg:px-0 mb-4">
              <Search className="absolute left-7 lg:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-background border-gray-200 dark:border-border focus:border-gray-400 dark:focus:border-purple-500 rounded-2xl"
              />
            </div>

            {/* Filter Buttons - Fixed */}
            <div className="flex gap-1 px-4 pb-4 overflow-x-auto">
              {[
                { key: "all", label: "All" },
                { key: "send", label: "Send" },
                { key: "receive", label: "Receive" },
                { key: "deposit", label: "Deposit" },
                { key: "withdraw", label: "Withdraw" },
              ].map((filter) => (
                <Button
                  key={filter.key}
                  variant={selectedFilter === filter.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`whitespace-nowrap text-xs px-3 py-2 min-w-0 flex-shrink-0 ${
                    selectedFilter === filter.key 
                      ? "bg-purple-500 text-white shadow-lg"
                      : "bg-white dark:bg-background border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted"
                  }`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Scrollable Transactions List Only */}
          <div className="flex-1 overflow-y-auto pb-20" data-scrollable>
            <div className="p-4">
              <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Loading transactions...</p>
                </div>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction: any) => (
                  <Card key={transaction.id} className="bg-white dark:bg-background border border-gray-200 dark:border-border shadow-sm hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${
                            transaction.type === 'deposit' || transaction.type === 'receive'
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : 'bg-red-100 dark:bg-red-900/30'
                          }`}>
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {transaction.merchant || transaction.description || getTransactionTypeLabel(transaction.type)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(transaction.created * 1000 || transaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.type === 'deposit' || transaction.type === 'receive'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === 'deposit' || transaction.type === 'receive' ? '+' : '-'}
                            ${Math.abs(Number(transaction.amount)).toFixed(2)}
                          </p>
                          {getTransactionStatusBadge(transaction.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p>No transactions found</p>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </PullToRefresh>
    </div>
  );
}