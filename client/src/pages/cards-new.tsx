import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus, Eye, EyeOff, MoreVertical, Lock, Unlock, Snowflake, Copy } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Card as CardType } from "shared/schema";

// Native-style Card Component
function CreditCardView({ card, showNumber = false, onToggleVisibility }: { 
  card: CardType, 
  showNumber?: boolean, 
  onToggleVisibility: () => void 
}) {
  const formatCardNumber = (lastFour: string | null) => {
    if (!lastFour) return "**** **** **** ****";
    if (!showNumber) return "**** **** **** " + lastFour;
    // For demo purposes with lastFour only
    return "**** **** **** " + lastFour;
  };

  const formatExpiry = () => {
    if (!showNumber) return "**/**";
    // Using demo expiry date
    return "12/27";
  };

  const formatCVV = () => {
    if (!showNumber) return "***";
    return "***";
  };

  return (
    <div className="relative w-full aspect-[1.6/1] rounded-2xl overflow-hidden shadow-2xl">
      {/* Card Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-white/20 blur-2xl"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
        </div>
      </div>

      {/* Card Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
        {/* Top Section - Brand Name */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold tracking-wider">PAYdota</h2>
          </div>
          <button
            onClick={onToggleVisibility}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            {showNumber ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* Middle Section - Card Number */}
        <div className="flex-1 flex items-center">
          <div className="w-full">
            <p className="text-2xl font-mono tracking-[0.3em] font-medium">
              {formatCardNumber(card.lastFour)}
            </p>
          </div>
        </div>

        {/* Bottom Section - Expiry and CVV */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-lg font-mono font-medium">
              {formatExpiry()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80 mb-1">CVV</p>
            <p className="text-lg font-mono font-medium">
              {formatCVV()}
            </p>
          </div>
        </div>
      </div>

      {/* Card Type Indicator */}
      <div className="absolute top-4 right-4">
        <div className="w-12 h-8 bg-white/20 rounded backdrop-blur-sm flex items-center justify-center">
          <span className="text-xs font-bold text-white">
            {card.type === 'virtual' ? 'V' : 'P'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CardsNew() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showCardNumbers, setShowCardNumbers] = useState<Record<string, boolean>>({});

  const { data: cards = [], isLoading } = useQuery<CardType[]>({
    queryKey: ["/api/cards"],
  });

  const { data: balance = { balance: 0 } } = useQuery({
    queryKey: ["/api/wallet/balance"],
  });

  const toggleCardVisibility = (cardId: string) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleCopyCardNumber = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber);
    toast({
      title: "Copied",
      description: "Card number copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-purple-200/30 dark:border-purple-700/30 p-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/dashboard")}
              className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              My Cards
            </h1>
          </div>
          
          <Button
            onClick={() => setLocation("/cards/create")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        
        {/* Balance Summary */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 dark:border-purple-700/30 shadow-lg mb-6">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Available Balance</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${((balance as any)?.balance / 100 || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        {/* Cards Grid */}
        {cards.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 dark:border-purple-700/30 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Cards Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first card to start making transactions
              </p>
              <Button
                onClick={() => setLocation("/cards/create")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Card
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {cards.map((card) => (
              <div key={card.id} className="space-y-4">
                {/* Native Card Design */}
                <div className="px-4">
                  <CreditCardView
                    card={card}
                    showNumber={showCardNumbers[card.id] || false}
                    onToggleVisibility={() => toggleCardVisibility(card.id)}
                  />
                </div>

                {/* Card Details */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 dark:border-purple-700/30 shadow-lg mx-4">
                  <CardContent className="p-4">
                    
                    {/* Card Info */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {card.holderName || `${card.type} Card`}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {card.type} • {card.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${((card.balance || 0) / 100).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Available
                        </p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyCardNumber(card.lastFour || "")}
                        className="flex flex-col items-center p-3 h-auto border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                      >
                        <Copy className="h-4 w-4 mb-1 text-purple-600" />
                        <span className="text-xs">Copy</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex flex-col items-center p-3 h-auto border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                      >
                        {card.status === 'frozen' ? <Unlock className="h-4 w-4 mb-1 text-purple-600" /> : <Snowflake className="h-4 w-4 mb-1 text-purple-600" />}
                        <span className="text-xs">{card.status === 'frozen' ? 'Unfreeze' : 'Freeze'}</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex flex-col items-center p-3 h-auto border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                      >
                        <MoreVertical className="h-4 w-4 mb-1 text-purple-600" />
                        <span className="text-xs">More</span>
                      </Button>
                    </div>

                    {/* Recent Transactions Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Recent Activity
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLocation(`/cards/${card.id}/transactions`)}
                          className="text-purple-600 hover:text-purple-700 text-sm"
                        >
                          View All
                        </Button>
                      </div>
                      
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between items-center py-2">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">No recent transactions</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}