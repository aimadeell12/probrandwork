import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { adminApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import { Users, CreditCard, TrendingUp, DollarSign, Settings, Database, RefreshCw, UserCog, Activity, Shield, CheckCircle, XCircle } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: user?.role === "admin",
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === "admin",
  });

  const { data: cards, isLoading: cardsLoading } = useQuery({
    queryKey: ["/api/admin/cards"],
    enabled: user?.role === "admin",
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/admin/activities"],
    enabled: user?.role === "admin",
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminApi.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "تم تحديث الدور بنجاح",
        description: "تم تحديث دور المستخدم بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث دور المستخدم",
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (userId: string) => adminApi.toggleUserStatus(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "تم تحديث الحالة بنجاح",
        description: "تم تغيير حالة المستخدم بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تغيير حالة المستخدم",
        variant: "destructive",
      });
    },
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

  if (statsLoading || usersLoading || cardsLoading || activitiesLoading) {
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

        {/* Enhanced Tabbed Interface */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center space-x-2 space-x-reverse">
              <Users className="h-4 w-4" />
              <span>المستخدمون</span>
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center space-x-2 space-x-reverse">
              <CreditCard className="h-4 w-4" />
              <span>البطاقات</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center space-x-2 space-x-reverse">
              <Activity className="h-4 w-4" />
              <span>النشاطات</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2 space-x-reverse">
              <Settings className="h-4 w-4" />
              <span>النظام</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  إدارة المستخدمين
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Badge variant="outline">
                      {users?.length || 0} مستخدم
                    </Badge>
                    <Button size="sm">
                      <UserCog className="h-4 w-4 ml-2" />
                      إضافة مدير
                    </Button>
                  </div>
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
                          <th className="text-right py-3 text-sm font-medium text-muted-foreground">الحالة</th>
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
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Badge 
                                    variant={user.role === "admin" ? "default" : "secondary"}
                                    className="cursor-pointer hover:opacity-80"
                                  >
                                    {user.role === "admin" ? "مدير" : "مستخدم"}
                                  </Badge>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>تغيير دور المستخدم</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">الدور الجديد</label>
                                      <Select 
                                        defaultValue={user.role}
                                        onValueChange={(value) => 
                                          updateRoleMutation.mutate({ userId: user.id, role: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="user">مستخدم</SelectItem>
                                          <SelectItem value="admin">مدير</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </td>
                            <td className="py-4">
                              <Badge variant={user.isActive ? "default" : "destructive"}>
                                {user.isActive ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 ml-1" />
                                    نشط
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3 ml-1" />
                                    معطل
                                  </>
                                )}
                              </Badge>
                            </td>
                            <td className="py-4 text-muted-foreground text-sm">
                              {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                            </td>
                            <td className="py-4">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => toggleStatusMutation.mutate(user.id)}
                                  disabled={toggleStatusMutation.isPending}
                                >
                                  {user.isActive ? "إيقاف" : "تفعيل"}
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Shield className="h-4 w-4" />
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
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards">
            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  إدارة البطاقات
                  <Badge variant="outline">
                    {cards?.length || 0} بطاقة
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cards && cards.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card: any) => (
                      <div key={card.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{card.type}</Badge>
                          <Badge variant={card.status === "active" ? "default" : "secondary"}>
                            {card.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium">{card.holderName}</p>
                          <p className="text-sm text-muted-foreground">**** **** **** ****</p>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">الرصيد</span>
                          <span className="font-medium">${card.balance || "0.00"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لا توجد بطاقات مصدرة</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle>سجل النشاطات</CardTitle>
              </CardHeader>
              <CardContent>
                {activities && activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3 space-x-reverse p-3 rounded-lg bg-muted/30">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {activity.type === "user_registered" ? "مستخدم جديد مسجل" : "بطاقة جديدة صدرت"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.createdAt).toLocaleString("ar-SA")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لا توجد نشاطات حديثة</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="banking-shadow">
                <CardHeader>
                  <CardTitle>عمليات النظام</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full">
                    <Database className="ml-2 h-4 w-4" />
                    نسخ احتياطي للنظام
                  </Button>
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="ml-2 h-4 w-4" />
                    مزامنة Reap API
                  </Button>
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="ml-2 h-4 w-4" />
                    تقارير النظام
                  </Button>
                </CardContent>
              </Card>

              <Card className="banking-shadow">
                <CardHeader>
                  <CardTitle>حالة الخدمات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Reap API</span>
                    <Badge variant="default">
                      <CheckCircle className="w-3 h-3 ml-1" />
                      متصل
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">قاعدة البيانات</span>
                    <Badge variant="default">
                      <CheckCircle className="w-3 h-3 ml-1" />
                      نشط
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">خدمة الدفع</span>
                    <Badge variant="default">
                      <CheckCircle className="w-3 h-3 ml-1" />
                      متاح
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
