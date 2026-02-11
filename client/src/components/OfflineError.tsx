import { useState } from 'react';
import { RefreshCw, WifiOff, Home, CloudOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
      setTimeout(() => setIsRetrying(false), 1500);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-gray-900 dark:via-red-900 dark:to-red-900 relative overflow-hidden px-4" data-testid="offline-error-page">
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-orange-200/10 to-red-200/10 rounded-full blur-3xl"></div>
      
      <Card className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 shadow-xl rounded-3xl relative z-10">
        <CardContent className="pt-8 pb-8 px-6 text-center">
          
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center mb-5 shadow-lg">
              <WifiOff className="h-10 w-10 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3" data-testid="text-offline-title">
              No Internet Connection
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs" data-testid="text-offline-description">
              Please check your internet connection and try again. We'll be right here when you're back online.
            </p>
          </div>

          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-center gap-3">
              <CloudOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                ERR_INTERNET_DISCONNECTED
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400" data-testid="text-connection-status">
              Connection unavailable
            </span>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full bg-primary hover:bg-red-700 text-white rounded-xl py-3 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all duration-200"
              data-testid="button-retry"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Reconnecting...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Tip: Make sure you're connected to Wi-Fi or mobile data
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
