import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowLeft, Calendar, ChevronDown } from "lucide-react";

export default function PersonalInformation() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    documentType: "",
    idNumber: ""
  });

  const documentTypes = [
    { value: "passport", label: language === "ar" ? "جواز سفر" : "Passport" },
    { value: "national_id", label: language === "ar" ? "هوية وطنية" : "National ID" },
    { value: "driving_license", label: language === "ar" ? "رخصة قيادة" : "Driving License" },
    { value: "residence_permit", label: language === "ar" ? "إقامة" : "Residence Permit" }
  ];

  const handleNext = () => {
    if (formData.firstName && formData.lastName && formData.dateOfBirth && formData.documentType) {
      // يمكن إرسال البيانات إلى الخطوة التالية أو حفظها
      setLocation("/document-capture");
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.dateOfBirth && formData.documentType;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <Link href="/nationality-selection">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="text-sm opacity-70">
          23:59
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between px-6 pb-8">
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white">
              {language === "ar" ? "المعلومات الشخصية" : "Personal Information"}
            </h1>
            <p className="text-white/70 text-sm leading-relaxed">
              {language === "ar" 
                ? "يجب أن تتطابق المعلومات مع جواز سفرك أو الهوية الصادرة عن الحكومة."
                : "The information must match your passport or government-issued ID."
              }
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* First Name */}
            <div className="space-y-2">
              <Label className="text-white/80 text-sm font-medium">
                <span className="text-red-400">* </span>
                {language === "ar" ? "الاسم الأول" : "First name(s)"}
              </Label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                className="h-12 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl focus:border-purple-500 focus:ring-purple-500"
                placeholder={language === "ar" ? "أدخل الاسم الأول" : "Enter first name"}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label className="text-white/80 text-sm font-medium">
                {language === "ar" ? "اسم العائلة" : "Last name(s)"}
              </Label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                className="h-12 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl focus:border-purple-500 focus:ring-purple-500"
                placeholder={language === "ar" ? "أدخل اسم العائلة" : "Enter last name"}
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label className="text-white/80 text-sm font-medium">
                <span className="text-red-400">* </span>
                {language === "ar" ? "تاريخ الميلاد" : "Date Of Birth"}
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({...prev, dateOfBirth: e.target.value}))}
                  className="h-12 bg-gray-800/50 border-gray-600 text-white rounded-2xl focus:border-purple-500 focus:ring-purple-500"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Document Type */}
            <div className="space-y-2">
              <Label className="text-white/80 text-sm font-medium">
                <span className="text-red-400">* </span>
                {language === "ar" ? "نوع الوثيقة" : "Document Type"}
              </Label>
              <Select value={formData.documentType} onValueChange={(value) => setFormData(prev => ({...prev, documentType: value}))}>
                <SelectTrigger className="h-12 bg-gray-800/50 border-gray-600 text-white rounded-2xl focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder={language === "ar" ? "اختر نوع الوثيقة" : "Select document type"} />
                  <ChevronDown className="h-5 w-5 text-white" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  {documentTypes.map((type) => (
                    <SelectItem 
                      key={type.value} 
                      value={type.value}
                      className="hover:bg-gray-700 focus:bg-gray-700"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ID Number */}
            <div className="space-y-2">
              <Label className="text-white/80 text-sm font-medium">
                <span className="text-red-400">* </span>
                {language === "ar" ? "رقم الهوية" : "ID Number"}
              </Label>
              <Input
                value={formData.idNumber}
                onChange={(e) => setFormData(prev => ({...prev, idNumber: e.target.value}))}
                className="h-12 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl focus:border-purple-500 focus:ring-purple-500"
                placeholder={language === "ar" ? "وفقاً للوثيقة المختارة أعلاه" : "According to your chosen document as above"}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-6">
          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className="w-full h-12 bg-white text-black font-semibold rounded-full hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 transition-all duration-200"
          >
            {language === "ar" ? "التالي" : "Next"}
          </Button>

          {/* Progress Indicator */}
          <div className="flex justify-center">
            <div className="w-16 h-1 bg-white/30 rounded-full">
              <div className="w-8 h-1 bg-white rounded-full transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}