import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cardApi } from "@/lib/api";
import { CreditCard, Smartphone, Wifi, ShoppingBag, Check, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export default function ChooseCard() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    holderName: "",
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

    if (!formData.holderName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter cardholder name",
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
      <motion.div
        className="relative group cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
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
            <motion.div
              className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Check className="w-4 h-4 text-purple-600" />
            </motion.div>
          )}
        </div>
        <p className="text-center mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {design.name}
        </p>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-purple-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div 
        className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
        </motion.div>

        <div className="space-y-8">
          {/* Step 1: Card Type Selection */}
          {!selectedCardType && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white">Choose Card Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Virtual Card Option */}
                <motion.div
                  className="relative p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 transition-colors bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                </motion.div>

                {/* Physical Card Option */}
                <motion.div
                  className="relative p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 transition-colors bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                        In-store Payments
                      </span>
                      <span className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        ATM Withdrawals
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Design Selection */}
          {selectedCardType && (
            <AnimatePresence mode="wait">
              <motion.div
                key="design-selection"
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
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

                {/* Card Details Form */}
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-white/30 dark:border-gray-700/30">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Card Details</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="holderName">Cardholder Name</Label>
                        <Input
                          id="holderName"
                          value={formData.holderName}
                          onChange={(e) => handleInputChange("holderName", e.target.value)}
                          placeholder="Full Name"
                          required
                          className="bg-white/80 dark:bg-gray-700/80"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select 
                          value={formData.currency} 
                          onValueChange={(value) => handleInputChange("currency", value)}
                          required
                        >
                          <SelectTrigger className="bg-white/80 dark:bg-gray-700/80">
                            <SelectValue placeholder="Select Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">US Dollar (USD)</SelectItem>
                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                            <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                            <SelectItem value="SAR">Saudi Riyal (SAR)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="creditLimit">Credit Limit</Label>
                      <Input
                        id="creditLimit"
                        type="number"
                        value={formData.creditLimit}
                        onChange={(e) => handleInputChange("creditLimit", e.target.value)}
                        placeholder="5000"
                        min="100"
                        max="100000"
                        required
                        className="bg-white/80 dark:bg-gray-700/80"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
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
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}