
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, UserPlus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const countryCodes = [
  { code: "+966", country: "السعودية 🇸🇦" },
  { code: "+971", country: "الإمارات 🇦🇪" },
  { code: "+974", country: "قطر 🇶🇦" },
  { code: "+973", country: "البحرين 🇧🇭" },
  { code: "+965", country: "الكويت 🇰🇼" },
  { code: "+968", country: "عمان 🇴🇲" },
  { code: "+20", country: "مصر 🇪🇬" },
  { code: "+962", country: "الأردن 🇯🇴" },
  { code: "+961", country: "لبنان 🇱🇧" },
  { code: "+963", country: "سوريا 🇸🇾" },
  { code: "+967", country: "اليمن 🇾🇪" },
  { code: "+964", country: "العراق 🇮🇶" },
  { code: "+213", country: "الجزائر 🇩🇿" },
  { code: "+216", country: "تونس 🇹🇳" },
  { code: "+212", country: "المغرب 🇲🇦" },
  { code: "+218", country: "ليبيا 🇱🇾" },
  { code: "+249", country: "السودان 🇸🇩" },
  { code: "+970", country: "فلسطين 🇵🇸" },
  { code: "+972", country: "إسرائيل 🇮🇱" },
  { code: "+251", country: "إثيوبيا 🇪🇹" },
  { code: "+254", country: "كينيا 🇰🇪" },
  { code: "+234", country: "نيجيريا 🇳🇬" },
  { code: "+27", country: "جنوب أفريقيا 🇿🇦" },
  { code: "+91", country: "الهند 🇮🇳" },
  { code: "+92", country: "باكستان 🇵🇰" },
  { code: "+98", country: "إيران 🇮🇷" },
  { code: "+90", country: "تركيا 🇹🇷" },
  { code: "+60", country: "ماليزيا 🇲🇾" },
  { code: "+62", country: "إندونيسيا 🇮🇩" },
  { code: "+63", country: "الفلبين 🇵🇭" },
  { code: "+66", country: "تايلاند 🇹🇭" },
  { code: "+86", country: "الصين 🇨🇳" },
  { code: "+81", country: "اليابان 🇯🇵" },
  { code: "+82", country: "كوريا الجنوبية 🇰🇷" },
  { code: "+1", country: "الولايات المتحدة/كندا 🇺🇸🇨🇦" },
  { code: "+52", country: "المكسيك 🇲🇽" },
  { code: "+55", country: "البرازيل 🇧🇷" },
  { code: "+54", country: "الأرجنتين 🇦🇷" },
  { code: "+44", country: "المملكة المتحدة 🇬🇧" },
  { code: "+33", country: "فرنسا 🇫🇷" },
  { code: "+49", country: "ألمانيا 🇩🇪" },
  { code: "+39", country: "إيطاليا 🇮🇹" },
  { code: "+34", country: "إسبانيا 🇪🇸" },
  { code: "+31", country: "هولندا 🇳🇱" },
  { code: "+32", country: "بلجيكا 🇧🇪" },
  { code: "+41", country: "سويسرا 🇨🇭" },
  { code: "+46", country: "السويد 🇸🇪" },
  { code: "+47", country: "النرويج 🇳🇴" },
  { code: "+45", country: "الدنمارك 🇩🇰" },
  { code: "+358", country: "فنلندا 🇫🇮" },
  { code: "+7", country: "روسيا 🇷🇺" },
  { code: "+380", country: "أوكرانيا 🇺🇦" },
  { code: "+48", country: "بولندا 🇵🇱" },
  { code: "+36", country: "المجر 🇭🇺" },
  { code: "+43", country: "النمسا 🇦🇹" },
  { code: "+30", country: "اليونان 🇬🇷" },
  { code: "+351", country: "البرتغال 🇵🇹" },
  { code: "+61", country: "أستراليا 🇦🇺" },
  { code: "+64", country: "نيوزيلندا 🇳🇿" },
  { code: "+27", country: "جنوب أفريقيا 🇿🇦" },
  { code: "+971", country: "الإمارات العربية المتحدة 🇦🇪" },
];

export default function Register() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    countryCode: "+966",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: async (data: { 
      username: string;
      password: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
    }) => {
      const phone = data.phone ? `${formData.countryCode}${data.phone}` : undefined;
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          phone
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في إنشاء الحساب");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في منصة البطاقات المصرفية",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message || "حاول مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال اسم المستخدم وكلمة المرور",
        variant: "destructive",
      });
      return;
    }
    
    const registerData = {
      username: formData.username,
      password: formData.password,
      email: formData.email || undefined,
      firstName: formData.firstName || undefined,
      lastName: formData.lastName || undefined,
      phone: formData.phoneNumber || undefined,
    };
    
    registerMutation.mutate(registerData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CreditCard className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">منصة البطاقات المصرفية</h1>
          <p className="text-muted-foreground">أنشئ حساباً جديداً للانضمام إلينا</p>
        </div>

        <Card className="banking-shadow">
          <CardHeader>
            <CardTitle className="text-center text-xl">إنشاء حساب جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* الاسم الشخصي والعائلي */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="الاسم الأول"
                    className="form-input"
                    disabled={registerMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">الاسم العائلي</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="الاسم العائلي"
                    className="form-input"
                    disabled={registerMutation.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  required
                  className="form-input"
                  disabled={registerMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="أدخل البريد الإلكتروني"
                  className="form-input"
                  disabled={registerMutation.isPending}
                />
              </div>

              {/* رقم الهاتف مع رمز الدولة */}
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.countryCode}
                    onValueChange={(value) => handleInputChange("countryCode", value)}
                  >
                    <SelectTrigger className="w-[110px] flex-shrink-0">
                      <SelectValue placeholder="+966" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.code} {country.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="رقم الهاتف"
                    className="form-input"
                    disabled={registerMutation.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  required
                  className="form-input"
                  disabled={registerMutation.isPending}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={registerMutation.isPending}
              >
                <UserPlus className="ml-2 h-4 w-4" />
                {registerMutation.isPending ? "جاري إنشاء الحساب..." : "إنشاء حساب جديد"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                لديك حساب بالفعل؟ 
                <Link href="/login" className="text-primary hover:underline mr-1">
                  سجل الدخول
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © 2024 منصة البطاقات المصرفية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  );
}
