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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-8">
      <div className="text-center max-w-sm mx-auto">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          لا يمكن الوصول للصفحة
        </h1>

        {/* Error Description */}
        <div className="mb-6 space-y-3">
          <p className="text-gray-600 text-base leading-relaxed">
            لا يمكن تحميل صفحة الويب على العنوان
          </p>
          <p className="text-sm text-blue-600 font-medium bg-gray-50 p-2 rounded">
            https://paydota.replit.app/
          </p>
          <p className="text-gray-600 text-base">
            بسبب:
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
        >
          {isRetrying ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              جاري المحاولة...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Wifi className="w-4 h-4" />
              إعادة المحاولة
            </div>
          )}
        </Button>

        {/* Additional Help Text */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-500">
            تأكد من اتصالك بالإنترنت وحاول مرة أخرى
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span>غير متصل</span>
          </div>
        </div>
      </div>
    </div>
  );
};