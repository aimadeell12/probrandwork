import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cardApi } from "@/lib/api";
import { CreditCard, Smartphone, Wifi, ShoppingBag, Check, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export default function ChooseCard() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    type: "",
    creditLimit: "5000",
    currency: "USD",
    design: "blue",
    internationalEnabled: true,
    onlineEnabled: true,
    notificationsEnabled: false,
  });

  const [selectedCardType, setSelectedCardType] = useState<"virtual" | "physical" | null>(null);
  const [selectedDesign, setSelectedDesign] = useState("blue");

  const cardDesigns = {
    virtual: [
      { id: "purple", name: "Classic Purple", gradient: "from-primary to-red-700" },
      { id: "purple-pink", name: "Purple Gradient", gradient: "from-red-500 to-pink-500" },
    ],
    physical: [
      { id: "classic-purple", name: "Classic Purple", gradient: "from-primary to-red-700" },
      { id: "premium-purple", name: "Premium Purple", gradient: "from-red-800 to-red-900" },
    ]
  };

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCardMutation = useMutation({
    mutationFn: (data: typeof formData) => cardApi.createCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Card Created",
        description: "Your new card has been created successfully",
      });
      setLocation("/cards");
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Card",
        description: error.message || "Failed to create card",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCardType) {
      toast({
        title: "Selection Required",
        description: "Please choose a card type",
        variant: "destructive",
      });
      return;
    }



    createCardMutation.mutate({
      ...formData,
      type: selectedCardType,
      design: selectedDesign
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const CardDesignPreview = ({ design, type }: { design: any; type: "virtual" | "physical" }) => {
    
    return (
      <div
        className="relative group cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-300"
        onClick={() => setSelectedDesign(design.id)}
      >
        <div className={cn(
          "relative w-full aspect-[1.6/1] rounded-xl p-3 transition-all duration-300 shadow-md",
          `bg-gradient-to-br ${design.gradient}`,
          selectedDesign === design.id ? "ring-2 ring-red-400 ring-offset-1 shadow-lg shadow-red-200" : "hover:shadow-lg hover:shadow-red-100"
        )}>
          {/* Card Icons */}
          <div className="flex justify-between items-start h-full">
            <div className="flex flex-col justify-between h-full">
              {type === "virtual" ? (
                <Smartphone className="w-4 h-4 text-white/90" />
              ) : (
                <CreditCard className="w-4 h-4 text-white/90" />
              )}
              <div className="text-xs font-bold text-white/95">
                {type === "virtual" ? "VIRTUAL" : "PHYSICAL"}
              </div>
            </div>
            <div className="flex flex-col items-end justify-between h-full">
              <Wifi className="w-3 h-3 text-white/70" />
              <div className="text-xs font-semibold text-white/80">BrandSoft Pay</div>
            </div>
          </div>
          
          {/* Selection Indicator */}
          {selectedDesign === design.id && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-red-400 transform scale-100 transition-transform duration-200">
              <Check className="w-3 h-3 text-primary" />
            </div>
          )}
        </div>
        <p className="text-center mt-2 text-xs font-semibold text-gray-800">
          {design.name}
        </p>
      </div>
    );
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <div className="flex-1 px-4 py-4 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (selectedCardType) {
                setSelectedCardType(null);
              } else {
                setLocation("/cards");
              }
            }}
            className="flex items-center gap-2 text-primary hover:text-red-700 hover:bg-red-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-gray-900">
            Create New Card
          </h1>
          <div className="w-8"></div> {/* Spacer for center alignment */}
        </div>

        <div className="flex-1 flex flex-col">
          {/* Step 1: Card Type Selection */}
          {!selectedCardType && (
            <div className="flex-1 flex flex-col">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Choose Card Type</h2>
              </div>
              <div className="flex-1 grid grid-cols-1 gap-4">
                {/* Virtual Card Option */}
                <div
                  className="group relative p-4 bg-white rounded-2xl cursor-pointer hover:shadow-lg hover:shadow-red-200 transition-all duration-300 border border-red-100 hover:border-red-300"
                  onClick={() => setSelectedCardType("virtual")}
                >
                  <div className="relative text-center space-y-3">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                      <Smartphone className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">Virtual Card</h3>
                      <p className="text-sm text-gray-600">
                        Instant digital card for online purchases
                      </p>
                    </div>
                  </div>
                </div>

                {/* Physical Card Option */}
                <div
                  className="group relative p-4 bg-white rounded-2xl cursor-pointer hover:shadow-lg hover:shadow-red-200 transition-all duration-300 border border-red-100 hover:border-red-300"
                  onClick={() => setSelectedCardType("physical")}
                >
                  <div className="relative text-center space-y-3">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-700 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                      <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">Physical Card</h3>
                      <p className="text-sm text-gray-600">
                        Premium card for in-store and ATM transactions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Design Selection */}
          {selectedCardType && (
            <div className="flex-1 flex flex-col">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Choose Design
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {cardDesigns[selectedCardType].map((design) => (
                  <CardDesignPreview
                    key={design.id}
                    design={design}
                    type={selectedCardType}
                  />
                ))}
              </div>

              {/* Step 3: Card Details Form */}
              <div className="bg-white border border-red-100 rounded-2xl p-4 flex-1">
                <h3 className="text-lg font-bold mb-4 text-gray-900 text-center">Card Details</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="creditLimit" className="text-sm">Credit Limit</Label>
                      <Select 
                        value={formData.creditLimit} 
                        onValueChange={(value) => handleInputChange("creditLimit", value)}
                      >
                        <SelectTrigger className="bg-white border-red-200 focus:border-red-500 h-10">
                          <SelectValue placeholder="Select credit limit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1000">$1,000</SelectItem>
                          <SelectItem value="2500">$2,500</SelectItem>
                          <SelectItem value="5000">$5,000</SelectItem>
                          <SelectItem value="10000">$10,000</SelectItem>
                          <SelectItem value="25000">$25,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-sm">Currency</Label>
                      <Select 
                        value={formData.currency} 
                        onValueChange={(value) => handleInputChange("currency", value)}
                      >
                        <SelectTrigger className="bg-white border-red-200 focus:border-red-500 h-10">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="MAD">MAD - Moroccan Dirham</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/cards")}
                      className="flex-1 h-10 border-red-200 text-primary hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createCardMutation.isPending}
                      className="flex-1 h-10 bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-red-800"
                    >
                      {createCardMutation.isPending ? "Creating..." : "Create Card"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}