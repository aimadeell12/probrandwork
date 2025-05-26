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

        {/* Simplified Admin Dashboard */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Actions */}
          <Card className="banking-shadow lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <UserCog className="h-4 w-4 ml-2" />
                إضافة مدير
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 ml-2" />
                نسخ احتياطي
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 ml-2" />
                تقرير شامل
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="banking-shadow lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">حالة النظام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">قاعدة البيانات</span>
                  </div>
                  <Badge variant="default">نشط</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Reap API</span>
                  </div>
                  <Badge variant="default">متصل</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">الخدمات</span>
                  </div>
                  <Badge variant="default">متاح</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Users Management */}
          <div className="lg:col-span-2">
            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Users className="h-5 w-5" />
                    <span>إدارة المستخدمين</span>
                  </div>
                  <Badge variant="outline">{users?.length || 0} مستخدم</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users && users.length > 0 ? (
                    users.slice(0, 5).map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <img 
                            src={user.profileImageUrl || "/placeholder-avatar.png"} 
                            alt="صورة المستخدم" 
                            className="w-10 h-10 rounded-full object-cover" 
                          />
                          <div>
                            <p className="font-medium text-foreground">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role === "admin" ? "مدير" : "مستخدم"}
                          </Badge>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>إدارة المستخدم</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">تغيير الدور</label>
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
                                      <SelectItem value="user">مستخدم عادي</SelectItem>
                                      <SelectItem value="admin">مدير النظام</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button 
                                  onClick={() => toggleStatusMutation.mutate(user.id)}
                                  variant="outline"
                                  className="w-full"
                                >
                                  {user.isActive ? "إيقاف المستخدم" : "تفعيل المستخدم"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">لا يوجد مستخدمون</p>
                    </div>
                  )}
                  {users && users.length > 5 && (
                    <Button variant="outline" className="w-full">
                      عرض جميع المستخدمين ({users.length})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cards Overview */}
            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <CreditCard className="h-5 w-5" />
                  <span>البطاقات</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">المجموع</span>
                    <span className="font-bold text-lg">{cards?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">النشطة</span>
                    <span className="font-medium text-green-600">
                      {cards?.filter((card: any) => card.status === "active").length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">المعطلة</span>
                    <span className="font-medium text-red-600">
                      {cards?.filter((card: any) => card.status !== "active").length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="banking-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Activity className="h-5 w-5" />
                  <span>آخر النشاطات</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities && activities.length > 0 ? (
                    activities.slice(0, 3).map((activity: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {activity.type === "user_registered" ? "مستخدم جديد" : "بطاقة جديدة"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.createdAt).toLocaleDateString("ar-SA")}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      لا توجد نشاطات حديثة
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
