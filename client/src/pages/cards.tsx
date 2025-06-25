import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreditCard as CreditCardComponent } from "@/components/credit-card";
import PullToRefresh from "@/components/pull-to-refresh";
import type { Card } from "shared/schema";
import { useLocation } from "wouter";
import { CardsSkeleton } from "@/components/skeletons";

export default function Cards() {
  const [selectedCardType, setSelectedCardType] = useState<"virtual" | "physical">("virtual");
  const [showCardNumbers, setShowCardNumbers] = useState<Record<string, boolean>>({});
  const [, setLocation] = useLocation();
  
  const queryClient = useQueryClient();

  // Fetch cards
  const { data: cards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ['/api/cards'],
  });

  // Fetch transactions for each card
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions'],
  });

  // Pull to refresh function
  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] }),
    ]);
  };

  const toggleCardVisibility = (cardId: string) => {
    setShowCardNumbers(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  // Filter transactions by card
  const getCardTransactions = (cardId: string) => {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter((transaction: any) => transaction.cardId === cardId || transaction.card_id === cardId).slice(0, 3);
  };

  const formatAmount = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'withdrawal':
      case 'payment':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'deposit':
      case 'refund':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };



  return (
    <div className="h-screen h-[100dvh] bg-white w-full">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="h-full flex flex-col max-w-md mx-auto">
          
          {/* Fixed Header Section */}
          <div className="flex-none p-4 bg-white border-b border-gray-100" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
            {/* Header - Fixed at top */}
            <div className="flex items-center justify-between mb-4 pt-2 pb-2">
              <h1 className="text-xl font-semibold text-gray-900">
                Cards
              </h1>
              <Button
                onClick={() => setLocation("/choose-card")}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>

            {/* Card Type Selector - Fixed */}
            {Array.isArray(cards) && cards.length > 0 && (
              <div className="bg-gray-200 rounded-full p-1 flex">
                <Button 
                  onClick={() => setSelectedCardType("virtual")}
                  className={cn(
                    "flex-1 rounded-full py-2 px-4 text-sm font-medium",
                    selectedCardType === "virtual"
                      ? "bg-purple-500 text-white"
                      : "bg-transparent text-gray-600 hover:bg-gray-300"
                  )}
                  variant="ghost"
                >
                  VIRTUAL CARDS
                </Button>
                <Button 
                  onClick={() => setSelectedCardType("physical")}
                  className={cn(
                    "flex-1 rounded-full py-2 px-4 text-sm font-medium",
                    selectedCardType === "physical"
                      ? "bg-purple-500 text-white"
                      : "bg-transparent text-gray-600 hover:bg-gray-300"
                  )}
                  variant="ghost"
                >
                  PHYSICAL CARDS
                </Button>
              </div>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 pb-24">
            {/* Check if there are cards */}
            {Array.isArray(cards) && cards.length > 0 ? (
              <>

              {/* Cards List */}
              <div className="space-y-4 mb-6">
                {cards.filter((card: Card) => card.type === selectedCardType).map((card: Card) => (
                  <div key={card.id} className="w-full">
                    <CreditCardComponent 
                      card={card} 
                      showDetails={showCardNumbers[card.id] || false}
                      onToggleVisibility={() => toggleCardVisibility(card.id)}
                    />
                  </div>
                ))}
              </div>

              {/* Recent Transactions Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                  <span className="text-sm text-gray-500">Balance: $0.00</span>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <p>No recent transactions</p>
                </div>
              </div>
            </>
            ) : (
              {/* No cards state */}
              <div className="flex flex-col items-center justify-center text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No Cards Yet
                </h2>
                <p className="text-gray-600 mb-6 text-sm">
                  Create your first card to start managing your finances
                </p>
                <Button
                  onClick={() => setLocation("/choose-card")}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Card
                </Button>
              </div>
            )}
          </div>
        </div>
      </PullToRefresh>
    </div>
  );
}