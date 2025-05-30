import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CreateCardModal from "@/components/create-card-modal";
import { CreditCard as CreditCardComponent } from "@/components/credit-card";
import type { Card } from "shared/schema";

export default function Cards() {
  const [showChooseCard, setShowChooseCard] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<"virtual" | "physical">("virtual");
  const [showCardNumbers, setShowCardNumbers] = useState<Record<string, boolean>>({});

  // Fetch cards
  const { data: cards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ['/api/cards'],
  });

  // Fetch transactions for each card
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions'],
  });

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

  if (cardsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl relative z-10">
          <div className="pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full aspect-[1.6/1] bg-gray-200 dark:bg-gray-700 rounded-2xl max-w-sm mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl relative z-10">
        
        {/* Check if there are cards and not showing choose card view */}
        {Array.isArray(cards) && cards.length > 0 && !showChooseCard ? (
          <>
            {/* Header for existing cards */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pt-12 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center sm:text-right">بطاقاتي</h1>
              <Button
                onClick={() => setShowChooseCard(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full p-3 shadow-lg"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {/* Card Type Filter */}
            <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-1 mb-8 max-w-xs mx-auto shadow-lg border border-white/30">
              <button
                onClick={() => setSelectedCardType("virtual")}
                className={cn(
                  "flex-1 py-2 px-4 rounded-full text-xs sm:text-sm font-medium transition-all",
                  selectedCardType === "virtual"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                Virtual Card
              </button>
              <button
                onClick={() => setSelectedCardType("physical")}
                className={cn(
                  "flex-1 py-2 px-4 rounded-full text-xs sm:text-sm font-medium transition-all",
                  selectedCardType === "physical"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                Physical Card
              </button>
            </div>

            {/* Cards Carousel - Horizontal Scrolling */}
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-4 -mx-4 snap-x snap-mandatory">
                {cards.filter((card: Card) => card.type === selectedCardType).map((card: Card, index: number) => (
                  <div key={card.id} className="flex-shrink-0 w-80 sm:w-96 snap-center">
                    <div className="relative group">
                      {/* Card Visual */}
                      <div className="relative w-full transform transition-transform duration-300 group-hover:scale-105">
                        <CreditCardComponent 
                          card={card} 
                          showDetails={showCardNumbers[card.id] || false}
                          onToggleVisibility={() => toggleCardVisibility(card.id)}
                        />
                      </div>

                      {/* Card info */}
                      <div className="text-center mt-4 space-y-2">
                        <div className={cn(
                          "inline-flex items-center gap-2 text-sm transition-all duration-300",
                          card.status === "blocked" 
                            ? "text-red-600 dark:text-red-400" 
                            : card.status === "frozen"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400"
                        )}>
                          <div className={cn(
                            "w-4 h-4 rounded-full",
                            card.status === "blocked"
                              ? "bg-gradient-to-r from-red-500 to-red-600"
                              : card.status === "frozen"
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                              : "bg-gradient-to-r from-purple-500 to-blue-500"
                          )}></div>
                          {card.status === "blocked" 
                            ? "Blocked" 
                            : card.status === "frozen"
                            ? "Frozen"
                            : "Active"}
                        </div>

                        <p className={cn(
                          "text-sm transition-all duration-300",
                          card.status === "blocked" 
                            ? "text-red-500 dark:text-red-400" 
                            : card.status === "frozen"
                            ? "text-blue-500 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400"
                        )}>
                          {card.status === "blocked" 
                            ? "Card is permanently blocked" 
                            : card.status === "frozen"
                            ? "Card is temporarily frozen"
                            : "Ready to use"}
                        </p>
                      </div>

                      {/* Card Transactions */}
                      <div className="mt-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 dark:border-gray-700/30">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">المعاملات الأخيرة</h4>
                        {transactionsLoading ? (
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="animate-pulse flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                                <div className="flex-1">
                                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                                </div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <>
                            {getCardTransactions(card.id).length > 0 ? (
                              <div className="space-y-3">
                                {getCardTransactions(card.id).map((transaction: any, index: number) => (
                                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 dark:hover:bg-gray-700/40 transition-colors">
                                    <div className="flex-shrink-0">
                                      {getTransactionIcon(transaction.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {transaction.description || transaction.merchant || 'معاملة'}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {transaction.date ? new Date(transaction.date).toLocaleDateString('ar') : 'اليوم'}
                                      </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                      <span className={cn(
                                        "text-sm font-semibold",
                                        transaction.type === 'deposit' || transaction.type === 'refund'
                                          ? "text-green-600 dark:text-green-400"
                                          : "text-red-600 dark:text-red-400"
                                      )}>
                                        {transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-'}
                                        {formatAmount(Math.abs(transaction.amount || 0), transaction.currency || card.currency)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <Clock className="h-8 w-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">لا توجد معاملات حديثة</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Card indicators */}
              {cards.filter((card: Card) => card.type === selectedCardType).length > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {cards.filter((card: Card) => card.type === selectedCardType).map((_, index) => (
                    <div 
                      key={index}
                      className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Extra space for bottom navigation */}
            <div className="mb-24"></div>
          </>
        ) : (
          <CreateCardModal 
            open={showChooseCard} 
            onOpenChange={(open) => {
              setShowChooseCard(open);
            }} 
          />
        )}
      </div>
    </div>
  );
}