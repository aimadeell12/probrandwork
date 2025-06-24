import { useState, useEffect } from 'react';
import { getNetworkStatus } from '@/lib/capacitor';

interface NetworkStatus {
  connected: boolean;
  connectionType: string;
}

export const useNetwork = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({ 
    connected: true, 
    connectionType: 'unknown' 
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkNetworkStatus = async () => {
    try {
      const status = await getNetworkStatus();
      setNetworkStatus(status);
    } catch (error) {
      console.warn('Network status check failed:', error);
      setNetworkStatus({ connected: false, connectionType: 'unknown' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkNetworkStatus();

    // Set up network status monitoring
    const interval = setInterval(checkNetworkStatus, 5000); // Check every 5 seconds

    // Listen for online/offline events in web environment
    const handleOnline = () => {
      setNetworkStatus(prev => ({ ...prev, connected: true }));
    };

    const handleOffline = () => {
      setNetworkStatus(prev => ({ ...prev, connected: false }));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  return {
    isOnline: networkStatus.connected,
    connectionType: networkStatus.connectionType,
    isLoading,
    checkNetwork: checkNetworkStatus
  };
};