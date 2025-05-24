import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  ArrowRight, 
  MoreHorizontal, 
  RefreshCcw, 
  FileText
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  
  // Mock transactions data
  const transactions = [
    { 
      id: 1, 
      type: "إيداع", 
      amount: "+121.015148", 
      currency: "USDT", 
      date: "2025-03-28", 
      time: "15:46:47",
      status: "فشل"
    },
    { 
      id: 2, 
      type: "إيداع", 
      amount: "+126.050441", 
      currency: "USDT", 
      date: "2025-03-28", 
      time: "15:37:37",
      status: "فشل"
    },
    { 
      id: 3, 
      type: "إيداع", 
      amount: "+129.075353", 
      currency: "USDT", 
      date: "2025-03-28", 
      time: "15:35:22",
      status: "فشل"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">أ</span>
          </div>
          <h1 className="text-xl font-bold">منصة البطاقات</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-transparent text-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/></svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-transparent text-white flex items-center justify-center relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span className="absolute -top-1 -right-1 bg-red-600 w-4 h-4 rounded-full text-xs flex items-center justify-center">2</span>
          </button>
        </div>
      </div>

      {/* Apply Card Banner */}
      <div className="mx-4 my-4">
        <Card className="bg-black border border-gray-800 rounded-xl overflow-hidden">
          <CardContent className="p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="13" x="3" y="5" rx="2" stroke="#fff"/><line x1="2" x2="22" y1="10" y2="10" stroke="#fff"/></svg>
              </div>
              <div>
                <h3 className="font-medium">طلب بطاقة جديدة</h3>
                <p className="text-xs text-gray-400">ابدأ رحلة إنفاقك اليوم</p>
              </div>
            </div>
            <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6">
              طلب
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Balance Section */}
      <div className="px-4 pt-2 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm text-gray-400">القيمة الإجمالية المقدرة (MAD)</p>
          <button className="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold">0.00</h2>
          <button className="text-gray-400">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 px-8 py-4 gap-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2">
            <Plus className="text-black" size={24} />
          </div>
          <span className="text-xs">إيداع</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-2">
            <ArrowRight className="text-white" size={24} />
          </div>
          <span className="text-xs">إرسال</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-2">
            <RefreshCcw className="text-white" size={24} />
          </div>
          <span className="text-xs">تحويل</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-2">
            <MoreHorizontal className="text-white" size={24} />
          </div>
          <span className="text-xs">المزيد</span>
        </div>
      </div>

      {/* Crypto Assets */}
      <div className="grid grid-cols-2 gap-3 px-4 py-4">
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#fff"><path d="M12 6v12"/><path d="M6 12h12"/></svg>
            </div>
            <span className="text-sm">USDT</span>
          </div>
          <div className="text-2xl font-bold">0.00</div>
          <div className="text-sm text-gray-400">0.00</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
            </div>
            <span className="text-sm">USDC</span>
          </div>
          <div className="text-2xl font-bold">0.00</div>
          <div className="text-sm text-gray-400">0.00</div>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">المعاملات</h3>
          <button>
            <MoreHorizontal className="text-gray-400" size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 bg-gray-900 rounded-xl p-3">
              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mr-2">
                <FileText className="text-white" size={20} />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <h4 className="font-medium">{tx.type}</h4>
                  <span className="font-medium">{tx.amount} {tx.currency}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <p>{tx.date} {tx.time}</p>
                  <span className="text-red-500">{tx.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
