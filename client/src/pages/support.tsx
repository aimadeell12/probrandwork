import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supportApi } from "@/lib/api";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Book, 
  Video, 
  Shield,
  Clock,
  Headphones,
  CheckCircle,
  Home,
  CreditCard,
  TrendingUp
} from "lucide-react";

export default function Support() {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tickets } = useQuery({
    queryKey: ["/api/support/tickets"],
  });

  const createTicketMutation = useMutation({
    mutationFn: (data: { subject: string; message: string }) => supportApi.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets"] });
      toast({
        title: "تم إنشاء التذكرة",
        description: "سيتم الرد عليك في أقرب وقت ممكن",
      });
      setSubject("");
      setMessage("");
      setShowTicketForm(false);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء تذكرة الدعم",
        variant: "destructive",
      });
    },
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    
    createTicketMutation.mutate({
      subject: subject.trim(),
      message: message.trim(),
    });
  };

  const faqItems = [
    {
      question: "كيف يمكنني إنشاء بطاقة جديدة؟",
      answer: "يمكنك إنشاء بطاقة جديدة من خلال لوحة التحكم بالضغط على زر \"إنشاء بطاقة جديدة\" واتباع الخطوات البسيطة."
    },
    {
      question: "ما هي حدود الإنفاق اليومية؟",
      answer: "الحد الافتراضي للإنفاق اليومي هو $5,000 ويمكن تعديله حسب احتياجاتك من إعدادات البطاقة."
    },
    {
      question: "كيف يمكنني تجميد بطاقتي؟",
      answer: "اذهب إلى صفحة البطاقات، اختر البطاقة المطلوبة، ثم اضغط على \"تجميد\" لإيقاف جميع المعاملات فوراً."
    },
    {
      question: "هل يمكنني استخدام البطاقة دولياً؟",
      answer: "نعم، جميع البطاقات مفعلة للاستخدام الدولي افتراضياً مع إمكانية تقييد الاستخدام حسب المنطقة من الإعدادات."
    },
    {
      question: "ما هي رسوم المعاملات؟",
      answer: "لا توجد رسوم على المعاملات المحلية، ورسوم 1.5% على المعاملات الدولية، مع إعفاء أول 10 معاملات شهرياً."
    },
    {
      question: "كيف يمكنني إضافة رصيد للبطاقة؟",
      answer: "يمكنك إضافة رصيد من خلال التحويل البنكي، بطاقة ائتمان أخرى، أو من خلال خدمات الدفع الإلكتروني المتاحة."
    }
  ];

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">مركز الدعم</h1>
          <p className="text-lg text-muted-foreground">نحن هنا لمساعدتك في أي وقت</p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="banking-shadow hover:banking-shadow-lg transition-all text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">محادثة مباشرة</h3>
              <p className="text-muted-foreground text-sm mb-4">تحدث مع فريق الدعم فوراً</p>
              <Button className="w-full">
                بدء المحادثة
              </Button>
            </CardContent>
          </Card>

          <Card className="banking-shadow hover:banking-shadow-lg transition-all text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">اتصال هاتفي</h3>
              <p className="text-muted-foreground text-sm mb-4">متاح 24/7 لحالات الطوارئ</p>
              <Button variant="outline" className="w-full">
                اتصل بنا
              </Button>
            </CardContent>
          </Card>

          <Card className="banking-shadow hover:banking-shadow-lg transition-all text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">تذكرة دعم</h3>
              <p className="text-muted-foreground text-sm mb-4">للاستفسارات المفصلة</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowTicketForm(!showTicketForm)}
              >
                إنشاء تذكرة
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Form */}
        {showTicketForm && (
          <Card className="banking-shadow mb-8">
            <CardHeader>
              <CardTitle>إنشاء تذكرة دعم جديدة</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">موضوع التذكرة</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="اكتب موضوع استفسارك"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">تفاصيل المشكلة</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اشرح مشكلتك بالتفصيل..."
                    rows={5}
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={createTicketMutation.isPending}
                  >
                    {createTicketMutation.isPending ? "جاري الإرسال..." : "إرسال التذكرة"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowTicketForm(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle>الأسئلة الشائعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <Collapsible
                      key={index}
                      open={openFAQ === index}
                      onOpenChange={() => setOpenFAQ(openFAQ === index ? null : index)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between text-right p-4 h-auto"
                        >
                          <span className="font-medium">{item.question}</span>
                          {openFAQ === index ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <div className="p-4 bg-muted/50 rounded-lg text-muted-foreground text-sm leading-relaxed">
                          {item.answer}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle>معلومات الاتصال</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Phone className="text-primary h-5 w-5" />
                  <div>
                    <p className="font-medium text-foreground">الهاتف</p>
                    <p className="text-sm text-muted-foreground">+966 11 123 4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Mail className="text-primary h-5 w-5" />
                  <div>
                    <p className="font-medium text-foreground">البريد الإلكتروني</p>
                    <p className="text-sm text-muted-foreground">support@cardplatform.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Clock className="text-primary h-5 w-5" />
                  <div>
                    <p className="font-medium text-foreground">ساعات العمل</p>
                    <p className="text-sm text-muted-foreground">24/7 طوال أيام الأسبوع</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle>مصادر مفيدة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="#" className="block p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Book className="text-primary h-5 w-5" />
                    <div>
                      <p className="font-medium text-foreground">دليل المستخدم</p>
                      <p className="text-xs text-muted-foreground">تعلم كيفية استخدام المنصة</p>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="block p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Video className="text-primary h-5 w-5" />
                    <div>
                      <p className="font-medium text-foreground">فيديوهات تعليمية</p>
                      <p className="text-xs text-muted-foreground">شروحات مرئية شاملة</p>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="block p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Shield className="text-primary h-5 w-5" />
                    <div>
                      <p className="font-medium text-foreground">الأمان والخصوصية</p>
                      <p className="text-xs text-muted-foreground">معلومات حماية البيانات</p>
                    </div>
                  </div>
                </a>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle>حالة النظام</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">منصة البطاقات</span>
                  <Badge className="status-active">
                    <CheckCircle className="h-3 w-3 ml-1" />
                    تعمل بشكل طبيعي
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">معالجة المدفوعات</span>
                  <Badge className="status-active">
                    <CheckCircle className="h-3 w-3 ml-1" />
                    تعمل بشكل طبيعي
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Lithic</span>
                  <Badge className="status-active">
                    <CheckCircle className="h-3 w-3 ml-1" />
                    متاح
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="flex justify-around py-3">
          <Link href="/" className="flex flex-col items-center gap-1 cursor-pointer">
            <Home className="w-5 h-5 text-gray-500" />
            <span className="text-xs text-gray-500">الرئيسية</span>
          </Link>
          <Link href="/cards" className="flex flex-col items-center gap-1 cursor-pointer">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <span className="text-xs text-gray-500">البطاقات</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center gap-1 cursor-pointer">
            <TrendingUp className="w-5 h-5 text-gray-500" />
            <span className="text-xs text-gray-500">لوحة التحكم</span>
          </Link>
          <Link href="/support" className="flex flex-col items-center gap-1 cursor-pointer">
            <Headphones className="w-5 h-5 text-red-500" />
            <span className="text-xs text-red-500">الدعم</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
