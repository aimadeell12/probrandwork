import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Shield, Zap, BarChart3, Smartphone, Settings, Headphones } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-primary ml-3" />
                <span className="text-xl font-bold text-primary">منصة البطاقات</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6 space-x-reverse">
              <a href="#home" className="text-primary font-medium border-b-2 border-primary">الرئيسية</a>
              <a href="#features" className="text-muted-foreground hover:text-primary">المميزات</a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary">الأسعار</a>
              <a href="#support" className="text-muted-foreground hover:text-primary">الدعم</a>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <Button 
                variant="outline" 
                onClick={handleLogin}
                className="font-medium"
              >
                تسجيل الدخول
              </Button>
              <Button 
                onClick={handleLogin}
                className="banking-gradient hover:opacity-90"
              >
                إنشاء حساب
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="banking-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                إدارة البطاقات المصرفية
                <span className="block text-blue-200">بكل سهولة وأمان</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                منصة متطورة لإصدار وإدارة البطاقات المصرفية باستخدام تقنية Lithic API. 
                تحكم كامل، أمان عالي، وتجربة مستخدم استثنائية.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={handleLogin}
                  className="bg-white text-primary hover:bg-gray-50 font-semibold px-8 py-4 text-lg"
                >
                  ابدأ مجاناً
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 text-lg"
                >
                  شاهد العرض التوضيحي
                </Button>
              </div>
            </div>
            <div className="relative">
              {/* Card Visual */}
              <Card className="transform rotate-3 banking-shadow-lg">
                <CardContent className="p-6">
                  <div className="card-gradient-blue rounded-xl p-6 text-white mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <CreditCard className="h-8 w-8" />
                      <span className="text-sm">**** 4532</span>
                    </div>
                    <div className="text-lg font-semibold">أحمد محمد</div>
                    <div className="text-sm opacity-90">12/26</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-foreground">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">12</div>
                      <div className="text-sm">بطاقة نشطة</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">$24,580</div>
                      <div className="text-sm">الرصيد</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">156</div>
                      <div className="text-sm">المعاملات</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              مميزات المنصة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              تقنيات متطورة ومميزات شاملة لإدارة البطاقات المصرفية بكفاءة عالية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="banking-shadow hover:banking-shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">أمان عالي</h3>
                <p className="text-muted-foreground leading-relaxed">
                  تشفير متطور وحماية شاملة لجميع البيانات والمعاملات المالية
                </p>
              </CardContent>
            </Card>

            <Card className="banking-shadow hover:banking-shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">إصدار فوري</h3>
                <p className="text-muted-foreground leading-relaxed">
                  إصدار البطاقات في ثوانٍ معدودة باستخدام Lithic API المتطور
                </p>
              </CardContent>
            </Card>

            <Card className="banking-shadow hover:banking-shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-4">تحليلات شاملة</h3>
                <p className="text-muted-foreground leading-relaxed">
                  تقارير مفصلة وتحليلات في الوقت الفعلي لجميع المعاملات
                </p>
              </CardContent>
            </Card>

            <Card className="banking-shadow hover:banking-shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                  <Smartphone className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4">تطبيق محمول</h3>
                <p className="text-muted-foreground leading-relaxed">
                  واجهة محسنة للهواتف المحمولة مع تجربة مستخدم سلسة
                </p>
              </CardContent>
            </Card>

            <Card className="banking-shadow hover:banking-shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                  <Settings className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4">تخصيص مرن</h3>
                <p className="text-muted-foreground leading-relaxed">
                  إمكانيات تخصيص واسعة لتناسب احتياجات مؤسستك
                </p>
              </CardContent>
            </Card>

            <Card className="banking-shadow hover:banking-shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                  <Headphones className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4">دعم متواصل</h3>
                <p className="text-muted-foreground leading-relaxed">
                  فريق دعم متخصص متاح على مدار الساعة لمساعدتك
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-200">بطاقة مُصدرة</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200">وقت التشغيل</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">عميل راضٍ</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">دعم فني</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            جاهز للبدء؟
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            انضم إلى آلاف الشركات التي تثق في منصتنا لإدارة بطاقاتها المصرفية
          </p>
          <Button 
            size="lg"
            onClick={handleLogin}
            className="banking-gradient hover:opacity-90 font-semibold px-8 py-4 text-lg"
          >
            ابدأ الآن مجاناً
          </Button>
        </div>
      </section>
    </div>
  );
}
