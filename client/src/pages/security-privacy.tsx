import { useState, useEffect } from "react";
import { ArrowLeft, Shield, Key, Smartphone, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function SecurityPrivacy() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Fetch user profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['/api/user/profile'],
    queryFn: userApi.getProfile
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    biometricEnabled: false,
    loginNotifications: true,
    deviceTracking: false
  });

  // Update security settings from profile data when loaded
  useEffect(() => {
    if (profile) {
      setSecuritySettings({
        twoFactorEnabled: profile.twoFactorEnabled || false,
        biometricEnabled: profile.biometricEnabled || false,
        loginNotifications: profile.loginNotifications !== false, // default to true
        deviceTracking: profile.deviceTracking || false,
      });
    }
  }, [profile]);

  // Mutation for password change
  const passwordMutation = useMutation({
    mutationFn: (data: any) => userApi.updateProfile(data),
    onSuccess: () => {
      toast({
        title: t("success"),
        description: t("passwordUpdateSuccess"),
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: t("error"),
        description: error.message || t("passwordUpdateError"),
        variant: "destructive",
      });
    }
  });

  // Mutation for security settings
  const securityMutation = useMutation({
    mutationFn: (data: any) => userApi.updateSecurity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      toast({
        title: t("success"),
        description: t("securitySettingsUpdated"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("error"),
        description: error.message || t("securityUpdateError"),
        variant: "destructive",
      });
    }
  });

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: t("error"),
        description: t("passwordsDontMatch"),
        variant: "destructive",
      });
      return;
    }

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast({
        title: t("error"),
        description: t("allFieldsRequired"),
        variant: "destructive",
      });
      return;
    }

    passwordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      password: passwordForm.newPassword
    });
  };

  const handleSettingToggle = (setting: keyof typeof securitySettings) => {
    const newSettings = {
      ...securitySettings,
      [setting]: !securitySettings[setting]
    };
    
    setSecuritySettings(newSettings);
    
    // Save to database
    securityMutation.mutate(newSettings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden pb-20">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-purple-200/30 dark:border-purple-700/30 p-4 relative z-10">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/account")}
            className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            الأمان والخصوصية
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Change Password */}
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2 space-x-reverse">
              <Key className="h-5 w-5" />
              <span>Change Password</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({
                  ...prev,
                  confirmPassword: e.target.value
                }))}
              />
            </div>

            <Button onClick={handlePasswordChange} className="w-full">
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2 space-x-reverse">
              <Shield className="h-5 w-5" />
              <span>Security Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add extra security with 2FA</p>
              </div>
              <Switch
                checked={securitySettings.twoFactorEnabled}
                onCheckedChange={() => handleSettingToggle('twoFactorEnabled')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Biometric Login</p>
                <p className="text-sm text-gray-500">Use fingerprint or face ID</p>
              </div>
              <Switch
                checked={securitySettings.biometricEnabled}
                onCheckedChange={() => handleSettingToggle('biometricEnabled')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Login Notifications</p>
                <p className="text-sm text-gray-500">Get alerts for new logins</p>
              </div>
              <Switch
                checked={securitySettings.loginNotifications}
                onCheckedChange={() => handleSettingToggle('loginNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Device Tracking</p>
                <p className="text-sm text-gray-500">Monitor account access</p>
              </div>
              <Switch
                checked={securitySettings.deviceTracking}
                onCheckedChange={() => handleSettingToggle('deviceTracking')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2 space-x-reverse">
              <Smartphone className="h-5 w-5" />
              <span>Active Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <p className="font-medium">Current Device</p>
                <p className="text-sm text-gray-500">Chrome on Android • Active now</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Current
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <p className="font-medium">Desktop Computer</p>
                <p className="text-sm text-gray-500">Chrome on Windows • 2 hours ago</p>
              </div>
              <Button variant="destructive" size="sm">
                Revoke
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Actions */}
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-base text-red-600 dark:text-red-400">
              Emergency Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="destructive" className="w-full">
              Logout All Devices
            </Button>
            <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
              Temporarily Freeze Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}