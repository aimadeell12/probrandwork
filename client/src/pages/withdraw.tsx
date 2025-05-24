import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowDown, Building2, CreditCard, Landmark, Wallet } from "lucide-react";
import { Link } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";

const withdrawalMethods = [
  {
    id: "bank_transfer",
    name: "تحويل بنكي",
    icon: Landmark,
    description: "تحويل إلى حساب بنكي",
    fee: "2.99",
    processingTime: "1-3 أيام عمل",
  },
  {
    id: "instant_transfer",
    name: "تحويل فوري",
    icon: ArrowDown,
    description: "تحويل فوري إلى البنك",
    fee: "4.99",
    processingTime: "خلال دقائق",
  },
  {
    id: "atm_withdrawal",
    name: "سحب من الصراف",
    icon: Building2,
    description: "سحب نقدي من أي صراف آلي",
    fee: "1.50",
    processingTime: "فوري",
  },
];

export default function Withdraw() {
  const [formData, setFormData] = useState({
    selectedCard: "",
    amount: "",
    withdrawalMethod: "",
    bankAccount: "",
    description: "",
  });
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  // Get user's cards
  const { data: cards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ["/api/cards"],
  });

  const typedCards = cards as Array<{
    id: string;
    lastFour: string;
    balance: number;
    [key: string]: any;
  }>;

  const withdrawMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/transactions/withdraw", {
        method: "POST",
        body: JSON.stringify({
          cardId: data.selectedCard,
          amount: parseFloat(data.amount),
          withdrawalMethod: data.withdrawalMethod,
          bankAccount: data.bankAccount,
          description: data.description,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في سحب المبلغ");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "تم طلب السحب بنجاح",
        description: "سيتم معالجة طلب السحب وفقاً للطريقة المختارة",
      });
      setFormData({
        selectedCard: "",
        amount: "",
        withdrawalMethod: "",
        bankAccount: "",
        description: "",
      });
      setSelectedMethod(null);
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في سحب المبلغ",
        description: error.message || "حاول مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedCard || !formData.amount || !formData.withdrawalMethod) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال جميع البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "مبلغ غير صحيح",
        description: "يرجى إدخال مبلغ صحيح",
        variant: "destructive",
      });
      return;
    }

    // Check if bank account is required for bank transfers
    if ((formData.withdrawalMethod === "bank_transfer" || formData.withdrawalMethod === "instant_transfer") && !formData.bankAccount) {
      toast({
        title: "رقم الحساب مطلوب",
        description: "يرجى إدخال رقم الحساب البنكي",
        variant: "destructive",
      });
      return;
    }

    withdrawMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMethodSelect = (methodId: string) => {
    const method = withdrawalMethods.find(m => m.id === methodId);
    setSelectedMethod(method);
    handleInputChange("withdrawalMethod", methodId);
  };

  const calculateFee = () => {
    if (!selectedMethod || !formData.amount) return 0;
    const amount = parseFloat(formData.amount);
    const fee = parseFloat(selectedMethod.fee);
    return isNaN(amount) ? 0 : fee;
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const fee = calculateFee();
    return amount - fee; // Total received after fee deduction
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/wallet">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold mr-4">سحب مبلغ</h1>
        </div>

        <Card className="banking-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              سحب أموال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Card */}
              <div className="space-y-2">
                <Label>البطاقة المسحوب منها</Label>
                <Select 
                  value={formData.selectedCard} 
                  onValueChange={(value) => handleInputChange("selectedCard", value)}
                  disabled={cardsLoading || withdrawMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر البطاقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {typedCards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
                          <span>**** {card.lastFour}</span>
                          <span className="text-sm text-muted-foreground">
                            ${card.balance?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">المبلغ (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="0.00"
                  className="form-input text-lg font-semibold"
                  disabled={withdrawMutation.isPending}
                  required
                />
              </div>

              {/* Withdrawal Method */}
              <div className="space-y-3">
                <Label>طريقة السحب</Label>
                <div className="space-y-2">
                  {withdrawalMethods.map((method) => {
                    const IconComponent = method.icon;
                    const isSelected = formData.withdrawalMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleMethodSelect(method.id)}
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent className={`h-5 w-5 mt-1 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{method.name}</h3>
                              <span className="text-sm text-muted-foreground">${method.fee}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                            <p className="text-xs text-primary mt-1">{method.processingTime}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bank Account (if bank transfer selected) */}
              {(formData.withdrawalMethod === "bank_transfer" || formData.withdrawalMethod === "instant_transfer") && (
                <div className="space-y-2">
                  <Label htmlFor="bankAccount">رقم الحساب البنكي</Label>
                  <Input
                    id="bankAccount"
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) => handleInputChange("bankAccount", e.target.value)}
                    placeholder="SA1234567890123456789012"
                    className="form-input"
                    disabled={withdrawMutation.isPending}
                    required
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">وصف السحب (اختياري)</Label>
                <Input
                  id="description"
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="سبب السحب..."
                  className="form-input"
                  disabled={withdrawMutation.isPending}
                />
              </div>

              {/* Summary */}
              {formData.amount && selectedMethod && (
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>المبلغ المطلوب</span>
                    <span>${parseFloat(formData.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>رسوم {selectedMethod.name}</span>
                    <span>-${calculateFee().toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>المبلغ المستلم</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={withdrawMutation.isPending || cardsLoading}
              >
                {withdrawMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جارٍ المعالجة...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-4 w-4" />
                    تأكيد السحب
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Withdrawal Limits */}
        <Card className="banking-shadow mt-6">
          <CardHeader>
            <CardTitle className="text-sm">حدود السحب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>الحد اليومي</span>
              <span>$5,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>الحد الشهري</span>
              <span>$50,000</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>تم استخدامه اليوم</span>
              <span>$0</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}