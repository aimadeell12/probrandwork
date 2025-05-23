import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import { CreditCard, BarChart3, Users, Headphones, PlusCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">مرحباً بك في منصة البطاقات</h1>
          <p className="text-lg text-muted-foreground">ابدأ في إدارة بطاقاتك المصرفية بكل سهولة</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/cards">
            <Card className="banking-shadow hover:banking-shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">إدارة البطاقات</h3>
                <p className="text-sm text-muted-foreground">عرض وإدارة جميع بطاقاتك</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard">
            <Card className="banking-shadow hover:banking-shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">لوحة التحكم</h3>
                <p className="text-sm text-muted-foreground">تابع الإحصائيات والمعاملات</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin">
            <Card className="banking-shadow hover:banking-shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">الإدارة</h3>
                <p className="text-sm text-muted-foreground">إدارة المستخدمين والنظام</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/support">
            <Card className="banking-shadow hover:banking-shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Headphones className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">الدعم</h3>
                <p className="text-sm text-muted-foreground">احصل على المساعدة والدعم</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Getting Started */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="banking-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-6 w-6 text-primary" />
                البدء السريع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-medium">إنشاء بطاقة جديدة</h4>
                  <p className="text-sm text-muted-foreground">ابدأ بإنشاء أول بطاقة لك في النظام</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-medium">تخصيص الإعدادات</h4>
                  <p className="text-sm text-muted-foreground">قم بضبط حدود الإنفاق وإعدادات الأمان</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-medium">بدء الاستخدام</h4>
                  <p className="text-sm text-muted-foreground">ابدأ في استخدام البطاقة للمعاملات</p>
                </div>
              </div>
              <Link href="/cards">
                <Button className="w-full mt-4">
                  إنشاء بطاقة جديدة
                  <ArrowRight className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="banking-shadow">
            <CardHeader>
              <CardTitle>الموارد المفيدة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a href="#" className="block p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">دليل المستخدم</h4>
                    <p className="text-sm text-muted-foreground">تعلم كيفية استخدام المنصة</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </a>
              
              <a href="#" className="block p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">الأمان والخصوصية</h4>
                    <p className="text-sm text-muted-foreground">معلومات حماية البيانات</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </a>
              
              <Link href="/support">
                <div className="block p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">مركز الدعم</h4>
                      <p className="text-sm text-muted-foreground">احصل على المساعدة</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
