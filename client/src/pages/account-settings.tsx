import { useState, useEffect } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Save } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function AccountSettings() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Fetch profile data from our API
  const { data: profile, isLoading } = useQuery({
    queryKey: ['/api/user/profile'],
    queryFn: userApi.getProfile
  });

  const [formData, setFormData] = useState({
    username: (user as any)?.username || "",
    email: (user as any)?.email || "",
    phone: "",
    address: "",
    firstName: "",
    lastName: "", 
    emailNotifications: true,
    smsNotifications: false
  });

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      console.log("Profile loaded:", profile); // Debug log
      try {
        setFormData({
          username: profile.username || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
          firstName: profile.firstName || "", 
          lastName: profile.lastName || "",   
          emailNotifications: profile.emailNotifications !== false,
          smsNotifications: profile.smsNotifications || false
        });
      } catch (error) {
        console.error("Error setting form data:", error);
      }
    }
  }, [profile]);

  // Mutation for profile updates
  const profileMutation = useMutation({
    mutationFn: (data: any) => userApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      toast({
        title: t("success"),
        description: t("accountSettingsUpdated") || "Account settings updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: t("error"),
        description: error.message || t("updateError") || "Failed to update settings",
        variant: "destructive",
      });
    }
  });

  // Mutation for notification settings
  const notificationsMutation = useMutation({
    mutationFn: (data: any) => userApi.updateNotifications(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      toast({
        title: t("success"),
        description: t("notificationSettingsUpdated") || "Notification settings updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: t("error"),
        description: error.message || t("updateError") || "Failed to update notification settings",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    try {
      // Send profile updates to the API with correct database field names
      const profileData = {
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        phone: formData.phone || "",
        address: formData.address || ""
      };

      // Send notification settings to the API with correct database field names
      const notificationData = {
        emailNotifications: formData.emailNotifications === true,
        smsNotifications: formData.smsNotifications === true
      };

      console.log("Saving profile data:", profileData);
      console.log("Saving notification data:", notificationData);

      profileMutation.mutate(profileData);
      notificationsMutation.mutate(notificationData);
      
      // Display a success message immediately for better user feedback
      toast({
        title: "Saving changes...",
        description: "Your settings are being updated.",
      });
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/account")}
            className="p-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("accountSettings")}
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Success message when settings are saved */}
        {(profileMutation.isSuccess || notificationsMutation.isSuccess) && (
          <div className="rounded-lg bg-white dark:bg-gray-900 border-0 shadow-sm p-4 mb-4">
            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-1">Success</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Account settings updated successfully
            </p>
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  className="mt-1"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  className="mt-1"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                className="mt-1"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Contact Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                className="mt-1"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                className="mt-1"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                className="mt-1"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Preferences</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive account updates via email</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleInputChange("emailNotifications", !formData.emailNotifications)}
                className={formData.emailNotifications ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900" : ""}
              >
                {formData.emailNotifications ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive transaction alerts via SMS</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleInputChange("smsNotifications", !formData.smsNotifications)}
                className={formData.smsNotifications ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900" : ""}
              >
                {formData.smsNotifications ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={profileMutation.isPending || notificationsMutation.isPending}
        >
          {profileMutation.isPending || notificationsMutation.isPending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}