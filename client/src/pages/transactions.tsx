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
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t("transactions")}</h1>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchTransactions")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: "all", label: t("all") },
            { key: "send", label: t("sendTransaction") },
            { key: "receive", label: t("receiveTransaction") },
            { key: "deposit", label: t("depositTransaction") },
            { key: "withdraw", label: t("withdrawTransaction") },
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={selectedFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.key)}
              className="whitespace-nowrap"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownLeft className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">{t("totalIncome")}</span>
              </div>
              <p className="text-lg font-semibold text-green-600">$1,250.00</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="h-4 w-4 text-red-500" />
                <span className="text-sm text-muted-foreground">{t("totalExpense")}</span>
              </div>
              <p className="text-lg font-semibold text-red-600">$750.00</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">جارٍ تحميل المعاملات...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction: any) => (
              <Card key={transaction.id} className="banking-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">
                          {getTransactionTypeLabel(transaction.type)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.description || "لا يوجد وصف"}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
                        ${transaction.amount?.toFixed(2)}
                      </p>
                      {getTransactionStatusBadge(transaction.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold mb-2">لا توجد معاملات</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm ? "لم يتم العثور على معاملات تطابق البحث" : "لم تقم بأي معاملات بعد"}
                </p>
                {!searchTerm && (
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" variant="outline">إيداع</Button>
                    <Button size="sm" variant="outline">إرسال</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              إحصائيات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">معاملات هذا الشهر</span>
              <span className="font-semibold">{filteredTransactions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">متوسط قيمة المعاملة</span>
              <span className="font-semibold">
                $
                {filteredTransactions.length > 0 
                  ? (filteredTransactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) / filteredTransactions.length).toFixed(2)
                  : "0.00"
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">أكبر معاملة</span>
              <span className="font-semibold">
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