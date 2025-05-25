import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send as SendIcon, User, Phone, CreditCard } from "lucide-react";
import { Link } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";

export default function Send() {
  const [formData, setFormData] = useState({
    recipientType: "phone", // phone, username, cardNumber
    recipient: "",
    amount: "",
    description: "",
    selectedCard: "",
  });
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

  const sendMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/transactions/send", {
        method: "POST",
        body: JSON.stringify({
          recipientType: data.recipientType,
          recipient: data.recipient,
          amount: parseFloat(data.amount),
          description: data.description,
          cardId: data.selectedCard,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في إرسال المبلغ");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "تم إرسال المبلغ بنجاح",
        description: "تم تحويل المبلغ إلى المستلم",
      });
      setFormData({
        recipientType: "phone",
        recipient: "",
        amount: "",
        description: "",
        selectedCard: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إرسال المبلغ",
        description: error.message || "حاول مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipient.trim() || !formData.amount.trim() || !formData.selectedCard) {
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

    sendMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRecipientIcon = () => {
    switch (formData.recipientType) {
      case "phone": return <Phone className="h-4 w-4" />;
      case "username": return <User className="h-4 w-4" />;
      case "cardNumber": return <CreditCard className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRecipientPlaceholder = () => {
    switch (formData.recipientType) {
      case "phone": return "رقم الهاتف (مثل: +966501234567)";
      case "username": return "اسم المستخدم";
      case "cardNumber": return "رقم البطاقة";
      default: return "المستلم";
    }
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
          <h1 className="text-xl font-semibold mr-4">{t("sendPageTitle")}</h1>
        </div>

        <Card className="banking-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SendIcon className="h-5 w-5 text-primary" />
              إرسال أموال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Card */}
              <div className="space-y-2">
                <Label>البطاقة المرسلة</Label>
                <Select 
                  value={formData.selectedCard} 
                  onValueChange={(value) => handleInputChange("selectedCard", value)}
                  disabled={cardsLoading || sendMutation.isPending}
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

              {/* Recipient Type */}
              <div className="space-y-2">
                <Label>نوع المستلم</Label>
                <Select 
                  value={formData.recipientType} 
                  onValueChange={(value) => handleInputChange("recipientType", value)}
                  disabled={sendMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        رقم الهاتف
                      </div>
                    </SelectItem>
                    <SelectItem value="username">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        اسم المستخدم
                      </div>
                    </SelectItem>
                    <SelectItem value="cardNumber">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        رقم البطاقة
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Recipient */}
              <div className="space-y-2">
                <Label htmlFor="recipient">المستلم</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {getRecipientIcon()}
                  </div>
                  <Input
                    id="recipient"
                    type="text"
                    value={formData.recipient}
                    onChange={(e) => handleInputChange("recipient", e.target.value)}
                    placeholder={getRecipientPlaceholder()}
                    className="form-input pr-10"
                    disabled={sendMutation.isPending}
                    required
                  />
                </div>
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
                  disabled={sendMutation.isPending}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">وصف التحويل (اختياري)</Label>
                <Input
                  id="description"
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="مثل: دفع الفاتورة، هدية..."
                  className="form-input"
                  disabled={sendMutation.isPending}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={sendMutation.isPending || cardsLoading}
              >
                {sendMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جارٍ الإرسال...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <SendIcon className="h-4 w-4" />
                    إرسال المبلغ
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Recipients */}
        <Card className="banking-shadow mt-6">
          <CardHeader>
            <CardTitle className="text-sm">مستلمون سابقون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">لا توجد تحويلات سابقة</p>
              <p className="text-xs">ستظهر جهات الاتصال المستخدمة هنا</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}