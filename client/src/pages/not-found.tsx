import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";

export default function NotFound() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-gray-900 dark:via-red-900 dark:to-red-900 relative overflow-hidden px-4">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      
      <Card className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-xl rounded-3xl relative z-10">
        <CardContent className="pt-8 pb-20 px-6 text-center">
          
          {/* 404 Number */}
          <div className="text-8xl font-bold text-red-600 dark:text-red-400 mb-4 opacity-20">
            404
          </div>
          
          {/* Icon and Title */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("pageNotFound") || "الصفحة غير موجودة"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {t("pageNotFoundDescription") || "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/dashboard">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                {t("goHome") || "العودة للرئيسية"}
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl py-3 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("goBack") || "العودة للخلف"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
