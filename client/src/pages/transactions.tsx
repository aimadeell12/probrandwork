import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Receipt,
  DollarSign
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { t } = useLanguage();

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
      case "withdraw":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case "deposit":
      case "receive":
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      default:
        return <Receipt className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "send": return "إرسال";
      case "receive": return "استلام";
      case "deposit": return "إيداع";
      case "withdraw": return "سحب";
      default: return "معاملة";
    }
  };

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">مكتملة</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">معلقة</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">فاشلة</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">غير معروف</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-purple-900 relative overflow-hidden p-4 pb-20">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("transactions")}</h1>
          <Button variant="outline" size="icon" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 hover:bg-purple-50">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder={t("searchTransactions")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 focus:border-purple-500 rounded-2xl"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: "all", label: t("allTransactions") },
            { key: "send", label: t("send") },
            { key: "receive", label: t("scan") },
            { key: "deposit", label: t("deposit") },
            { key: "withdraw", label: t("withdraw") },
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={selectedFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.key)}
              className={selectedFilter === filter.key 
                ? "whitespace-nowrap bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                : "whitespace-nowrap bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 hover:bg-purple-100 dark:hover:bg-purple-900/30"
              }
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <ArrowDownLeft className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">إجمالي الدخل</span>
              </div>
              <p className="text-lg font-semibold text-green-600">
                ${filteredTransactions
                  .filter(t => t.type === 'deposit' || t.type === 'receive')
                  .reduce((sum, t) => sum + (typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount || 0), 0)
                  .toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <ArrowUpRight className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">إجمالي المصروف</span>
              </div>
              <p className="text-lg font-semibold text-red-600">
                ${filteredTransactions
                  .filter(t => t.type === 'send' || t.type === 'withdraw')
                  .reduce((sum, t) => sum + (typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount || 0), 0)
                  .toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">جارٍ تحميل المعاملات...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction: any) => (
              <Card key={transaction.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl hover:shadow-2xl transition-all duration-200">
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
                          {getTransactionTypeLabel(transaction.type)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {transaction.description || "لا يوجد وصف"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(transaction.createdAt).toLocaleDateString('ar-SA')}
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
                        ${typeof transaction.amount === 'string' ? transaction.amount : transaction.amount?.toFixed(2)}
                      </p>
                      {getTransactionStatusBadge(transaction.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
              <CardContent className="p-8 text-center">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">لا توجد معاملات</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {searchTerm ? "لم يتم العثور على معاملات تطابق البحث" : "لم تقم بأي معاملات بعد"}
                </p>
                {!searchTerm && (
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" variant="outline" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 hover:bg-purple-50">إيداع</Button>
                    <Button size="sm" variant="outline" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 hover:bg-purple-50">إرسال</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Stats */}
        <Card className="mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              إحصائيات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">معاملات هذا الشهر</span>
              <span className="font-semibold text-gray-900 dark:text-white">{filteredTransactions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">متوسط قيمة المعاملة</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                $
                {filteredTransactions.length > 0 
                  ? (filteredTransactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) / filteredTransactions.length).toFixed(2)
                  : "0.00"
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">أكبر معاملة</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                $
                {filteredTransactions.length > 0 
                  ? Math.max(...filteredTransactions.map((t: any) => t.amount || 0)).toFixed(2)
                  : "0.00"
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}