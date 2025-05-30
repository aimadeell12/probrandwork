import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cardApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { CreditCard, Plus, Minus, MoreVertical, Settings, Lock, AlertTriangle, Snowflake, Play, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CreateCardModal from "@/components/create-card-modal";
import type { Card } from "shared/schema";

// Transaction List Component
function TransactionList({ cardId }: { cardId: string }) {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["/api/cards", cardId, "transactions"],
    queryFn: async () => {
      const response = await fetch(`/api/cards/${cardId}/transactions`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="mt-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-400">Loading transactions...</div>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="mt-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">No transactions yet</div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white px-2">Recent Transactions</h4>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {transactions.slice(0, 5).map((transaction: any, index: number) => (
          <div key={transaction.id || index} className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-white/40">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.merchant_name || transaction.description || 'Transaction'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date(transaction.created_at || Date.now()).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount / 100).toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {transaction.status || 'completed'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Cards() {
  const { t } = useLanguage();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<"virtual" | "physical">("virtual");
  const [showChooseCard, setShowChooseCard] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [cardToBlock, setCardToBlock] = useState<string>("");
  const [showCardNumbers, setShowCardNumbers] = useState<Record<string, boolean>>({});
  const [selectedCardForBalance, setSelectedCardForBalance] = useState<Card | null>(null);
  const [balanceAdjustment, setBalanceAdjustment] = useState<string>("");
  const [balanceOperation, setBalanceOperation] = useState<"add" | "withdraw">("add");
  const { toast } = useToast();

  const { data: cards = [], isLoading } = useQuery<Card[]>({
    queryKey: ["/api/cards"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const { data: balance = { balance: 0 } } = useQuery({
    queryKey: ["/api/wallet/balance"],
  });



  const activateCardMutation = useMutation({
    mutationFn: (cardId: string) => cardApi.activateCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Card Activated",
        description: "Card activated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to activate card",
        variant: "destructive",
      });
    },
  });

  const blockCardMutation = useMutation({
    mutationFn: (cardId: string) => {
      console.log(`🔒 Frontend: Attempting to block card ${cardId}`);
      return cardApi.blockCard(cardId, "User requested block");
    },
    onSuccess: (data, cardId) => {
      console.log(`✅ Frontend: Block card successful for ${cardId}`, data);
      
      // Update the card status immediately in cache and keep it
      queryClient.setQueryData(["/api/cards"], (oldCards: Card[]) => {
        if (!oldCards) return oldCards;
        return oldCards.map(card => 
          card.id === cardId ? { ...card, status: "blocked" } : card
        );
      });
      
      // Force immediate refresh without delay
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      
      toast({
        title: "Card Blocked",
        description: "Card has been blocked permanently",
      });
    },
    onError: (error) => {
      console.error(`❌ Frontend: Failed to block card`, error);
      toast({
        title: "Error",
        description: "Failed to block card",
        variant: "destructive",
      });
    },
  });

  const freezeCardMutation = useMutation({
    mutationFn: (cardId: string) => cardApi.freezeCard(cardId),
    onSuccess: (data, cardId) => {
      // Update the card status immediately in cache
      queryClient.setQueryData(["/api/cards"], (oldCards: Card[]) => {
        if (!oldCards) return oldCards;
        return oldCards.map(card => 
          card.id === cardId ? { ...card, status: "frozen" } : card
        );
      });
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      }, 1000);
      
      toast({
        title: "Card Frozen",
        description: "Card has been temporarily frozen",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to freeze card",
        variant: "destructive",
      });
    },
  });

  const unfreezeCardMutation = useMutation({
    mutationFn: (cardId: string) => cardApi.unfreezeCard(cardId),
    onSuccess: (data, cardId) => {
      // Update the card status immediately in cache
      queryClient.setQueryData(["/api/cards"], (oldCards: Card[]) => {
        if (!oldCards) return oldCards;
        return oldCards.map(card => 
          card.id === cardId ? { ...card, status: "active" } : card
        );
      });
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      }, 1000);
      
      toast({
        title: "Card Unfrozen",
        description: "Card has been reactivated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unfreeze card",
        variant: "destructive",
      });
    },
  });

  const adjustBalanceMutation = useMutation({
    mutationFn: async ({ cardId, adjustment }: { cardId: string; adjustment: number }) => {
      const response = await fetch(`/api/cards/${cardId}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: adjustment })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Balance Updated",
        description: `Funds ${balanceOperation === "add" ? "added" : "withdrawn"} successfully!`,
      });
      setSelectedCardForBalance(null);
      setBalanceAdjustment("");
    },
    onError: (error: any) => {
      console.error('Balance adjustment error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to adjust card balance",
        variant: "destructive",
      });
    },
  });

  const handleBalanceAdjustment = () => {
    if (!selectedCardForBalance || !balanceAdjustment) return;
    
    const amount = parseFloat(balanceAdjustment);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    // Apply negative for withdrawal operations
    const adjustment = balanceOperation === "withdraw" ? -amount : amount;

    adjustBalanceMutation.mutate({ 
      cardId: selectedCardForBalance.id, 
      adjustment 
    });
  };

  const handleBlockCard = (cardId: string) => {
    setCardToBlock(cardId);
    setShowBlockDialog(true);
  };

  const confirmBlockCard = () => {
    if (cardToBlock) {
      blockCardMutation.mutate(cardToBlock);
      setShowBlockDialog(false);
      setCardToBlock("");
    }
  };

  const createCardMutation = useMutation({
    mutationFn: (cardData: any) => cardApi.createCard(cardData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] });
      setShowChooseCard(false); // Hide choose card view after creation
      toast({
        title: "🎉 Card Created Successfully",
        description: "Your new card is ready to use",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message === "Insufficient balance" 
        ? "Insufficient balance to create this card"
        : "Error occurred while creating card";
      
      toast({
        title: "⚠️ Cannot Create Card",
        description: errorMessage,
        variant: "default",
        duration: 4000,
      });
    },
  });

  const getCardGradient = (design: string) => {
    switch (design) {
      case "green":
        return "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700";
      case "purple":
        return "bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700";
      case "black":
        return "bg-gradient-to-br from-gray-800 via-gray-900 to-black";
      default:
        return "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700";
    }
  };

  const formatCardNumber = (lastFour: string) => {
    return `•••• •••• •••• ${lastFour}`;
  };

  const generateFullCardNumber = (lastFour: string) => {
    // Generate a realistic card number with proper spacing
    const prefix = "4532 1234 5678"; // Visa format for demo
    return `${prefix} ${lastFour}`;
  };

  const handleCreateCard = () => {
    const cardCost = selectedCardType === "virtual" ? 8 : 90;
    
    // Check if user has sufficient balance
    if ((balance as any)?.balance < cardCost) {
      toast({
        title: "💳 Insufficient Balance",
        description: `Need $${cardCost} to create this card\nCurrent balance: $${(balance as any)?.balance || 0}`,
        variant: "default",
        duration: 4000,
      });
      return;
    }

    const userName = (user as any)?.firstName && (user as any)?.lastName 
      ? `${(user as any).firstName} ${(user as any).lastName}`
      : (user as any)?.email?.split('@')[0] || "Card Holder";

    const cardData = {
      holderName: userName,
      type: selectedCardType,
      design: selectedCardType === "virtual" ? "black" : "purple",
      currency: "USD",
      expiryMonth: 12,
      expiryYear: 2028,
      lastFour: Math.floor(1000 + Math.random() * 9000).toString(),
      cost: cardCost,
    };
    
    createCardMutation.mutate(cardData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      
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
                  <div className="relative w-full aspect-[1.6/1] max-w-sm mx-auto">
                    <div className={cn(
                      "absolute inset-0 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300",
                      card.status === "blocked" 
                        ? "grayscale opacity-70" 
                        : card.status === "frozen"
                        ? "opacity-80 blur-[1px]"
                        : "",
                      card.status === "frozen" 
                        ? "bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600"
                        : card.status === "blocked"
                        ? "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600"
                        : getCardGradient(card.design)
                    )}>
                      
                      {/* Blocked overlay */}
                      {card.status === "blocked" && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                          <div className="text-center text-white">
                            <Lock className="h-8 w-8 mx-auto mb-2" />
                            <span className="text-sm font-bold">BLOCKED</span>
                          </div>
                        </div>
                      )}

                      {/* Frozen overlay */}
                      {card.status === "frozen" && (
                        <div className="absolute inset-0 bg-blue-900/30 flex items-center justify-center z-5 pointer-events-none">
                          <div className="text-center text-white">
                            <Snowflake className="h-8 w-8 mx-auto mb-2" />
                            <span className="text-sm font-bold">FROZEN</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Card design elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
                      
                      {/* Card type indicator */}
                      <div className="absolute top-6 left-6">
                        <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-sm"></div>
                      </div>
                      
                      {/* Card actions */}
                      <div className="absolute top-2 right-2 z-20 flex gap-2">
                        {/* Eye button for card number visibility */}
                        <Button
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowCardNumbers(prev => ({
                            ...prev,
                            [card.id]: !prev[card.id]
                          }))}
                          className="text-white hover:bg-white/10"
                        >
                          {showCardNumbers[card.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        
                        {/* Menu button */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </DropdownMenuItem>
                            
                            {/* Show different options based on card status */}
                            {card.status === "blocked" ? (
                              <DropdownMenuItem disabled className="text-gray-400">
                                <Lock className="mr-2 h-4 w-4" />
                                Card Blocked
                              </DropdownMenuItem>
                            ) : card.status === "frozen" ? (
                              <DropdownMenuItem
                                onClick={() => unfreezeCardMutation.mutate(card.id)}
                                className="text-green-600"
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Unfreeze Card
                              </DropdownMenuItem>
                            ) : (
                              <>
                                {/* For active or unspecified status cards */}
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCardForBalance(card);
                                    setBalanceOperation("add");
                                  }}
                                  className="text-green-600"
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Funds
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCardForBalance(card);
                                    setBalanceOperation("withdraw");
                                  }}
                                  className="text-orange-600"
                                >
                                  <Minus className="mr-2 h-4 w-4" />
                                  Withdraw Funds
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => freezeCardMutation.mutate(card.id)}
                                  className="text-blue-600"
                                >
                                  <Snowflake className="mr-2 h-4 w-4" />
                                  Freeze Card
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleBlockCard(card.id)}
                                  className="text-red-600"
                                >
                                  <AlertTriangle className="mr-2 h-4 w-4" />
                                  Block Card
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      

                      
                      {/* Card number - full width */}
                      <div className="absolute top-1/2 left-6 right-6 transform -translate-y-1/2">
                        <div className="text-white font-mono text-lg tracking-widest text-center">
                          {showCardNumbers[card.id] 
                            ? generateFullCardNumber(card.lastFour || "1234")
                            : formatCardNumber(card.lastFour || "1234")
                          }
                        </div>
                      </div>
                      
                      {/* Card details at bottom */}
                      <div className="absolute bottom-6 left-6 right-6 flex justify-between">
                        <div>
                          <div className="text-white/60 text-xs uppercase tracking-wide mb-1">CARDHOLDER</div>
                          <div className="text-white font-medium text-sm uppercase">
                            {(user as any)?.firstName && (user as any)?.lastName 
                              ? `${(user as any).firstName} ${(user as any).lastName}`.toUpperCase()
                              : card.holderName}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white/60 text-xs uppercase tracking-wide mb-1">VALID THRU</div>
                          <div className="text-white font-mono text-sm">
                            {String(card.expiryMonth).padStart(2, '0')}/{String(card.expiryYear).slice(-2)}
                          </div>
                        </div>
                      </div>


                    </div>
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

                  {/* Recent Transactions */}
                  <TransactionList cardId={card.id} />
                </div>
              ))}
            </div>
            
            {/* Extra space for bottom navigation */}
            <div className="mb-24"></div>
          </>
        ) : showChooseCard || cards.length === 0 ? (
          <>
            {/* Header - Choose Card Design */}
            <div className="text-center mb-8 pt-12">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Choose Card</h1>
            </div>

            {/* Card Type Selector */}
            <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-1 mb-12 max-w-xs mx-auto shadow-lg border border-white/30">
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

            {/* Sample Card Display */}
            <div className="mb-8 px-4">
              <div className="relative w-full aspect-[1.6/1] max-w-sm mx-auto">
                {/* Card background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden">
                  
                  {/* Card design elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full blur-lg"></div>
                  
                  {/* Mastercard logo placeholder */}
                  <div className="absolute top-6 left-6">
                    <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-sm"></div>
                  </div>
                  

                </div>
              </div>
            </div>

            {/* Customizable Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                Customizable
              </div>
            </div>

            {/* Card Type Info */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedCardType === "virtual" ? "Virtual Card" : "Physical Card"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Customizable
              </p>
            </div>

            {/* Create Card Button */}
            <div className="px-4 mb-24 pb-8">
              <Button 
                onClick={handleCreateCard}
                disabled={createCardMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
              >
                {createCardMutation.isPending ? "جاري الإنشاء..." : selectedCardType === "virtual" ? "إنشاء بطاقة 8 USD" : "إنشاء بطاقة 90 USD"}
              </Button>
            </div>
          </>
        ) : null}

      </div>

      {/* Create Card Modal */}
      <CreateCardModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      {/* Block Card Confirmation Dialog */}
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-800">
          <AlertDialogHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Block Card Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
              <div className="font-medium text-red-600 dark:text-red-400 mb-3">
                ⚠️ This action cannot be easily reversed!
              </div>
              <div className="text-left space-y-2 bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Your card will be disabled immediately</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>No transactions will be possible</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>You'll need to contact support to reactivate</span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
            <AlertDialogCancel 
              onClick={() => setShowBlockDialog(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBlockCard}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={blockCardMutation.isPending}
            >
              {blockCardMutation.isPending ? "Blocking..." : "Yes, Block Card"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Balance Management Dialog */}
      <Dialog open={!!selectedCardForBalance} onOpenChange={() => {
        setSelectedCardForBalance(null);
        setBalanceAdjustment("");
      }}>
        <DialogContent className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {balanceOperation === "add" ? "Add Funds" : "Withdraw Funds"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              {balanceOperation === "add" 
                ? "Add funds to your card balance" 
                : "Withdraw funds from your card balance"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adjustment">Amount (USD)</Label>
              <Input
                id="adjustment"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Enter amount (e.g., 100)"
                value={balanceAdjustment}
                onChange={(e) => setBalanceAdjustment(e.target.value)}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {balanceOperation === "add" 
                  ? "Funds will be added to your card balance" 
                  : "Funds will be withdrawn from your card balance"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCardForBalance(null);
                setBalanceAdjustment("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBalanceAdjustment}
              disabled={adjustBalanceMutation.isPending || !balanceAdjustment}
              className={balanceOperation === "add" 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-orange-600 hover:bg-orange-700"}
            >
              {adjustBalanceMutation.isPending 
                ? "Processing..." 
                : balanceOperation === "add" 
                  ? "Add Funds" 
                  : "Withdraw Funds"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}