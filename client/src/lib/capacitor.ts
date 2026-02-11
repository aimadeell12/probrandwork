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
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';

// Mobile platform detection
export const isNativePlatform = Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform();

// Status Bar Configuration
export const setupStatusBar = async () => {
  if (isNativePlatform) {
    try {
      const isDark = document.documentElement.classList.contains('dark');
      
      if (isDark) {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#0f172a' });
      } else {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
      }
      
      await StatusBar.setOverlaysWebView({ overlay: false });
      
      // Set navigation bar color to match app theme
      if (getPlatform() === 'android') {
        const existingStyle = document.getElementById('android-nav-style');
        if (!existingStyle) {
          const style = document.createElement('style');
          style.id = 'android-nav-style';
          style.textContent = `
            :root {
              --ion-safe-area-bottom: env(safe-area-inset-bottom);
            }
            body {
              --ion-color-primary: #9333EA;
            }
          `;
          document.head.appendChild(style);
        }
      }
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
        dialogTitle: 'مشاركة LM WORK MA'
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

// Prevent elastic scrolling behavior
export const preventElasticScrolling = () => {
  if (isNativePlatform) {
    // Allow controlled scrolling
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    document.body.style.width = '100%';
    document.body.style.height = '100vh';
    
    // Prevent elastic bounce on iOS
    document.addEventListener('touchmove', (e) => {
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest('[data-scrollable]') || target.closest('.overflow-y-auto') || target.closest('.overflow-auto');
      
      if (!scrollableParent) {
        e.preventDefault();
      } else {
        // Allow scrolling within designated scrollable areas
        const { scrollTop, scrollHeight, clientHeight } = scrollableParent;
        const reachedTop = scrollTop === 0;
        const reachedBottom = scrollTop + clientHeight >= scrollHeight;
        
        if ((reachedTop && e.touches[0].clientY > e.touches[0].clientY) || 
            (reachedBottom && e.touches[0].clientY < e.touches[0].clientY)) {
          e.preventDefault();
        }
      }
    }, { passive: false });
    
    // Prevent pull-to-refresh
    document.addEventListener('touchstart', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-scrollable]') && !target.closest('.overflow-y-auto') && !target.closest('.overflow-auto')) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }
    }, { passive: false });
  }
};

// Initialize all mobile features
export const initializeMobileApp = async () => {
  if (isNativePlatform) {
    await setupStatusBar();
    setupKeyboard();
    preventElasticScrolling();
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

// Camera functionality
export const takePicture = async () => {
  if (isNativePlatform) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt // Camera or Gallery
      });
      return image;
    } catch (error) {
      console.warn('Camera failed:', error);
      return null;
    }
  }
  return null;
};

// File system operations
export const saveFile = async (data: string, fileName: string) => {
  if (isNativePlatform) {
    try {
      await Filesystem.writeFile({
        path: fileName,
        data: data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      await showToast('تم حفظ الملف بنجاح', 'short');
      return true;
    } catch (error) {
      console.warn('File save failed:', error);
      await showToast('فشل في حفظ الملف', 'short');
      return false;
    }
  }
  return false;
};

export const readFile = async (fileName: string) => {
  if (isNativePlatform) {
    try {
      const contents = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      return contents.data;
    } catch (error) {
      console.warn('File read failed:', error);
      return null;
    }
  }
  return null;
};

// Location services
export const getCurrentLocation = async () => {
  if (isNativePlatform) {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      return coordinates;
    } catch (error) {
      console.warn('Location failed:', error);
      return null;
    }
  }
  return null;
};

// Preferences/Storage
export const setPreference = async (key: string, value: string) => {
  if (isNativePlatform) {
    try {
      await Preferences.set({ key, value });
      return true;
    } catch (error) {
      console.warn('Preference set failed:', error);
      return false;
    }
  }
  return false;
};

export const getPreference = async (key: string) => {
  if (isNativePlatform) {
    try {
      const result = await Preferences.get({ key });
      return result.value;
    } catch (error) {
      console.warn('Preference get failed:', error);
      return null;
    }
  }
  return null;
};

// Download functionality
export const downloadFile = async (url: string, fileName: string) => {
  if (isNativePlatform) {
    try {
      // First fetch the file
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64Data = (reader.result as string).split(',')[1];
            await Filesystem.writeFile({
              path: fileName,
              data: base64Data,
              directory: Directory.Documents
            });
            await showToast(`تم تنزيل ${fileName} بنجاح`, 'short');
            resolve(true);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn('Download failed:', error);
      await showToast('فشل في التنزيل', 'short');
      return false;
    }
  }
  return false;
};

// Biometric authentication (fingerprint)
export const authenticateWithBiometric = async () => {
  if (isNativePlatform) {
    try {
      const deviceInfo = await getDeviceInfo();
      if (deviceInfo?.platform === 'android') {
        // For Android, we need to use a plugin for biometric authentication
        // This is a placeholder - you would need to add @capacitor-community/biometric-auth
        await showToast('المصادقة البيومترية متاحة', 'short');
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Biometric auth failed:', error);
      return false;
    }
  }
  return false;
};