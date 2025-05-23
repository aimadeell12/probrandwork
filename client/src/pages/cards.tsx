import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cardApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { CreditCard, Smartphone, CheckCircle, Home, MapPin, Gift, Grid3x3 } from "lucide-react";
import { cn } from "@/lib/utils";

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
        title: "تم إنشاء البطاقة بنجاح",
        description: "تم إنشاء بطاقتك الجديدة",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء البطاقة",
        variant: "destructive",
      });
    },
  });

  const handleCreateCard = () => {
    const cardData = {
      holderName: "Card Holder",
      type: selectedCardType === "virtual" ? "virtual" : "physical",
      design: "black",
      currency: "USD",
      expiryMonth: 12,
      expiryYear: 2027,
      lastFour: Math.floor(1000 + Math.random() * 9000).toString(),
    };
    
    createCardMutation.mutate(cardData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Choose Card</h1>
        </div>

        {/* Card Type Selector */}
        <div className="flex mb-8 bg-gray-900 rounded-full p-1">
          <button
            onClick={() => setSelectedCardType("virtual")}
            className={cn(
              "flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all",
              selectedCardType === "virtual"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            )}
          >
            Virtual Card
          </button>
          <button
            onClick={() => setSelectedCardType("physical")}
            className={cn(
              "flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all",
              selectedCardType === "physical"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            )}
          >
            Physical Card
          </button>
        </div>

        {/* Card Preview */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 aspect-[1.6/1] relative overflow-hidden">
            {/* Card Brand */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90">
              <div className="text-white font-bold text-lg tracking-wider opacity-80">
                predoPay
              </div>
            </div>
            
            {/* Visa Logo */}
            <div className="absolute bottom-6 left-6">
              <div className="text-white font-bold text-2xl tracking-wider">
                VISA
              </div>
            </div>
            
            {/* Chip simulation */}
            <div className="absolute top-6 left-6 w-8 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded opacity-80"></div>
          </div>

          {/* Customizable Badge */}
          <div className="flex items-center justify-center mt-4 gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Customizable</span>
          </div>
        </div>

        {/* Card Info */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold mb-2">
            {selectedCardType === "virtual" ? "Virtual Card" : "Physical Card"}
          </h2>
          <p className="text-gray-400 text-sm">
            {selectedCardType === "virtual" 
              ? "Pay contactless online or in-store"
              : "Physical card for ATM and in-store purchases"
            }
          </p>
        </div>

        {/* Apply Button */}
        <Button 
          onClick={handleCreateCard}
          disabled={createCardMutation.isPending}
          className="w-full bg-white text-black hover:bg-gray-100 font-medium py-4 rounded-full text-lg mb-8"
        >
          {createCardMutation.isPending ? "Creating..." : "Apply Card • 10 USD"}
        </Button>

        {/* Existing Cards */}
        {cards && cards.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">Your Cards</h3>
            <div className="space-y-4">
              {cards.map((card: any) => (
                <Card key={card.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {card.type === "virtual" ? (
                          <Smartphone className="w-5 h-5 text-blue-500" />
                        ) : (
                          <CreditCard className="w-5 h-5 text-green-500" />
                        )}
                        <div>
                          <p className="font-medium text-white">
                            {card.type === "virtual" ? "Virtual Card" : "Physical Card"}
                          </p>
                          <p className="text-sm text-gray-400">**** {card.lastFour}</p>
                        </div>
                      </div>
                      <Badge variant={card.status === 'active' ? 'default' : 'secondary'}>
                        {card.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : null}
                        {card.status === 'active' ? 'Active' : 'Pending'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
          <div className="flex justify-around py-3">
            <div className="flex flex-col items-center gap-1">
              <Home className="w-5 h-5 text-gray-500" />
              <span className="text-xs text-gray-500">Home</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CreditCard className="w-5 h-5 text-red-500" />
              <span className="text-xs text-red-500">Card</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Gift className="w-5 h-5 text-gray-500" />
              <span className="text-xs text-gray-500">Benefits</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Grid3x3 className="w-5 h-5 text-gray-500" />
              <span className="text-xs text-gray-500">Hub</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
