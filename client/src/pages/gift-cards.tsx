import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Gift, Check, Clock, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GiftCard {
  id: number;
  denomination: number;
  name: string;
}

interface Purchase {
  id: string;
  denomination: string;
  quantity: number;
  totalAmount: string;
  status: string;
  cardNumbers?: string[];
  createdAt: string;
}

export default function GiftCards() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: giftCards = [] } = useQuery<GiftCard[]>({
    queryKey: ["/api/gift-cards"],
  });

  const { data: purchases = [] } = useQuery<Purchase[]>({
    queryKey: ["/api/gift-cards/purchases"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCard) throw new Error("Please select a card");
      const card = giftCards.find(c => c.id === selectedCard);
      if (!card) throw new Error("Card not found");
      return apiRequest("POST", "/api/gift-cards/purchase", {
        denomination: card.denomination,
        quantity: parseInt(quantity.toString()),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Gift card purchase submitted! Admin will provide card numbers soon.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/gift-cards/purchases"] });
      setSelectedCard(null);
      setQuantity(1);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const selectedCardData = giftCards.find(c => c.id === selectedCard);
  const totalCost = selectedCardData ? selectedCardData.denomination * quantity : 0;

  return (
    <div className="min-h-screen bg-[#0f0a19] pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-2xl">Gift Cards</h1>
            <p className="text-gray-400 text-sm">Purchase Visa Gift Cards</p>
          </div>
        </div>

        {/* Available Cards */}
        <div className="mb-8">
          <h2 className="text-white font-semibold mb-4">Available Denominations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {giftCards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCard === card.id
                    ? "border-purple-500 bg-purple-500/20"
                    : "border-gray-700 bg-gray-800/50"
                }`}
              >
                <div className="text-white font-bold text-lg">${card.denomination}</div>
                <div className="text-gray-400 text-xs">Visa Card</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selector */}
        {selectedCard && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
            <label className="text-gray-300 text-sm mb-2 block">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500 text-white hover:bg-purple-500/30"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-center"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500 text-white hover:bg-purple-500/30"
              >
                +
              </button>
            </div>
            <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex justify-between text-white">
                <span>Total Cost:</span>
                <span className="font-bold">${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Button */}
        {selectedCard && (
          <Button
            onClick={() => purchaseMutation.mutate()}
            disabled={purchaseMutation.isPending}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 mb-8"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {purchaseMutation.isPending ? "Processing..." : "Purchase Gift Cards"}
          </Button>
        )}

        {/* Purchase History */}
        {purchases && purchases.length > 0 && (
          <div>
            <h2 className="text-white font-semibold mb-4">Your Purchases</h2>
            <div className="space-y-3">
              {purchases.map((purchase: any) => (
                <div key={purchase.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-white font-semibold">
                          {purchase.quantity}x ${purchase.denomination} Gift Cards
                        </div>
                        <div className="text-gray-400 text-xs">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {purchase.status === "pending" && (
                        <>
                          <Clock className="w-5 h-5 text-yellow-400" />
                          <span className="text-yellow-400 text-sm">Pending</span>
                        </>
                      )}
                      {purchase.status === "completed" && (
                        <>
                          <Check className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 text-sm">Completed</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white font-semibold">${purchase.totalAmount}</span>
                  </div>
                  {purchase.cardNumbers && Array.isArray(purchase.cardNumbers) && purchase.cardNumbers.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="text-gray-400 text-xs mb-2">Card Numbers:</div>
                      {purchase.cardNumbers.map((num: string, idx: number) => (
                        <div key={idx} className="bg-gray-900 rounded p-2 font-mono text-sm text-purple-400 mb-1 break-all">
                          {num}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
