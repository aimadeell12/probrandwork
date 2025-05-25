import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowLeft, ChevronDown, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NationalitySelection() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [selectedNationality, setSelectedNationality] = useState<string>("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const countries = [
    { code: "MA", name: "المغرب", nameEn: "Morocco", flag: "🇲🇦" },
    { code: "SA", name: "السعودية", nameEn: "Saudi Arabia", flag: "🇸🇦" },
    { code: "AE", name: "الإمارات", nameEn: "United Arab Emirates", flag: "🇦🇪" },
    { code: "EG", name: "مصر", nameEn: "Egypt", flag: "🇪🇬" },
    { code: "JO", name: "الأردن", nameEn: "Jordan", flag: "🇯🇴" },
    { code: "LB", name: "لبنان", nameEn: "Lebanon", flag: "🇱🇧" },
    { code: "TN", name: "تونس", nameEn: "Tunisia", flag: "🇹🇳" },
    { code: "DZ", name: "الجزائر", nameEn: "Algeria", flag: "🇩🇿" },
    { code: "IQ", name: "العراق", nameEn: "Iraq", flag: "🇮🇶" },
    { code: "SY", name: "سوريا", nameEn: "Syria", flag: "🇸🇾" },
    { code: "KW", name: "الكويت", nameEn: "Kuwait", flag: "🇰🇼" },
    { code: "QA", name: "قطر", nameEn: "Qatar", flag: "🇶🇦" },
    { code: "BH", name: "البحرين", nameEn: "Bahrain", flag: "🇧🇭" },
    { code: "OM", name: "عمان", nameEn: "Oman", flag: "🇴🇲" },
    { code: "YE", name: "اليمن", nameEn: "Yemen", flag: "🇾🇪" },
    { code: "LY", name: "ليبيا", nameEn: "Libya", flag: "🇱🇾" },
    { code: "SD", name: "السودان", nameEn: "Sudan", flag: "🇸🇩" },
    { code: "PS", name: "فلسطين", nameEn: "Palestine", flag: "🇵🇸" },
    { code: "US", name: "الولايات المتحدة", nameEn: "United States", flag: "🇺🇸" },
    { code: "GB", name: "المملكة المتحدة", nameEn: "United Kingdom", flag: "🇬🇧" },
    { code: "FR", name: "فرنسا", nameEn: "France", flag: "🇫🇷" },
    { code: "DE", name: "ألمانيا", nameEn: "Germany", flag: "🇩🇪" },
    { code: "CA", name: "كندا", nameEn: "Canada", flag: "🇨🇦" },
    { code: "AU", name: "أستراليا", nameEn: "Australia", flag: "🇦🇺" }
  ];

  const selectedCountry = countries.find(country => country.code === selectedNationality);

  const handleNext = () => {
    if (selectedNationality) {
      // يمكن إرسال البيانات إلى الخطوة التالية أو حفظها
      setLocation("/personal-information");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="text-sm opacity-70">
          23:59
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-8">
        <div className="space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-white">
              {language === "ar" ? "ما هي جنسيتك؟" : "What is your nationality?"}
            </h1>
            <p className="text-white/70 text-sm leading-relaxed px-2">
              {language === "ar" 
                ? "يجب أن تتطابق المعلومات مع جواز سفرك أو الهوية الصادرة عن الحكومة."
                : "The information must match your passport or government-issued ID."
              }
            </p>
          </div>

          {/* Country Selection */}
          <div className="space-y-4">
            <div className="text-white/80 text-sm font-medium">
              {language === "ar" ? "البلد/المنطقة" : "Country/Region"}
            </div>
            
            <div className="relative">
              <Select 
                value={selectedNationality} 
                onValueChange={setSelectedNationality}
                onOpenChange={setIsSelectOpen}
              >
                <SelectTrigger className="w-full h-14 bg-gray-800/50 border-gray-600 text-white rounded-2xl px-4 text-left">
                  <div className="flex items-center gap-3">
                    {selectedCountry && (
                      <>
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span className="font-medium">
                          {language === "ar" ? selectedCountry.name : selectedCountry.nameEn}
                        </span>
                      </>
                    )}
                    {!selectedCountry && (
                      <span className="text-gray-400">
                        {language === "ar" ? "اختر البلد" : "Select Country"}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`h-5 w-5 text-white transition-transform ${isSelectOpen ? "rotate-180" : ""}`} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-white max-h-60">
                  {countries.map((country) => (
                    <SelectItem 
                      key={country.code} 
                      value={country.code}
                      className="hover:bg-gray-700 focus:bg-gray-700 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{country.flag}</span>
                        <span className="font-medium">
                          {language === "ar" ? country.name : country.nameEn}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notice Text */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-600/50">
            <p className="text-white/60 text-xs leading-relaxed">
              {language === "ar" 
                ? "إشعار: أنت تتفهم أن ترويج و/أو توزيع الخدمات خارج هونغ كونغ قد يتطلب ترخيصاً وأنك تؤكد أنك تصل وتسجل للحصول على نفس الشيء بمبادرتك الخاصة دون ترويج نشط و/أو التماس من المجموعة، أي من شركات مجموعتها و/أو أي من الشركات التابعة لها أو المرتبطة بها أو الأشخاص المتصلين بها."
                : "Notice: You understand that the promotion and/or distribution of the Services outside of Hong Kong may require a licence and that you confirm you are accessing and registering for the same on your own initiative without active promotion and/or solicitation from the Group, any of its group companies and/or any of its affiliated, associated or connected persons."
              }
            </p>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="mt-auto pt-8">
          <Button
            onClick={handleNext}
            disabled={!selectedNationality}
            className="w-full h-12 bg-white text-black font-semibold rounded-full hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 transition-all duration-200"
          >
            {language === "ar" ? "التالي" : "Next"}
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6">
          <div className="w-16 h-1 bg-white/30 rounded-full">
            <div className="w-4 h-1 bg-white rounded-full transition-all duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}