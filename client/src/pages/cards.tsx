import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cardApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { CreditCard, Home, TrendingUp, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";

export default function Cards() {
  const { t } = useLanguage();
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
        title: t("cardCreated"),
        description: t("cardCreated"),
      });
    },
    onError: () => {
      toast({
        title: t("error"),
        description: t("cardCreationError"),
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 py-8 max-w-md relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8 pt-12">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">اختر البطاقة</h1>
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
            {t("virtualCard")}
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
            {t("physicalCard")}
          </button>
        </div>

        {/* Card Preview */}
        <div className="flex justify-center mb-8">
          <div className="w-48 h-72 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl relative overflow-hidden shadow-2xl">
            
            {/* Card background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-slate-900/80 rounded-2xl"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl"></div>
            
            {/* Card Brand - Vertical Text on Right */}
            <div className="absolute right-4 top-8 bottom-20 flex items-center justify-center z-10">
              <div className="text-white font-bold text-lg tracking-wider transform rotate-90 origin-center whitespace-nowrap">
                DIGITAL
              </div>
            </div>
            
            {/* EMV chip simulation */}
            <div className="absolute top-16 left-6 w-8 h-6 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md shadow-inner z-10"></div>
            
            {/* Card number */}
            <div className="absolute top-32 left-6 text-white font-mono text-sm font-semibold tracking-widest z-10">
              4532 1234 5678
            </div>
            
            {/* VISA Logo */}
            <div className="absolute bottom-8 left-6 z-10">
              <div className="text-white font-bold text-2xl italic">
                VISA
              </div>
            </div>
            
            {/* Card details */}
            <div className="absolute bottom-16 left-6 right-6 flex justify-between z-10">
              <div>
                <div className="text-gray-300 text-xs uppercase tracking-wide mb-1">Valid Thru</div>
                <div className="text-white font-semibold text-sm">12/28</div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold text-sm">CARD HOLDER</div>
              </div>
            </div>
          </div>
        </div>

        {/* Customizable Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
            {t("customizable")}
          </div>
        </div>

        {/* Card Type Info */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {selectedCardType === "virtual" ? t("virtualCard") : t("physicalCard")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t("customizable")}
          </p>
        </div>

        {/* Apply Button */}
        <div className="px-4 mb-8">
          <Button 
            onClick={handleCreateCard}
            disabled={createCardMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
          >
            {createCardMutation.isPending ? t("processingWithdraw") : t("createCard")}
          </Button>
        </div>

      </div>
    </div>
  );
}