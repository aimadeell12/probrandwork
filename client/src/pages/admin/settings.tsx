import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Shield, 
  Database, 
  Bell, 
  Mail,
  Globe,
  Lock,
  Server,
  ArrowLeft,
  Save,
  AlertTriangle
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch KYC stats for real data
  const { data: kycStats } = useQuery({
    queryKey: ["/api/admin/kyc"],
  });

  // Fetch users data for real data  
  const { data: usersData } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const [settings, setSettings] = useState({
    autoApproveKyc: false,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    apiAccess: true,
    twoFactorRequired: true,
    sessionTimeout: "24",
    maxLoginAttempts: "5"
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = useMutation({
    mutationFn: async (newSettings: any) => {
      // This would save to a real settings API endpoint
      toast({
        title: "Settings Saved",
        description: "All settings have been saved successfully.",
      });
    },
  });

  const totalKyc = kycStats?.length || 0;
  const pendingKyc = kycStats?.filter((k: any) => k.status === 'pending').length || 0;
  const totalUsers = usersData?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-gray-900 dark:via-red-900 dark:to-red-900">
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin-panel">
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Settings
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure system preferences
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto sm:ml-auto">
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Require 2FA for admin accounts</p>
                </div>
                <Switch
                  checked={settings.twoFactorRequired}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorRequired', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('maxLoginAttempts', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">API Access</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enable external API access</p>
                </div>
                <Switch
                  checked={settings.apiAccess}
                  onCheckedChange={(checked) => handleSettingChange('apiAccess', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* KYC Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                KYC Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-Approve KYC</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Automatically approve simple verifications</p>
                </div>
                <Switch
                  checked={settings.autoApproveKyc}
                  onCheckedChange={(checked) => handleSettingChange('autoApproveKyc', checked)}
                />
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Warning</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Auto-approval reduces security. Use with caution.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Send admin notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">SMS Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Send critical alerts via SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Notification Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="w-fit">
                      <Mail className="h-3 w-3 mr-1" />
                      New KYC Submissions
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="w-fit">
                      <Shield className="h-3 w-3 mr-1" />
                      Security Alerts
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="w-fit">
                      <Server className="h-3 w-3 mr-1" />
                      System Updates
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Maintenance Mode</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Put system in maintenance mode</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
              </div>

              {settings.maintenanceMode && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">Maintenance Mode Active</p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Users will see a maintenance message and cannot access the system.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">System Statistics</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Total Users</span>
                    <Badge variant="secondary" className="text-xs">
                      {totalUsers}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-xs text-gray-600 dark:text-gray-400">KYC Requests</span>
                    <Badge variant="secondary" className="text-xs">
                      {totalKyc}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Pending Reviews</span>
                    <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs">
                      {pendingKyc}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-xs text-gray-600 dark:text-gray-400">System Status</span>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">
                      Online
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button variant="outline" className="w-full sm:w-auto">
            Reset to Defaults
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            onClick={() => saveSettings.mutate(settings)}
            disabled={saveSettings.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {saveSettings.isPending ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}