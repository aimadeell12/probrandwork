import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={`border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors bg-white shadow-sm ${className || ''}`}
    >
      <Languages className="h-4 w-4 mr-2 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">
        {language === "ar" ? "العربية" : "English"}
      </span>
    </Button>
  );
}