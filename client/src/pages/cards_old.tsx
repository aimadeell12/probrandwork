import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Plus, 
  CreditCard, 
  Eye, 
  EyeOff, 
  Lock, 
  Snowflake, 
  Play, 
  MoreVertical, 
  Settings,
  ArrowLeft,
  Search,
  Filter,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
import { Label } from "@/components/ui/label";
import CreateCardModal from "@/components/create-card-modal";
import { CreditCard as CreditCardComponent } from "@/components/credit-card";
import type { Card } from "shared/schema";

// Transaction List Component
function TransactionList({ cardId }: { cardId: string }) {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['/api/cards', cardId, 'transactions'],
    enabled: !!cardId,
  });

  if (isLoading) {
    return (
      <div className="mt-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="mt-6 text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
          <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">No recent transactions</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Recent Transactions</h4>
        <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
          <TrendingUp className="w-4 h-4 mr-1" />
          View All
        </Button>
      </div>
      {transactions.slice(0, 3).map((transaction: any) => (
        <div key={transaction.id} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                {transaction.description || 'Transaction'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className={cn(
              "font-semibold text-sm",
              transaction.amount > 0 
                ? "text-green-600 dark:text-green-400" 
                : "text-red-600 dark:text-red-400"
            )}>
              {transaction.amount > 0 ? '+' : ''}${(Math.abs(transaction.amount) / 100).toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Cards() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  // State management
  const [showChooseCard, setShowChooseCard] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<"virtual" | "physical">("virtual");
  const [showCardNumbers, setShowCardNumbers] = useState<Record<string, boolean>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [cardToBlock, setCardToBlock] = useState<string | null>(null);
  const [selectedCardForBalance, setSelectedCardForBalance] = useState<Card | null>(null);
  const [balanceAdjustment, setBalanceAdjustment] = useState({ amount: "", operation: "add" as "add" | "subtract" });

  // Fetch cards
  const { data: cards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ['/api/cards'],
  });

  // Mutations
  const freezeCardMutation = useMutation({
    mutationFn: (cardId: string) => apiRequest(`/api/cards/${cardId}/freeze`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      toast({ title: "Card frozen successfully" });
    },
  });

  const activateCardMutation = useMutation({
    mutationFn: (cardId: string) => apiRequest(`/api/cards/${cardId}/activate`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      toast({ title: "Card activated successfully" });
    },
  });

  const blockCardMutation = useMutation({
    mutationFn: (cardId: string) => apiRequest(`/api/cards/${cardId}/block`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      setShowBlockDialog(false);
      setCardToBlock(null);
      toast({ title: "Card blocked successfully" });
    },
  });

  const adjustBalanceMutation = useMutation({
    mutationFn: ({ cardId, amount, operation }: { cardId: string; amount: number; operation: string }) => 
      apiRequest(`/api/cards/${cardId}/adjust-balance`, { 
        method: 'POST', 
        body: { amount, operation } 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      setSelectedCardForBalance(null);
      setBalanceAdjustment({ amount: "", operation: "add" });
      toast({ title: "Balance adjusted successfully" });
    },
  });

  // Helper functions
  const toggleCardVisibility = (cardId: string) => {
    setShowCardNumbers(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const confirmBlockCard = () => {
    if (cardToBlock) {
      blockCardMutation.mutate(cardToBlock);
    }
  };

  const handleBalanceAdjustment = () => {
    if (selectedCardForBalance && balanceAdjustment.amount) {
      adjustBalanceMutation.mutate({
        cardId: selectedCardForBalance.id,
        amount: parseInt(balanceAdjustment.amount) * 100, // Convert to cents
        operation: balanceAdjustment.operation
      });
    }
  };

  const getCardGradient = (design?: string) => {
    switch (design) {
      case "purple":
        return "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800";
      case "blue":
        return "bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-800";
      case "green":
        return "bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800";
      case "pink":
        return "bg-gradient-to-br from-pink-600 via-rose-700 to-purple-800";
      default:
        return "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800";
    }
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

                  {/* Recent Transactions */}
                  <TransactionList cardId={card.id} />
                </div>
              ))}
            </div>
            
            {/* Extra space for bottom navigation */}
            <div className="mb-24"></div>
          </>
        ) : (
          <CreateCardModal 
            open={showCreateModal || showChooseCard} 
            onOpenChange={(open) => {
              setShowCreateModal(open);
              setShowChooseCard(open);
            }} 
          />
        )}

        {/* Block Card Dialog */}
        <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Block Card</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to block this card? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowBlockDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmBlockCard}
                disabled={blockCardMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {blockCardMutation.isPending ? "Blocking..." : "Block Card"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Balance Management Dialog */}
        <Dialog open={!!selectedCardForBalance} onOpenChange={() => {
          setSelectedCardForBalance(null);
          setBalanceAdjustment({ amount: "", operation: "add" });
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Card Balance</DialogTitle>
              <DialogDescription>
                Adjust the balance for this card.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={balanceAdjustment.amount}
                  onChange={(e) => setBalanceAdjustment(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label>Operation</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={balanceAdjustment.operation === "add" ? "default" : "outline"}
                    onClick={() => setBalanceAdjustment(prev => ({ ...prev, operation: "add" }))}
                    className="flex-1"
                  >
                    Add
                  </Button>
                  <Button
                    variant={balanceAdjustment.operation === "subtract" ? "default" : "outline"}
                    onClick={() => setBalanceAdjustment(prev => ({ ...prev, operation: "subtract" }))}
                    className="flex-1"
                  >
                    Subtract
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSelectedCardForBalance(null);
                setBalanceAdjustment({ amount: "", operation: "add" });
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleBalanceAdjustment}
                disabled={adjustBalanceMutation.isPending || !balanceAdjustment.amount}
              >
                {adjustBalanceMutation.isPending ? "Processing..." : `${balanceAdjustment.operation === "add" ? "Add" : "Subtract"} $${balanceAdjustment.amount}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}