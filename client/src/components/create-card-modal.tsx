import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cardApi } from "@/lib/api";
import { CreditCard, Smartphone, Wifi, ShoppingBag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CreateCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCardModal({ open, onOpenChange }: CreateCardModalProps) {
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
      { id: "purple", name: "Royal Purple", gradient: "from-red-500 to-pink-500" },
      { id: "black", name: "Carbon Black", gradient: "from-gray-800 to-gray-900" },
      { id: "gold", name: "Luxury Gold", gradient: "from-yellow-400 to-orange-500" },
    ],
    physical: [
      { id: "classic", name: "Classic White", gradient: "from-gray-100 to-gray-200" },
      { id: "premium", name: "Premium Black", gradient: "from-gray-900 to-black" },
      { id: "platinum", name: "Platinum Silver", gradient: "from-slate-300 to-slate-400" },
      { id: "rose", name: "Rose Gold", gradient: "from-pink-300 to-rose-400" },
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
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Card",
        description: error.message || "Failed to create card",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      type: "",
      creditLimit: "5000",
      currency: "USD",
      design: "blue",
      internationalEnabled: true,
      onlineEnabled: true,
      notificationsEnabled: false,
    });
    setSelectedCardType(null);
    setSelectedDesign("blue");
  };

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

  const CardDesignPreview = ({ design, type }: { design: any; type: "virtual" | "physical" }) => (
    <motion.div
      className="relative group cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setSelectedDesign(design.id)}
    >
      <div className={cn(
        "relative w-full aspect-[1.6/1] rounded-xl p-4 transition-all duration-300",
        `bg-gradient-to-br ${design.gradient}`,
        selectedDesign === design.id ? "ring-4 ring-red-500 ring-offset-2" : "hover:shadow-lg"
      )}>
        {/* Card Icons */}
        <div className="flex justify-between items-start h-full">
          <div className="flex flex-col justify-between h-full">
            {type === "virtual" ? (
              <Smartphone className="w-6 h-6 text-white/80" />
            ) : (
              <CreditCard className="w-6 h-6 text-white/80" />
            )}
            <div className="text-white/90 text-xs font-medium">
              {type === "virtual" ? "VIRTUAL" : "PHYSICAL"}
            </div>
          </div>
          <div className="flex flex-col items-end justify-between h-full">
            <Wifi className="w-5 h-5 text-white/60" />
            <div className="text-white/70 text-xs">LM WORK MA</div>
          </div>
        </div>
        
        {/* Selection Indicator */}
        {selectedDesign === design.id && (
          <motion.div
            className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <Check className="w-4 h-4 text-primary" />
          </motion.div>
        )}
      </div>
      <p className="text-center mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {design.name}
      </p>
    </motion.div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Create New Card
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Choose your card type and design
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Card Type Selection */}
          {!selectedCardType && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold text-center">Choose Card Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Virtual Card Option */}
                <motion.div
                  className="relative p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-500 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCardType("virtual")}
                >
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg">Virtual Card</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Instant digital card for online purchases and mobile payments
                    </p>
                    <div className="flex justify-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Wifi className="w-3 h-3" />
                        Online
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" />
                        Shopping
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Physical Card Option */}
                <motion.div
                  className="relative p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-500 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCardType("physical")}
                >
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg">Physical Card</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Premium physical card for in-store and ATM transactions
                    </p>
                    <div className="flex justify-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        In-store
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        ATM
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
                  <h3 className="text-lg font-semibold">
                    Choose {selectedCardType === "virtual" ? "Virtual" : "Physical"} Card Design
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCardType(null)}
                  >
                    Back
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={formData.currency} 
                        onValueChange={(value) => handleInputChange("currency", value)}
                        required
                      >
                        <SelectTrigger className="form-select">
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
                      className="form-input"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createCardMutation.isPending}
                      className="bg-gradient-to-r from-primary to-pink-600 hover:from-red-700 hover:to-pink-700"
                    >
                      {createCardMutation.isPending ? "Creating..." : "Create Card"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}