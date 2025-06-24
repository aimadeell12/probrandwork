import { useState, useEffect } from 'react';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getNetworkStatus } from '@/lib/capacitor';

interface OfflineErrorProps {
  onRetry?: () => void;
}

export const OfflineError = ({ onRetry }: OfflineErrorProps) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const status = await getNetworkStatus();
      if (status.connected) {
        onRetry?.();
      }
    } catch (error) {
      console.warn('Network retry failed:', error);
    } finally {
      setTimeout(() => setIsRetrying(false), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-8 safe-area-top safe-area-bottom">
      <div className="text-center max-w-sm mx-auto w-full">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-xl font-bold text-black mb-3">
          Web page not available
        </h1>

        {/* Error Description */}
        <div className="mb-6 space-y-3 text-right">
          <p className="text-gray-800 text-sm leading-relaxed">
            The web page at <span className="font-medium">https://paydota.replit.app/</span> could not be loaded because:
          </p>
        </div>

        {/* Error Code */}
        <div className="mb-8 p-3 bg-gray-50 rounded-lg border">
          <p className="text-sm font-mono text-gray-700 text-left" dir="ltr">
            net::ERR_INTERNET_DISCONNECTED
          </p>
        </div>

        {/* Retry Button */}
        <Button 
          onClick={handleRetry}
          disabled={isRetrying}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md font-medium text-sm"
        >
          {isRetrying ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              محاولة الاتصال...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </div>
          )}
        </Button>

        {/* Additional Help Text */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-gray-600">
            تحقق من اتصالك بالإنترنت وحاول مرة أخرى
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>لا يوجد اتصال بالإنترنت</span>
          </div>
        </div>
      </div>
    </div>
  );
};