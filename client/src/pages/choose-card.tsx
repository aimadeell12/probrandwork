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
      { id: "blue", name: "Ocean Blue", gradient: "from-blue-500 to-cyan-500" },
      { id: "purple", name: "Royal Purple", gradient: "from-purple-500 to-pink-500" },
      { id: "black", name: "Carbon Black", gradient: "from-gray-800 to-gray-900" },
      { id: "gold", name: "Luxury Gold", gradient: "from-yellow-400 to-orange-500" },
    ],
    physical: [
      { id: "classic", name: "Classic White", gradient: "from-gray-100 to-gray-200 text-gray-800" },
      { id: "premium", name: "Premium Black", gradient: "from-gray-900 to-black" },
      { id: "platinum", name: "Platinum Silver", gradient: "from-slate-300 to-slate-400 text-gray-800" },
      { id: "rose", name: "Rose Gold", gradient: "from-pink-300 to-rose-400 text-gray-800" },
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
    const isLight = design.gradient.includes("gray-100") || design.gradient.includes("slate-300") || design.gradient.includes("pink-300");
    
    return (
      <div
        className="relative group cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200"
        onClick={() => setSelectedDesign(design.id)}
      >
        <div className={cn(
          "relative w-full aspect-[1.6/1] rounded-xl p-4 transition-all duration-300",
          `bg-gradient-to-br ${design.gradient}`,
          selectedDesign === design.id ? "ring-4 ring-purple-500 ring-offset-2" : "hover:shadow-lg"
        )}>
          {/* Card Icons */}
          <div className="flex justify-between items-start h-full">
            <div className="flex flex-col justify-between h-full">
              {type === "virtual" ? (
                <Smartphone className={cn("w-6 h-6", isLight ? "text-gray-700" : "text-white/80")} />
              ) : (
                <CreditCard className={cn("w-6 h-6", isLight ? "text-gray-700" : "text-white/80")} />
              )}
              <div className={cn("text-xs font-medium", isLight ? "text-gray-800" : "text-white/90")}>
                {type === "virtual" ? "VIRTUAL" : "PHYSICAL"}
              </div>
            </div>
            <div className="flex flex-col items-end justify-between h-full">
              <Wifi className={cn("w-5 h-5", isLight ? "text-gray-600" : "text-white/60")} />
              <div className={cn("text-xs", isLight ? "text-gray-700" : "text-white/70")}>PAYdota</div>
            </div>
          </div>
          
          {/* Selection Indicator */}
          {selectedDesign === design.id && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center transform scale-100 transition-transform duration-200">
              <Check className="w-4 h-4 text-purple-600" />
            </div>
          )}
        </div>
        <p className="text-center mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {design.name}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-purple-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/cards")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Create New Card
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Choose your card type and design
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Step 1: Card Type Selection */}
          {!selectedCardType && (
            <div className="space-y-6 opacity-100 transform translate-y-0 transition-all duration-300">
              <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white">Choose Card Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Virtual Card Option */}
                <div
                  className="relative p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 transition-colors bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:scale-102 transition-transform duration-200"
                  onClick={() => setSelectedCardType("virtual")}
                >
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Virtual Card</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Instant digital card for online purchases and mobile payments
                    </p>
                    <div className="flex justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-2">
                        <Wifi className="w-4 h-4" />
                        Online Payments
                      </span>
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        E-commerce
                      </span>
                    </div>
                  </div>
                </div>

                {/* Physical Card Option */}
                <div
                  className="relative p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 transition-colors bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:scale-102 transition-transform duration-200"
                  onClick={() => setSelectedCardType("physical")}
                >
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Physical Card</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Premium physical card for in-store and ATM transactions
                    </p>
                    <div className="flex justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        In-Store
                      </span>
                      <span className="flex items-center gap-2">
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
            <div className="space-y-6 opacity-100 transform translate-y-0 transition-all duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Choose {selectedCardType === "virtual" ? "Virtual" : "Physical"} Card Design
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCardType(null)}
                >
                  Back to Type Selection
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cardDesigns[selectedCardType].map((design) => (
                  <CardDesignPreview
                    key={design.id}
                    design={design}
                    type={selectedCardType}
                  />
                ))}
              </div>

              {/* Step 3: Card Details Form */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Card Details</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="space-y-2">
                      <Label htmlFor="creditLimit">Credit Limit</Label>
                      <Select 
                        value={formData.creditLimit} 
                        onValueChange={(value) => handleInputChange("creditLimit", value)}
                      >
                        <SelectTrigger className="bg-white/50 dark:bg-gray-900/50">
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
                        <SelectTrigger className="bg-white/50 dark:bg-gray-900/50">
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

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/cards")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createCardMutation.isPending}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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