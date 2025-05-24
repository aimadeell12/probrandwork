import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cardApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { CreditCard, Home, TrendingUp, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export default function Cards() {
  const [selectedCardType, setSelectedCardType] = useState<"virtual" | "physical">("virtual");
  const { toast } = useToast();

  const { data: cards, isLoading } = useQuery({
    queryKey: ["/api/cards"],
  });

  const createCardMutation = useMutation({
    mutationFn: (cardData: any) => cardApi.createCard(cardData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Card created successfully",
        description: "Your new card has been created",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create card",
        variant: "destructive",
      });
    },
  });

  const handleCreateCard = () => {
    const cardData = {
      holderName: "Card Holder",
      type: selectedCardType,
      design: "black",
      currency: "USD",
      expiryMonth: 12,
      expiryYear: 2027,
      lastFour: Math.floor(1000 + Math.random() * 9000).toString(),
    };
    
    createCardMutation.mutate(cardData);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8 max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8 pt-12">
          <h1 className="text-xl font-bold text-white">Choose Card</h1>
        </div>

        {/* Card Type Selector */}
        <div className="flex bg-gray-800/50 rounded-full p-1 mb-12">
          <button
            onClick={() => setSelectedCardType("virtual")}
            className={cn(
              "flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all",
              selectedCardType === "virtual"
                ? "bg-white text-black"
                : "text-gray-400"
            )}
          >
            Virtual Card
          </button>
          <button
            onClick={() => setSelectedCardType("physical")}
            className={cn(
              "flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all",
              selectedCardType === "physical"
                ? "bg-white text-black"
                : "text-gray-400"
            )}
          >
            Physical Card
          </button>
        </div>

        {/* Card Preview */}
        <div className="flex justify-center mb-8">
          <div className="w-48 h-72 bg-gray-800 rounded-2xl relative overflow-hidden shadow-xl">
            {/* Card Brand - Vertical Text on Right */}
            <div className="absolute right-4 top-8 bottom-20 flex items-center justify-center">
              <div className="text-white font-bold text-lg tracking-wider transform rotate-90 origin-center whitespace-nowrap">
                prsdoPay
              </div>
            </div>
            
            {/* VISA Logo */}
            <div className="absolute bottom-8 left-6">
              <div className="text-white font-bold text-2xl italic">
                VISA
              </div>
            </div>
          </div>
        </div>

        {/* Customizable Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
            Customizable
          </div>
        </div>

        {/* Card Type Info */}
        <div className="text-center mb-12">
          <h2 className="text-xl font-bold text-white mb-2">Virtual Card</h2>
          <p className="text-gray-400 text-sm">Pay contactless online or in-store 📱</p>
        </div>

        {/* Apply Button */}
        <div className="px-4 mb-8">
          <Button 
            onClick={handleCreateCard}
            disabled={createCardMutation.isPending}
            className="w-full bg-white text-black hover:bg-gray-100 font-medium py-4 rounded-full text-lg"
          >
            {createCardMutation.isPending ? "Creating..." : "Apply Card · 10 USD"}
          </Button>
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-20"></div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
        <div className="flex justify-around py-3">
          <Link href="/" className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
              <Home className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400">Home</span>
          </Link>
          <Link href="/cards" className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-red-400">Card</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400">Benefits</span>
          </Link>
          <Link href="/support" className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
              <Headphones className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400">Hub</span>
          </Link>
        </div>
      </div>
    </div>
  );
}