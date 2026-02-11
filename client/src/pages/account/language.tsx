import { ArrowLeft, Globe, Check } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function LanguageSettings() {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const languages = [
    { code: 'ar', name: 'العربية', nativeName: 'العربية' },
    { code: 'en', name: 'English', nativeName: 'English' }
  ];

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as 'ar' | 'en');
    toast({
      title: t("success"),
      description: t("languageChanged"),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-red-900 dark:to-blue-900 relative overflow-hidden pb-20">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-red-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-yellow-200/30 dark:border-red-700/30 p-4 relative z-10">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/account")}
            className="p-2 hover:bg-yellow-50 dark:hover:bg-red-900/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('language')}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 relative z-10 max-w-md">
        
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-yellow-200/30 dark:border-red-700/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 space-x-reverse text-gray-900 dark:text-white">
              <Globe className="h-5 w-5 text-primary dark:text-red-400" />
              <span>{t('selectAppLanguage')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                  language === lang.code
                    ? 'border-red-500 bg-yellow-50 dark:bg-red-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'
                }`}
              >
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {lang.nativeName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {lang.name}
                  </p>
                </div>
                {language === lang.code && (
                  <Check className="h-5 w-5 text-primary dark:text-red-400" />
                )}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}