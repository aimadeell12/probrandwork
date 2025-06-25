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
      { id: "purple", name: "Classic Purple", gradient: "from-purple-600 to-purple-700" },
      { id: "purple-pink", name: "Purple Gradient", gradient: "from-purple-500 to-pink-500" },
      { id: "dark-purple", name: "Dark Purple", gradient: "from-purple-800 to-purple-900" },
      { id: "light-purple", name: "Light Purple", gradient: "from-purple-400 to-purple-500" },
    ],
    physical: [
      { id: "classic-purple", name: "Classic Purple", gradient: "from-purple-600 to-purple-700" },
      { id: "premium-purple", name: "Premium Purple", gradient: "from-purple-800 to-purple-900" },
      { id: "light-purple", name: "Light Purple", gradient: "from-purple-400 to-purple-500 text-white" },
      { id: "gradient-purple", name: "Gradient Purple", gradient: "from-purple-500 to-pink-500" },
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
          "relative w-full aspect-[1.6/1] rounded-2xl p-4 transition-all duration-300 shadow-lg",
          `bg-gradient-to-br ${design.gradient}`,
          selectedDesign === design.id ? "ring-4 ring-purple-400 ring-offset-2 shadow-2xl shadow-purple-200" : "hover:shadow-xl hover:shadow-purple-100"
        )}>
          {/* Card Icons */}
          <div className="flex justify-between items-start h-full">
            <div className="flex flex-col justify-between h-full">
              {type === "virtual" ? (
                <Smartphone className="w-6 h-6 text-white/90" />
              ) : (
                <CreditCard className="w-6 h-6 text-white/90" />
              )}
              <div className="text-xs font-bold text-white/95">
                {type === "virtual" ? "VIRTUAL" : "PHYSICAL"}
              </div>
            </div>
            <div className="flex flex-col items-end justify-between h-full">
              <Wifi className="w-5 h-5 text-white/70" />
              <div className="text-xs font-semibold text-white/80">PAYdota</div>
            </div>
          </div>
          
          {/* Selection Indicator */}
          {selectedDesign === design.id && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-purple-400 transform scale-100 transition-transform duration-200">
              <Check className="w-5 h-5 text-purple-600" />
            </div>
          )}
        </div>
        <p className="text-center mt-3 text-sm font-semibold text-gray-800">
          {design.name}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/cards")}
            className="absolute top-8 left-4 flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Create New Card
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Choose your card type and design to get started
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1: Card Type Selection */}
          {!selectedCardType && (
            <div className="space-y-8 opacity-100 transform translate-y-0 transition-all duration-300">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Choose Card Type</h2>
                <p className="text-gray-600">Select the type of card that best fits your needs</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {/* Virtual Card Option */}
                <div
                  className="group relative p-8 bg-white rounded-3xl cursor-pointer hover:shadow-2xl hover:shadow-purple-200 transition-all duration-300 border border-purple-100 hover:border-purple-300 hover:-translate-y-2"
                  onClick={() => setSelectedCardType("virtual")}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-center space-y-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-200 group-hover:scale-110 transition-transform duration-300">
                      <Smartphone className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-3">Virtual Card</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Instant digital card for online purchases and mobile payments
                      </p>
                    </div>
                    <div className="flex justify-center gap-6 text-sm text-purple-600">
                      <span className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-full">
                        <Wifi className="w-4 h-4" />
                        Online Payments
                      </span>
                      <span className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-full">
                        <ShoppingBag className="w-4 h-4" />
                        E-commerce
                      </span>
                    </div>
                  </div>
                </div>

                {/* Physical Card Option */}
                <div
                  className="group relative p-8 bg-white rounded-3xl cursor-pointer hover:shadow-2xl hover:shadow-purple-200 transition-all duration-300 border border-purple-100 hover:border-purple-300 hover:-translate-y-2"
                  onClick={() => setSelectedCardType("physical")}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-center space-y-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-700 to-purple-800 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-200 group-hover:scale-110 transition-transform duration-300">
                      <CreditCard className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-3">Physical Card</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Premium physical card for in-store and ATM transactions
                      </p>
                    </div>
                    <div className="flex justify-center gap-6 text-sm text-purple-600">
                      <span className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-full">
                        <CreditCard className="w-4 h-4" />
                        In-Store
                      </span>
                      <span className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-full">
                        <ShoppingBag className="w-4 h-4" />
                        ATM Access
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Design Selection */}
          {selectedCardType && (
            <div className="space-y-8 opacity-100 transform translate-y-0 transition-all duration-300">
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCardType(null)}
                  className="mb-6 border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  ← Back to Type Selection
                </Button>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Choose {selectedCardType === "virtual" ? "Virtual" : "Physical"} Card Design
                </h2>
                <p className="text-gray-600">Pick a design that reflects your style</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {cardDesigns[selectedCardType].map((design) => (
                  <CardDesignPreview
                    key={design.id}
                    design={design}
                    type={selectedCardType}
                  />
                ))}
              </div>

              {/* Step 3: Card Details Form */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-purple-100 shadow-2xl shadow-purple-100/50 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-8 text-gray-900 text-center">Card Details</h3>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div className="space-y-2">
                      <Label htmlFor="creditLimit">Credit Limit</Label>
                      <Select 
                        value={formData.creditLimit} 
                        onValueChange={(value) => handleInputChange("creditLimit", value)}
                      >
                        <SelectTrigger className="bg-white border-purple-200 focus:border-purple-500 h-12">
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
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={formData.currency} 
                        onValueChange={(value) => handleInputChange("currency", value)}
                      >
                        <SelectTrigger className="bg-white border-purple-200 focus:border-purple-500 h-12">
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

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/cards")}
                      className="flex-1 h-12 border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createCardMutation.isPending}
                      className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-200"
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