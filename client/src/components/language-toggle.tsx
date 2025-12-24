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
      className={`border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors bg-white dark:bg-gray-800 shadow-sm ${className || ''}`}
    >
      <Languages className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {language === "ar" ? "العربية" : "English"}
      </span>
    </Button>
  );
}