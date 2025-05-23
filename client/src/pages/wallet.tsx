import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import { 
  Plus, 
  Minus, 
  Send, 
  ScanLine, 
  DollarSign, 
  Eye, 
  EyeOff,
  ChevronRight,
  Calendar,
  Bell,
  X
} from "lucide-react";

export default function Wallet() {
  const [showBalance, setShowBalance] = useState(true);
  const [showGuidance, setShowGuidance] = useState(true);

  const { data: cards, isLoading: cardsLoading } = useQuery({
    queryKey: ["/api/cards"],
  });

  const totalBalance = Array.isArray(cards) ? cards.reduce((sum: number, card: any) => sum + parseFloat(card.balance || "0"), 0) : 5.00;

  const quickActions = [
    { icon: Plus, label: "إيداع", color: "bg-black text-white" },
    { icon: Minus, label: "سحب", color: "bg-gray-100 text-gray-700" },
    { icon: Send, label: "إرسال", color: "bg-gray-100 text-gray-700" },
    { icon: ScanLine, label: "مسح", color: "bg-gray-100 text-gray-700" },
  ];

  const assets = [
    {
      icon: "💵",
      name: "USD($)",
      amount: totalBalance.toFixed(2),
      equivalent: `≈${totalBalance.toFixed(2)} USD`,
      bgColor: "bg-green-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-3 space-x-reverse">
          <h1 className="text-2xl font-bold text-black">المحفظة</h1>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="ghost" size="sm" className="p-2">
            <Calendar className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Currency Selector */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-6 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">🇺🇸</span>
          </div>
          <span className="font-medium text-gray-700">USD</span>
          <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
        </div>

        {/* Balance Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-gray-500 text-sm">الرصيد الإجمالي</span>
              <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                <span className="text-gray-400 text-xs">؟</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="p-1"
            >
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="text-4xl font-bold text-black">
            {showBalance ? `$ ${totalBalance.toFixed(2)}` : "$ ****"}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between space-x-4 space-x-reverse">
          {quickActions.map((action, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <Button
                size="lg"
                className={`w-16 h-16 rounded-full ${action.color} hover:opacity-90`}
              >
                <action.icon className="h-6 w-6" />
              </Button>
              <span className="text-sm text-gray-600">{action.label}</span>
            </div>
          ))}
        </div>

        {/* Beginner Guidance */}
        {showGuidance && (
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-6 bg-gray-300 rounded"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">إرشادات المبتدئين</h3>
                  <p className="text-gray-600 text-sm mb-2">يرجى التحقق من هويتك</p>
                  <Button variant="link" className="p-0 h-auto text-red-500 text-sm">
                    اذهب للتحقق
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGuidance(false)}
                className="p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Promotional Banner */}
        <div className="bg-gradient-to-r from-red-500 to-purple-600 rounded-xl p-4 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-1">عرض RedotPay 11.11</h3>
            <div className="bg-black bg-opacity-30 rounded-full px-3 py-1 inline-block">
              <span className="text-sm font-medium">خصم يصل إلى 60%</span>
            </div>
          </div>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="w-16 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg"></div>
          </div>
          <div className="absolute left-2 top-2">
            <div className="w-4 h-4 border-2 border-white rounded-full opacity-30"></div>
          </div>
          <div className="absolute right-8 bottom-2">
            <div className="w-6 h-6 border-2 border-white rounded-full opacity-20"></div>
          </div>
        </div>

        {/* Assets Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">الأصول</h2>
          
          {assets.map((asset, index) => (
            <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`w-10 h-10 ${asset.bgColor} rounded-full flex items-center justify-center`}>
                    <span className="text-lg">{asset.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                    <p className="text-sm text-gray-500">{asset.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{asset.amount}</p>
                  <p className="text-sm text-gray-500">{asset.equivalent}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex-1 py-3">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <span className="text-xs text-gray-600">المحفظة</span>
            </div>
          </Button>
          <Button variant="ghost" className="flex-1 py-3">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <span className="text-xs text-gray-600">البطاقة</span>
            </div>
          </Button>
          <Button variant="ghost" className="flex-1 py-3">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <span className="text-xs text-gray-600">الحساب</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
        <div className="w-8 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
}