import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, ArrowUpRight, ArrowDownLeft, Clock, Eye, EyeOff, MoreVertical, Snowflake, Unlock, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PullToRefresh from "@/components/pull-to-refresh";
import type { Card as CardType } from "shared/schema";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { CardsSkeleton } from "@/components/skeletons";

// Stripe Card Component
const StripeCard = ({ card, showDetails, onToggleVisibility }: {
  card: CardType;
  showDetails: boolean;
  onToggleVisibility: () => void;
}) => {
  const { t } = useLanguage();
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch real card details from Stripe when showing details
  const fetchCardDetails = async () => {
    if (!card.stripeCardId) return;
    
    setLoadingDetails(true);
    try {
      const details = await apiRequest("GET", `/api/cards/${card.id}/details`);
      console.log(`💳 [Stripe Card ${card.id}] Fetched details:`, details);
      setCardDetails(details);
    } catch (error) {
      console.error("Failed to fetch card details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Fetch details when showDetails becomes true or clear when false
  useEffect(() => {
    if (showDetails && card.stripeCardId) {
      fetchCardDetails();
    } else if (!showDetails) {
      setCardDetails(null);
    }
  }, [showDetails, card.stripeCardId]);
  
  const getCardGradient = (design: string) => {
    switch (design) {
      case 'blue':
        return 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800';
      case 'purple':
        return 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800';
      case 'green':
        return 'bg-gradient-to-br from-green-600 via-green-700 to-green-800';
      case 'gold':
        return 'bg-gradient-to-br from-yellow-500 via-yellow-600 to-orange-600';
      case 'black':
        return 'bg-gradient-to-br from-gray-800 via-gray-900 to-black';
      default:
        return 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800';
    }
  };

  const formatCardNumber = (number: string) => {
    // If we have real card details from Stripe and showing details, use them
    if (showDetails && cardDetails?.number && !loadingDetails) {
      const fullNumber = cardDetails.number.toString();
      return fullNumber.replace(/(.{4})/g, '$1 ').trim();
    }
    
    // If loading, show loading state
    if (showDetails && loadingDetails) {
      return "•••• •••• •••• ••••";
    }
    
    // Default masked view - show only last 4 digits
    const lastFour = cardDetails?.last4 || card.lastFour || '••••';
    return `•••• •••• •••• ${lastFour}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'suspended':
      case 'frozen':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'blocked':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="relative">
      {/* Card */}
      <div className={cn(
        "relative w-full h-56 rounded-2xl text-white shadow-xl overflow-hidden",
        getCardGradient(card.design || 'blue')
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white/20"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border-2 border-white/20"></div>
        </div>

        {/* Card Content */}
        <div className="relative p-6 h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90 font-medium">PayDota</p>
              <Badge className={cn("mt-1", getStatusColor(card.status))}>
                {t(card.status as any)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleVisibility}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1 h-auto"
              >
                {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <div className="text-right">
                <p className="text-xs opacity-75">{card.type.toUpperCase()}</p>
                <p className="text-sm font-semibold">{card.brand?.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Card Number */}
          <div className="my-4">
            <p className="text-lg font-mono tracking-wider">
              {formatCardNumber('')}
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs opacity-75">{t("cardHolder")}</p>
              <p className="text-sm font-semibold truncate max-w-[150px]">
                {card.holderName && card.holderName !== 'null null' ? card.holderName : t("cardHolder")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-75">{t("expires")}</p>
              <p className="text-sm font-mono">
                {showDetails ? (
                  loadingDetails ? '••/••' : (
                    cardDetails?.expMonth && cardDetails?.expYear ? 
                      `${String(cardDetails.expMonth).padStart(2, '0')}/${String(cardDetails.expYear).slice(-2)}` :
                      (card.expiryMonth && card.expiryYear ? 
                        `${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}` :
                        '••/••'
                      )
                  )
                ) : '••/••'}
              </p>
            </div>
            {showDetails && (
              <div className="text-right">
                <p className="text-xs opacity-75">CVV</p>
                <p className="text-sm font-mono">
                  {loadingDetails ? '•••' : (cardDetails?.cvc || '•••')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StripeCards() {
  const [selectedCardType, setSelectedCardType] = useState<"virtual" | "physical">("virtual");
  const [showCardNumbers, setShowCardNumbers] = useState<Record<string, boolean>>({});
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const queryClient = useQueryClient();

  // Fetch cards
  const { data: cards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ['/api/cards'],
  });

  // Fetch transactions for each card
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions'],
  });

  // Card management mutations
  const freezeCardMutation = useMutation({
    mutationFn: (cardId: string) => apiRequest('PATCH', `/api/cards/${cardId}/freeze`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      toast({ title: "Card Frozen", description: "Card has been temporarily frozen" });
    }
  });

  const unfreezeCardMutation = useMutation({
    mutationFn: (cardId: string) => apiRequest('PATCH', `/api/cards/${cardId}/unfreeze`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      toast({ title: "Card Unfrozen", description: "Card has been reactivated" });
    }
  });

  const blockCardMutation = useMutation({
    mutationFn: (cardId: string) => apiRequest('PATCH', `/api/cards/${cardId}/block`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      toast({ title: "Card Blocked", description: "Card has been permanently blocked" });
    }
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

  const handleCardAction = (action: string, cardId: string) => {
    switch (action) {
      case 'freeze':
        freezeCardMutation.mutate(cardId);
        break;
      case 'unfreeze':
        unfreezeCardMutation.mutate(cardId);
        break;
      case 'block':
        blockCardMutation.mutate(cardId);
        break;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="app-page bg-white">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="max-w-md mx-auto relative page-content">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-white border-b border-gray-200 p-4" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {t("cards")}
              </h1>
              <Button
                onClick={() => setLocation("/choose-card")}
                size="sm"
                className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("addCard")}
              </Button>
            </div>

            {/* Card Type Toggle */}
            <div className="bg-gray-200 rounded-full p-1 flex mt-4">
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
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Show skeleton only in content area while loading */}
            {(cardsLoading || transactionsLoading) ? (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-2xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ) : (
              cards.filter((card: CardType) => card.type === selectedCardType).length > 0 ? (
              <>
                {/* Cards Carousel */}
                <div className="relative">
                  <div className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-4 -mx-4 snap-x snap-mandatory">
                    {cards.filter((card: CardType) => card.type === selectedCardType).map((card: CardType) => (
                      <div 
                        key={card.id} 
                        className="flex-shrink-0 w-80 sm:w-96 snap-center"
                      >
                        <div className="relative group">
                          {/* Card Visual */}
                          <div className="relative w-full">
                            <StripeCard 
                              card={card} 
                              showDetails={showCardNumbers[card.id] || false}
                              onToggleVisibility={() => toggleCardVisibility(card.id)}
                            />
                          </div>

                          {/* Card Actions */}
                          <div className="absolute top-4 right-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-white/80 hover:text-white hover:bg-white/10 p-1 h-auto"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                {card.status === 'active' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleCardAction('freeze', card.id)}
                                    className="flex items-center gap-2"
                                  >
                                    <Snowflake className="h-4 w-4" />
                                    Freeze Card
                                  </DropdownMenuItem>
                                )}
                                {card.status === 'frozen' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleCardAction('unfreeze', card.id)}
                                    className="flex items-center gap-2"
                                  >
                                    <Unlock className="h-4 w-4" />
                                    Unfreeze Card
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  onClick={() => handleCardAction('block', card.id)}
                                  className="flex items-center gap-2 text-red-600"
                                >
                                  <Clock className="h-4 w-4" />
                                  Block Card
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Card Info & Transactions */}
                          <Card className="mt-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-white/30 shadow-lg">
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {t("recentTransactions")}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {t("balance")}: {formatAmount(parseFloat(card.balance || "0"), card.currency)}
                                </p>
                              </div>



                              {/* Transactions List */}
                              {transactionsLoading ? (
                                <div className="space-y-3">
                                  {[1,2,3].map((i) => (
                                    <div key={i} className="animate-pulse flex items-center gap-3">
                                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                      <div className="flex-1">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <>
                                  {transactions.filter((tx: any) => tx.cardId === card.id).slice(0, 3).length > 0 ? (
                                    <div className="space-y-3">
                                      {transactions.filter((tx: any) => tx.cardId === card.id).slice(0, 3).map((transaction: any) => (
                                        <div key={transaction.id} className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <div className={cn(
                                              "w-10 h-10 rounded-full flex items-center justify-center",
                                              transaction.type === 'deposit' || transaction.type === 'refund'
                                                ? "bg-green-100 dark:bg-green-900/20"
                                                : "bg-red-100 dark:bg-red-900/20"
                                            )}>
                                              {transaction.type === 'deposit' || transaction.type === 'refund' ? (
                                                <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                                              ) : (
                                                <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                                              )}
                                            </div>
                                            <div>
                                              <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                {transaction.merchant || transaction.description || 'معاملة'}
                                              </p>
                                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(transaction.createdAt).toLocaleDateString()}
                                              </p>
                                            </div>
                                          </div>
                                          <span className={cn(
                                            "font-semibold text-sm",
                                            transaction.type === 'deposit' || transaction.type === 'refund'
                                              ? "text-green-600 dark:text-green-400"
                                              : "text-red-600 dark:text-red-400"
                                          )}>
                                            {transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-'}
                                            ${typeof transaction.amount === 'string' ? transaction.amount : transaction.amount?.toFixed(2) || '0.00'}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-4">
                                      <Clock className="h-8 w-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                                      <p className="text-sm text-gray-500 dark:text-gray-400">{t("noRecentTransactions")}</p>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </>
              ) : (
                /* No Cards State */
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t("noCardsYet")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
                      {t("noCardsDesc")}
                    </p>
                    <Button
                      onClick={() => setLocation("/choose-card")}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t("createFirstCard")}
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </PullToRefresh>
    </div>
  );
}