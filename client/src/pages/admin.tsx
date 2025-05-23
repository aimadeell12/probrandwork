import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import { adminApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Users, CreditCard, TrendingUp, DollarSign, Settings, Database, RefreshCw } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: user?.role === "admin",
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === "admin",
  });

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="banking-shadow">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">الوصول مرفوض</h3>
              <p className="text-muted-foreground">تحتاج إلى صلاحيات المدير للوصول لهذه الصفحة</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (statsLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="banking-shadow">
                <CardContent className="p-6">
                  <div className="loading-skeleton h-12 w-12 rounded-xl mb-4"></div>
                  <div className="loading-skeleton h-4 w-20 mb-2"></div>
                  <div className="loading-skeleton h-8 w-16"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">لوحة الإدارة</h1>
          <p className="text-muted-foreground">إدارة شاملة للمنصة والمستخدمين</p>
        </div>

        {/* Admin Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="banking-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">إجمالي المستخدمين</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.totalUsers || 0}</p>
                </div>
                <Users className="text-primary h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="banking-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">البطاقات الصادرة</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.totalCards || 0}</p>
                </div>
                <CreditCard className="text-secondary h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="banking-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">المعاملات</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.totalTransactions || 0}</p>
                </div>
                <TrendingUp className="text-accent h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="banking-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">حجم المعاملات</p>
                  <p className="text-2xl font-bold text-foreground">${stats?.totalVolume || "0"}</p>
                </div>
                <DollarSign className="text-blue-500 h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="banking-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">الإيرادات</p>
                  <p className="text-2xl font-bold text-foreground">$45,280</p>
                </div>
                <DollarSign className="text-green-500 h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Management */}
          <div className="lg:col-span-2">
            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  إدارة المستخدمين
                  <Button size="sm">
                    إضافة مستخدم
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {users && users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-right py-3 text-sm font-medium text-muted-foreground">المستخدم</th>
                          <th className="text-right py-3 text-sm font-medium text-muted-foreground">الدور</th>
                          <th className="text-right py-3 text-sm font-medium text-muted-foreground">تاريخ التسجيل</th>
                          <th className="text-right py-3 text-sm font-medium text-muted-foreground">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {users.map((user: any) => (
                          <tr key={user.id} className="hover:bg-muted/50">
                            <td className="py-4">
                              <div className="flex items-center space-x-3 space-x-reverse">
                                <img 
                                  src={user.profileImageUrl || "/placeholder-avatar.png"} 
                                  alt="صورة المستخدم" 
                                  className="w-8 h-8 rounded-full object-cover" 
                                />
                                <div>
                                  <p className="font-medium text-foreground">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                {user.role === "admin" ? "مدير" : "مستخدم"}
                              </Badge>
                            </td>
                            <td className="py-4 text-muted-foreground text-sm">
                              {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                            </td>
                            <td className="py-4">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <Button size="sm" variant="outline">
                                  تعديل
                                </Button>
                                <Button size="sm" variant="outline">
                                  إيقاف
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لا يوجد مستخدمون</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* System Controls */}
          <div className="space-y-6">
            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle>عمليات النظام</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-secondary hover:bg-secondary/90">
                  <Database className="ml-2 h-4 w-4" />
                  نسخ احتياطي للنظام
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="ml-2 h-4 w-4" />
                  مزامنة Lithic API
                </Button>
                <Button variant="outline" className="w-full">
                  <TrendingUp className="ml-2 h-4 w-4" />
                  تقارير النظام
                </Button>
              </CardContent>
            </Card>

            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle>سجل النشاطات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">بطاقة جديدة صدرت</p>
                    <p className="text-xs text-muted-foreground">منذ 5 دقائق</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">مستخدم جديد مُسجل</p>
                    <p className="text-xs text-muted-foreground">منذ 12 دقيقة</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">تحديث النظام</p>
                    <p className="text-xs text-muted-foreground">منذ 30 دقيقة</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle>حالة API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lithic API</span>
                  <Badge className="status-active">
                    <div className="w-2 h-2 bg-secondary rounded-full ml-1"></div>
                    متصل
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">قاعدة البيانات</span>
                  <Badge className="status-active">
                    <div className="w-2 h-2 bg-secondary rounded-full ml-1"></div>
                    نشط
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">خدمة الدفع</span>
                  <Badge className="status-active">
                    <div className="w-2 h-2 bg-secondary rounded-full ml-1"></div>
                    متاح
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
