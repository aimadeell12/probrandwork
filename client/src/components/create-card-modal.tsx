import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { cardApi } from "@/lib/api";
import { CreditCard } from "lucide-react";

interface CreateCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCardModal({ open, onOpenChange }: CreateCardModalProps) {
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

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCardMutation = useMutation({
    mutationFn: (data: typeof formData) => cardApi.createCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "تم إنشاء البطاقة",
        description: "تم إنشاء البطاقة الجديدة بنجاح",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إنشاء البطاقة",
        description: error.message || "فشل في إنشاء البطاقة",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      holderName: "",
      type: "",
      creditLimit: "5000",
      currency: "USD",
      design: "blue",
      internationalEnabled: true,
      onlineEnabled: true,
      notificationsEnabled: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.holderName.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم حامل البطاقة",
        variant: "destructive",
      });
      return;
    }

    if (!formData.type) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى اختيار نوع البطاقة",
        variant: "destructive",
      });
      return;
    }

    createCardMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCardTypeLabel = (type: string) => {
    switch (type) {
      case "credit":
        return "بطاقة ائتمان";
      case "debit":
        return "بطاقة خصم";
      case "prepaid":
        return "بطاقة مسبقة الدفع";
      default:
        return type;
    }
  };

  const getCurrencyLabel = (currency: string) => {
    switch (currency) {
      case "USD":
        return "دولار أمريكي (USD)";
      case "SAR":
        return "ريال سعودي (SAR)";
      case "EUR":
        return "يورو (EUR)";
      default:
        return currency;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            إنشاء بطاقة جديدة
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            أدخل تفاصيل البطاقة الجديدة
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="holderName">اسم حامل البطاقة</Label>
              <Input
                id="holderName"
                value={formData.holderName}
                onChange={(e) => handleInputChange("holderName", e.target.value)}
                placeholder="الاسم الكامل"
                required
                className="form-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">نوع البطاقة</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleInputChange("type", value)}
                required
              >
                <SelectTrigger className="form-select">
                  <SelectValue placeholder="اختر نوع البطاقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">بطاقة ائتمان</SelectItem>
                  <SelectItem value="debit">بطاقة خصم</SelectItem>
                  <SelectItem value="prepaid">بطاقة مسبقة الدفع</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="creditLimit">الحد الائتماني</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="currency">العملة</Label>
              <Select 
                value={formData.currency} 
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger className="form-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                  <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                  <SelectItem value="EUR">يورو (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>تصميم البطاقة</Label>
            <div className="grid grid-cols-3 gap-4">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="cardDesign"
                  value="blue"
                  checked={formData.design === "blue"}
                  onChange={(e) => handleInputChange("design", e.target.value)}
                  className="sr-only"
                />
                <div className={`w-full h-20 card-gradient-blue rounded-xl border-2 transition-colors ${
                  formData.design === "blue" ? "border-primary" : "border-transparent hover:border-primary/50"
                } relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CreditCard className="text-white h-6 w-6" />
                  </div>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="cardDesign"
                  value="green"
                  checked={formData.design === "green"}
                  onChange={(e) => handleInputChange("design", e.target.value)}
                  className="sr-only"
                />
                <div className={`w-full h-20 card-gradient-green rounded-xl border-2 transition-colors ${
                  formData.design === "green" ? "border-secondary" : "border-transparent hover:border-secondary/50"
                } relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CreditCard className="text-white h-6 w-6" />
                  </div>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="cardDesign"
                  value="purple"
                  checked={formData.design === "purple"}
                  onChange={(e) => handleInputChange("design", e.target.value)}
                  className="sr-only"
                />
                <div className={`w-full h-20 card-gradient-purple rounded-xl border-2 transition-colors ${
                  formData.design === "purple" ? "border-purple-500" : "border-transparent hover:border-purple-500/50"
                } relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CreditCard className="text-white h-6 w-6" />
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>إعدادات الأمان</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="international"
                  checked={formData.internationalEnabled}
                  onCheckedChange={(checked) => handleInputChange("internationalEnabled", checked)}
                />
                <Label htmlFor="international" className="text-sm font-normal">
                  تفعيل المعاملات الدولية
                </Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="online"
                  checked={formData.onlineEnabled}
                  onCheckedChange={(checked) => handleInputChange("onlineEnabled", checked)}
                />
                <Label htmlFor="online" className="text-sm font-normal">
                  تفعيل المشتريات أونلاين
                </Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="notifications"
                  checked={formData.notificationsEnabled}
                  onCheckedChange={(checked) => handleInputChange("notificationsEnabled", checked)}
                />
                <Label htmlFor="notifications" className="text-sm font-normal">
                  إشعارات فورية للمعاملات
                </Label>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 space-x-reverse pt-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createCardMutation.isPending}
            >
              {createCardMutation.isPending ? "جاري الإنشاء..." : "إنشاء البطاقة"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
