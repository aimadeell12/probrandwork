import { useState, useEffect } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Save, Edit, Camera } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { ProfileSkeleton } from "@/components/skeletons";

export default function Profile() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user data with loading state
  const { data: userData, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    country: "",
    postalCode: ""
  });

  // Initialize form data with user data
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: (userData as any)?.firstName || "",
        lastName: (userData as any)?.lastName || "",
        email: (userData as any)?.email || "",
        phone: (userData as any)?.phone || "",
        dateOfBirth: (userData as any)?.dateOfBirth || "",
        address: (userData as any)?.address || "",
        city: (userData as any)?.city || "",
        country: (userData as any)?.country || "",
        postalCode: (userData as any)?.postalCode || ""
      });
    }
  }, [userData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log("🚀 [PROFILE] Saving profile data:", formData);
      
      const result = await apiRequest("PATCH", "/api/auth/profile", formData);
      
      console.log("✅ [PROFILE] Profile updated successfully:", result);
      
      toast({
        title: "تم التحديث",
        description: "تم تحديث ملفك الشخصي بنجاح",
      });

      setIsEditing(false);
      // Refresh user data
      window.location.reload();
    } catch (error: any) {
      console.error("❌ [PROFILE] Error updating profile:", error);
      
      const errorMessage = error?.message || "فشل في تحديث الملف الشخصي. حاول مرة أخرى.";
      
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        firstName: (user as any)?.firstName || "",
        lastName: (user as any)?.lastName || "",
        email: (user as any)?.email || "",
        phone: (user as any)?.phone || "",
        dateOfBirth: (user as any)?.dateOfBirth || "",
        address: (user as any)?.address || "",
        city: (user as any)?.city || "",
        country: (user as any)?.country || "",
        postalCode: (user as any)?.postalCode || ""
      });
    }
    setIsEditing(false);
  };

  // Show skeleton while loading
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-red-900 dark:to-blue-900 relative overflow-hidden pb-20">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-red-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-red-200/30 dark:border-red-700/30 p-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/account")}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              My Profile
            </h1>
          </div>
          
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 relative z-10 max-w-md space-y-6">
        
        {/* Profile Picture */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-red-200/30 dark:border-red-700/30 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-white" />
              </div>
              {isEditing && (
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {formData.email}
            </p>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-red-200/30 dark:border-red-700/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 space-x-reverse text-gray-900 dark:text-white">
              <User className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-900 dark:text-white text-sm">
                  First Name
                </Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                    {formData.firstName || "Not set"}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-900 dark:text-white text-sm">
                  Last Name
                </Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                    {formData.lastName || "Not set"}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 dark:text-white text-sm">
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="text-sm"
                />
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                  {formData.email || "Not set"}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-900 dark:text-white text-sm">
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="text-sm"
                />
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                  {formData.phone || "Not set"}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-gray-900 dark:text-white text-sm">
                Date of Birth
              </Label>
              {isEditing ? (
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="text-sm"
                />
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                  {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : "Not set"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-red-200/30 dark:border-red-700/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 space-x-reverse text-gray-900 dark:text-white">
              <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span>Address Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-900 dark:text-white text-sm">
                Street Address
              </Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="text-sm"
                />
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                  {formData.address || "Not set"}
                </p>
              )}
            </div>

            {/* City & Postal Code */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-gray-900 dark:text-white text-sm">
                  City
                </Label>
                {isEditing ? (
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                    {formData.city || "Not set"}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-gray-900 dark:text-white text-sm">
                  Postal Code
                </Label>
                {isEditing ? (
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                    {formData.postalCode || "Not set"}
                  </p>
                )}
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-gray-900 dark:text-white text-sm">
                Country
              </Label>
              {isEditing ? (
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="text-sm"
                />
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                  {formData.country || "Not set"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}