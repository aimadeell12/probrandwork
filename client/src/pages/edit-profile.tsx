import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, User, Phone, MapPin, Calendar, FileText, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { apiRequest } from "@/lib/queryClient";

// Schema for profile form
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be valid"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City name is required"),
  postalCode: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  dateOfBirth: z.string().min(10, "Date of birth is required"),
  nationality: z.string().min(2, "Nationality is required"),
  idDocumentType: z.string().min(1, "ID document type is required"),
  idDocumentNumber: z.string().min(5, "ID document number is required"),
  occupation: z.string().min(2, "Occupation is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfile() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // Get current user data
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "MAR",
      dateOfBirth: "",
      nationality: "Moroccan",
      idDocumentType: "National ID",
      idDocumentNumber: "",
      occupation: "",
    },
  });

  // Update form when user data loads
  useEffect(() => {
    console.log("🔄 User data changed:", user);
    if (user) {
      console.log("🔄 Resetting form with user data:", {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        country: user.country,
        dateOfBirth: user.dateOfBirth,
        nationality: user.nationality,
        idDocumentType: user.idDocumentType,
        idDocumentNumber: user.idDocumentNumber,
        occupation: user.occupation,
      });
      
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
        country: user.country || "MAR",
        dateOfBirth: user.dateOfBirth || "",
        nationality: user.nationality || "Moroccan",
        idDocumentType: user.idDocumentType || "National ID",
        idDocumentNumber: user.idDocumentNumber || "",
        occupation: user.occupation || "",
      });
    } else {
      console.log("❌ No user data available");
    }
  }, [user, form]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) =>
      apiRequest("PATCH", `/api/auth/profile`, data),
    onSuccess: async (updatedUser) => {
      console.log("Profile update successful, updated user:", updatedUser);
      
      // Invalidate and refetch user data immediately
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      await queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });
      
      toast({
        title: "Profile Updated",
        description: "Your personal information has been saved successfully",
      });
    },
    onError: (error) => {
      console.error("Update profile error:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log("Form submitted with data:", data);
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Profile
            </h1>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-32">
            {/* Personal Information */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <span>المعلومات الشخصية</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <span>الاسم الأول</span>
                          <span className="text-xs text-orange-600 dark:text-orange-400 mr-2">🔒 محمي</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} readOnly disabled className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" placeholder="أدخل الاسم الأول" />
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">
                          الاسم الأول لا يمكن تعديله لأغراض الأمان
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <span>اسم العائلة</span>
                          <span className="text-xs text-orange-600 dark:text-orange-400 mr-2">🔒 محمي</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} readOnly disabled className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" placeholder="أدخل اسم العائلة" />
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">
                          اسم العائلة لا يمكن تعديله لأغراض الأمان
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>تاريخ الميلاد</span>
                        <span className="text-xs text-orange-600 dark:text-orange-400 mr-2">🔒 محمي</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="date" readOnly disabled className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        تاريخ الميلاد لا يمكن تعديله لأغراض الأمان
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <span>الجنسية</span>
                        <span className="text-xs text-orange-600 dark:text-orange-400 mr-2">🔒 محمي</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                        <FormControl>
                          <SelectTrigger className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed">
                            <SelectValue placeholder="اختر الجنسية" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Moroccan">مغربي</SelectItem>
                          <SelectItem value="Algerian">جزائري</SelectItem>
                          <SelectItem value="Tunisian">تونسي</SelectItem>
                          <SelectItem value="Egyptian">مصري</SelectItem>
                          <SelectItem value="Saudi">سعودي</SelectItem>
                          <SelectItem value="Other">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        الجنسية لا يمكن تعديلها لأغراض الأمان
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span>معلومات الاتصال</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <span>البريد الإلكتروني</span>
                        <span className="text-xs text-orange-600 dark:text-orange-400 mr-2">🔒 محمي</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="email" readOnly disabled className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" placeholder="your@email.com" />
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        البريد الإلكتروني لا يمكن تعديله لأغراض الأمان
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+212663381823" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>العنوان</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <span>الشارع والرقم</span>
                        <span className="text-xs text-orange-600 dark:text-orange-400 mr-2">🔒 محمي</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} readOnly disabled className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" placeholder="رقم البيت، اسم الشارع" />
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        العنوان لا يمكن تعديله لأغراض الأمان
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المدينة</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="الدار البيضاء" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الرمز البريدي</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="20000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الدولة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الدولة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MAR">المغرب</SelectItem>
                          <SelectItem value="DZA">الجزائر</SelectItem>
                          <SelectItem value="TUN">تونس</SelectItem>
                          <SelectItem value="EGY">مصر</SelectItem>
                          <SelectItem value="SAU">السعودية</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Document Information */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <span>الوثائق الرسمية</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="idDocumentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <span>نوع الهوية</span>
                        <span className="text-xs text-orange-600 dark:text-orange-400 mr-2">🔒 محمي</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                        <FormControl>
                          <SelectTrigger className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed">
                            <SelectValue placeholder="اختر نوع الهوية" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="National ID">البطاقة الوطنية</SelectItem>
                          <SelectItem value="Passport">جواز السفر</SelectItem>
                          <SelectItem value="Driver License">رخصة القيادة</SelectItem>
                          <SelectItem value="TaxIDNumber">الرقم الضريبي</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        نوع الهوية لا يمكن تعديله لأغراض الأمان
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idDocumentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <span>رقم الهوية</span>
                        <span className="text-xs text-orange-600 dark:text-orange-400 mr-2">🔒 محمي</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} readOnly disabled className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" placeholder="أدخل رقم الهوية" />
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        رقم الهوية لا يمكن تعديله لأغراض الأمان
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>



          </form>
        </Form>
      </div>
      
      {/* Fixed Save Button Above Bottom Navigation */}
      <div className="fixed bottom-20 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-40">
        <Button
          onClick={async () => {
            console.log("Save button clicked!");
            console.log("Form errors:", form.formState.errors);
            console.log("Form values:", form.getValues());
            
            // Force submit with current values
            const currentValues = form.getValues();
            const filteredData = Object.fromEntries(
              Object.entries(currentValues).filter(([_, value]) => value !== "")
            );
            console.log("Forcing submit with:", filteredData);
            
            if (Object.keys(filteredData).length > 0) {
              updateProfileMutation.mutate(filteredData);
            } else {
              console.log("No data to save");
            }
          }}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={updateProfileMutation.isPending}
        >
          <Save className="h-5 w-5 mr-2" />
          {updateProfileMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>
    </div>
  );
}