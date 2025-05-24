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
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8 max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8 pt-12">
          <h1 className="text-xl font-bold text-foreground">Choose Card</h1>
        </div>

        {/* Card Type Selector */}
        <div className="flex bg-muted rounded-full p-0.5 mb-12 max-w-xs mx-auto">
          <button
            onClick={() => setSelectedCardType("virtual")}
            className={cn(
              "flex-1 py-2 px-4 rounded-full text-xs font-medium transition-all",
              selectedCardType === "virtual"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Virtual Card
          </button>
          <button
            onClick={() => setSelectedCardType("physical")}
            className={cn(
              "flex-1 py-2 px-4 rounded-full text-xs font-medium transition-all",
              selectedCardType === "physical"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Physical Card
          </button>
        </div>

        {/* Card Preview */}
        <div className="flex justify-center mb-8">
          <div className="w-48 h-72 card-gradient-blue rounded-2xl relative overflow-hidden shadow-xl">
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
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
            Customizable
          </div>
        </div>

        {/* Card Type Info */}
        <div className="text-center mb-12">
          <h2 className="text-xl font-bold text-foreground mb-2">Virtual Card</h2>
          <p className="text-muted-foreground text-sm">Pay contactless online or in-store</p>
        </div>

        {/* Apply Button */}
        <div className="px-4 mb-8">
          <Button 
            onClick={handleCreateCard}
            disabled={createCardMutation.isPending}
            className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium py-4 rounded-full text-lg"
          >
            {createCardMutation.isPending ? "Creating..." : "Apply Card · 10 USD"}
          </Button>
        </div>

      </div>
    </div>
  );
}