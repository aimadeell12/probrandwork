import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, TrendingUp, WalletIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cardApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { user } = useAuth();
  
  // Fetch user cards
  const { data: cards = [] } = useQuery({
    queryKey: ['/api/cards'],
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-xl mx-auto px-4 pt-6 pb-10">
        <div className="space-y-4">
          {/* Total Cards */}
          <Card className="bg-white shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-right">
                  <h3 className="text-gray-600 text-sm font-medium">إجمالي البطاقات</h3>
                  <p className="text-4xl font-bold mt-1">{cards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Balance */}
          <Card className="bg-white shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-green-50 p-3 rounded-full">
                  <WalletIcon className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-right">
                  <h3 className="text-gray-600 text-sm font-medium">الرصيد الإجمالي</h3>
                  <p className="text-4xl font-bold mt-1">$0.00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Transactions */}
          <Card className="bg-white shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-red-50 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-red-500" />
                </div>
                <div className="text-right">
                  <h3 className="text-gray-600 text-sm font-medium">المعاملات اليوم</h3>
                  <p className="text-4xl font-bold mt-1">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Another Widget (add more as needed) */}
          <Card className="bg-white shadow-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-center py-3">
                <Link 
                  href="/cards" 
                  className="text-primary font-medium flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-5 w-5" />
                  عرض جميع البطاقات
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
