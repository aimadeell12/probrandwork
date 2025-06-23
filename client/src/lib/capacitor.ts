import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Toast } from '@capacitor/toast';
import { Share } from '@capacitor/share';

// Mobile platform detection
export const isNativePlatform = Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform();

// Status Bar Configuration
export const setupStatusBar = async () => {
  if (isNativePlatform) {
    try {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      await StatusBar.setOverlaysWebView({ overlay: false });
    } catch (error) {
      console.warn('Status bar setup failed:', error);
    }
  }
};

// Splash Screen Management
export const hideSplashScreen = async () => {
  if (isNativePlatform) {
    try {
      await SplashScreen.hide();
    } catch (error) {
      console.warn('Splash screen hide failed:', error);
    }
  }
};

// Keyboard Management
export const setupKeyboard = () => {
  if (isNativePlatform) {
    Keyboard.addListener('keyboardWillShow', (info) => {
      document.body.style.paddingBottom = `${info.keyboardHeight}px`;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      document.body.style.paddingBottom = '0px';
    });
  }
};

// Network Status
export const getNetworkStatus = async () => {
  if (isNativePlatform) {
    try {
      return await Network.getStatus();
    } catch (error) {
      console.warn('Network status check failed:', error);
      return { connected: true, connectionType: 'unknown' };
    }
  }
  return { connected: navigator.onLine, connectionType: 'unknown' };
};

// Device Information
export const getDeviceInfo = async () => {
  if (isNativePlatform) {
    try {
      return await Device.getInfo();
    } catch (error) {
      console.warn('Device info failed:', error);
      return null;
    }
  }
  return null;
};

// App State Management
export const setupAppStateListener = (onResume?: () => void, onPause?: () => void) => {
  if (isNativePlatform) {
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive && onResume) {
        onResume();
      } else if (!isActive && onPause) {
        onPause();
      }
    });
  }
};

// Haptic Feedback
export const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Medium) => {
  if (isNativePlatform) {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }
};

// Toast Messages
export const showToast = async (text: string, duration: 'short' | 'long' = 'short') => {
  if (isNativePlatform) {
    try {
      await Toast.show({
        text,
        duration: duration === 'short' ? 'short' : 'long',
        position: 'bottom'
      });
    } catch (error) {
      console.warn('Toast show failed:', error);
    }
  } else {
    // Fallback for web - you might want to use your existing toast system
    console.log('Toast:', text);
  }
};

// Share Content
export const shareContent = async (title: string, text: string, url?: string) => {
  if (isNativePlatform) {
    try {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: 'مشاركة PayDota'
      });
    } catch (error) {
      console.warn('Share failed:', error);
    }
  } else {
    // Fallback to Web Share API
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        console.warn('Web share failed:', error);
      }
    } else {
      // Copy to clipboard as fallback
      if (navigator.clipboard && url) {
        await navigator.clipboard.writeText(url);
        console.log('Link copied to clipboard');
      }
    }
  }
};

// Initialize all mobile features
export const initializeMobileApp = async () => {
  if (isNativePlatform) {
    await setupStatusBar();
    setupKeyboard();
    setupAppStateListener(
      () => console.log('App resumed'),
      () => console.log('App paused')
    );
    
    // Hide splash screen after a delay
    setTimeout(() => {
      hideSplashScreen();
    }, 1000);
  }
};

// Payment-specific mobile features
export const handlePaymentSuccess = async () => {
  await triggerHaptic(ImpactStyle.Heavy);
  await showToast('تم الدفع بنجاح', 'short');
};

export const handlePaymentError = async () => {
  await triggerHaptic(ImpactStyle.Light);
  await showToast('فشل في الدفع، حاول مرة أخرى', 'long');
};

// Card operations feedback
export const handleCardCreated = async () => {
  await triggerHaptic(ImpactStyle.Medium);
  await showToast('تم إنشاء البطاقة بنجاح', 'short');
};

export const handleCardBlocked = async () => {
  await triggerHaptic(ImpactStyle.Heavy);
  await showToast('تم حجب البطاقة', 'short');
};