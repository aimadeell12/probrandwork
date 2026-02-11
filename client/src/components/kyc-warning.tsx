import { AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/hooks/useLanguage";

interface KycWarningProps {
  status: string | null;
  message: string;
}

export default function KycWarning({ status, message }: KycWarningProps) {
  const { t, language } = useLanguage();

  const getStatusColor = () => {
    if (status === "pending" || status === "under_review") {
      return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
    }
    if (status === "rejected") {
      return "bg-yellow-50 dark:bg-red-900/20 border-yellow-200 dark:border-red-800";
    }
    return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
  };

  const getTextColor = () => {
    if (status === "pending" || status === "under_review") {
      return "text-yellow-800 dark:text-yellow-200";
    }
    if (status === "rejected") {
      return "text-red-800 dark:text-red-200";
    }
    return "text-orange-800 dark:text-orange-200";
  };

  return (
    <Alert className={`${getStatusColor()} mb-4 lg:mb-6`} data-testid="alert-kyc-warning">
      <AlertTriangle className={`h-4 w-4 ${getTextColor()}`} />
      <AlertTitle className={getTextColor()}>
        {language === 'ar' ? 'تحقق من الهوية مطلوب' : 'Identity Verification Required'}
      </AlertTitle>
      <AlertDescription className={`${getTextColor()} space-y-2`}>
        <p>{message}</p>
        {(!status || status === "rejected") && (
          <Link href="/kyc-verification">
            <Button size="sm" variant="default" className="mt-2" data-testid="button-verify-now">
              {language === 'ar' ? 'تحقق الآن' : 'Verify Now'}
            </Button>
          </Link>
        )}
      </AlertDescription>
    </Alert>
  );
}
