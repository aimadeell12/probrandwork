import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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

  const toggleCardVisibility = (cardId: string) => {
    setShowCardNumbers(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  if (cardsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 relative overflow-hidden">
        <div className="container mx-auto px-6 py-8 max-w-md relative z-10">
          <div className="pt-12 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[1.6/1] bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              </div>
            ))}
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
      
      <div className="container mx-auto px-6 py-8 max-w-md relative z-10">
        
        {/* Check if there are cards and not showing choose card view */}
        {Array.isArray(cards) && cards.length > 0 && !showChooseCard ? (
          <>
            {/* Header for existing cards */}
            <div className="flex items-center justify-between mb-8 pt-12">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">بطاقاتي</h1>
              <Button
                onClick={() => setShowChooseCard(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full p-3"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {/* Card Type Filter */}
            <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-1 mb-8 max-w-xs mx-auto shadow-lg border border-white/30">
              <button
                onClick={() => setSelectedCardType("virtual")}
                className={cn(
                  "flex-1 py-2 px-4 rounded-full text-xs font-medium transition-all",
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
                  "flex-1 py-2 px-4 rounded-full text-xs font-medium transition-all",
                  selectedCardType === "physical"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                Physical Card
              </button>
            </div>

            {/* Cards List */}
            <div className="space-y-6">
              {cards.filter((card: Card) => card.type === selectedCardType).map((card: Card) => (
                <div key={card.id} className="relative">
                  {/* Card Visual */}
                  <div className="relative w-full max-w-sm mx-auto">
                    <CreditCardComponent 
                      card={card} 
                      showDetails={showCardNumbers[card.id] || false}
                      onToggleVisibility={() => toggleCardVisibility(card.id)}
                    />
                  </div>

                  {/* Card info */}
                  <div className="text-center mt-4">
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
                    <h3 className={cn(
                      "text-lg font-semibold mt-2 transition-all duration-300",
                      card.status === "blocked" 
                        ? "text-red-600 dark:text-red-400" 
                        : card.status === "frozen"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-900 dark:text-white"
                    )}>
                      {card.type === "virtual" ? "Virtual Card" : "Physical Card"}
                      {card.status === "blocked" && " - BLOCKED"}
                      {card.status === "frozen" && " - FROZEN"}
                    </h3>
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
                </div>
              ))}
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