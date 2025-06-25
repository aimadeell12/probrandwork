import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreditCard as CreditCardComponent } from "@/components/credit-card";
import PullToRefresh from "@/components/pull-to-refresh";
import type { Card } from "shared/schema";
import { useLocation } from "wouter";

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

  if (cardsLoading) {
    return (
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="min-h-screen bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl relative z-10">
            <div className="pt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-full aspect-[1.6/1] bg-gray-200 rounded-2xl max-w-sm mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PullToRefresh>
    );
  }

  return (
    <div className="h-screen h-[100dvh] bg-white w-full">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="h-full overflow-y-auto p-4 pb-24 max-w-md mx-auto">
        
          {/* Header - Fixed at top */}
          <div className="flex items-center justify-between mb-4 pt-2 pb-2 border-b border-gray-100">
            <h1 className="text-xl font-semibold text-gray-900">
              Cards
            </h1>
            <Button
              onClick={() => setLocation("/choose-card")}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </div>

        {/* Check if there are cards */}
        {Array.isArray(cards) && cards.length > 0 ? (
          <>
            {/* Card Type Selector - Fixed */}
            <div className="bg-gray-200 rounded-full p-1 mb-4 flex">
              <button
                onClick={() => setSelectedCardType("virtual")}
                className={cn(
                  "flex-1 rounded-full py-2 px-4 text-sm font-medium transition-colors",
                  selectedCardType === "virtual"
                    ? "bg-purple-500 text-white"
                    : "text-gray-600 hover:bg-gray-300"
                )}
              >
                Virtual Cards
              </button>
              <button
                onClick={() => setSelectedCardType("physical")}
                className={cn(
                  "flex-1 rounded-full py-2 px-4 text-sm font-medium transition-colors",
                  selectedCardType === "physical"
                    ? "bg-purple-500 text-white"
                    : "text-gray-600 hover:bg-gray-300"
                )}
              >
                Physical Cards
              </button>
            </div>

            {/* Cards List - Static */}
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

                      {/* Card Transactions */}
                      <div className="mt-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 dark:border-gray-700/30">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recent Transactions</h4>
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
                                        {transaction.merchant || transaction.description || 'معاملة'}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {transaction.date ? new Date(transaction.date).toLocaleDateString('en') : 'Today'}
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
                                <p className="text-sm text-gray-500 dark:text-gray-400">No recent transactions</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Cards Count Text */}
            <div className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
              {cards.filter((card: Card) => card.type === selectedCardType).length} {selectedCardType} card{cards.filter((card: Card) => card.type === selectedCardType).length !== 1 ? 's' : ''}
            </div>
          </>
        ) : (
          /* No Cards State */
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-6 max-w-md mx-auto px-4">
              
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                No Cards Yet
              </h1>
              
              <p className="text-gray-600 mb-8 max-w-md">
                Create your first card to start managing your finances and making secure payments online or in-store.
              </p>
              
              <div>
                <Button
                  onClick={() => setLocation("/choose-card")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full shadow-lg font-medium"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Card
                </Button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </PullToRefresh>
  );
}