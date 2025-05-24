import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, TrendingUp, Wallet } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { user } = useAuth();
  
  // Fetch user cards
  const { data } = useQuery({
    queryKey: ['/api/cards'],
    enabled: !!user,
  });
  
  // Safely access data with fallback
  const cards = Array.isArray(data) ? data : [];
  const cardCount = cards.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-xl mx-auto px-4 pt-6 pb-10">
        <div className="space-y-4">
          {/* Total Cards */}
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <div className="p-4 flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-grow text-right">
                <h3 className="text-gray-600 text-sm font-medium">إجمالي البطاقات</h3>
                <p className="text-4xl font-bold mt-1">{cardCount}</p>
              </div>
            </div>
          </div>

          {/* Total Balance */}
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <div className="p-4 flex items-start gap-4">
              <div className="bg-green-50 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex-grow text-right">
                <h3 className="text-gray-600 text-sm font-medium">الرصيد الإجمالي</h3>
                <p className="text-4xl font-bold mt-1">$0.00</p>
              </div>
            </div>
          </div>

          {/* Today's Transactions */}
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <div className="p-4 flex items-start gap-4">
              <div className="bg-red-50 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-grow text-right">
                <h3 className="text-gray-600 text-sm font-medium">المعاملات اليوم</h3>
                <p className="text-4xl font-bold mt-1">12</p>
              </div>
            </div>
          </div>
          
          {/* View All Cards Link */}
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-center py-3">
                <Link 
                  href="/cards" 
                  className="text-primary font-medium flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-5 w-5" />
                  عرض جميع البطاقات
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
