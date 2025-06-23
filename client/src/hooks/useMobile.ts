import { useState, useEffect } from 'react';
import { 
  isNativePlatform, 
  getPlatform, 
  getNetworkStatus, 
  getDeviceInfo,
  triggerHaptic,
  showToast,
  shareContent,
  handlePaymentSuccess,
  handlePaymentError,
  handleCardCreated,
  handleCardBlocked
} from '@/lib/capacitor';
import { ImpactStyle } from '@capacitor/haptics';

interface NetworkStatus {
  connected: boolean;
  connectionType: string;
}

interface DeviceInfo {
  model?: string;
  platform?: string;
  operatingSystem?: string;
  osVersion?: string;
  manufacturer?: string;
  isVirtual?: boolean;
  webViewVersion?: string;
}

export const useMobile = () => {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState('web');
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({ connected: true, connectionType: 'unknown' });
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    const initializeMobileFeatures = async () => {
      setIsNative(isNativePlatform);
      setPlatform(getPlatform());
      
      try {
        const network = await getNetworkStatus();
        setNetworkStatus(network);
        
        const device = await getDeviceInfo();
        setDeviceInfo(device);
      } catch (error) {
        console.warn('Failed to initialize mobile features:', error);
      }
    };

    initializeMobileFeatures();
  }, []);

  const vibrate = async (style: ImpactStyle = ImpactStyle.Medium) => {
    await triggerHaptic(style);
  };

  const toast = async (message: string, duration: 'short' | 'long' = 'short') => {
    await showToast(message, duration);
  };

  const share = async (title: string, text: string, url?: string) => {
    await shareContent(title, text, url);
  };

  const paymentFeedback = {
    success: handlePaymentSuccess,
    error: handlePaymentError,
  };

  const cardFeedback = {
    created: handleCardCreated,
    blocked: handleCardBlocked,
  };

  return {
    // Platform info
    isNative,
    platform,
    networkStatus,
    deviceInfo,
    
    // Actions
    vibrate,
    toast,
    share,
    
    // Specialized feedback
    paymentFeedback,
    cardFeedback,
    
    // Utilities
    isOnline: networkStatus.connected,
    isAndroid: platform === 'android',
    isIOS: platform === 'ios',
    isWeb: platform === 'web',
  };
};

export default useMobile;