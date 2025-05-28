import { useCallback, useEffect } from 'react';

interface HapticOptions {
  type?: 'light' | 'medium' | 'heavy';
  duration?: number;
}

export const useNativeInteractions = () => {
  // محاكاة الاهتزاز للمس
  const triggerHaptic = useCallback((options: HapticOptions = {}) => {
    const { type = 'light', duration = 10 } = options;
    
    // التحقق من دعم الاهتزاز في المتصفح
    if ('vibrate' in navigator) {
      let pattern: number | number[] = duration;
      
      switch (type) {
        case 'light':
          pattern = 10;
          break;
        case 'medium':
          pattern = 20;
          break;
        case 'heavy':
          pattern = [30, 10, 30];
          break;
      }
      
      navigator.vibrate(pattern);
    }
  }, []);

  // منع التحديد النصي على اللمس (نمط iOS)
  const preventTextSelection = useCallback((element: HTMLElement) => {
    element.style.webkitUserSelect = 'none';
    element.style.userSelect = 'none';
    element.style.webkitTouchCallout = 'none';
  }, []);

  // تحسين التمرير السلس
  const enableSmoothScrolling = useCallback(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  // إضافة فئات CSS للتفاعلات الأصلية
  const addNativeClasses = useCallback((element: HTMLElement, type: 'button' | 'card' | 'input' = 'button') => {
    const baseClasses = ['native-focus'];
    
    switch (type) {
      case 'button':
        baseClasses.push('native-button', 'haptic-light', 'touch-target');
        break;
      case 'card':
        baseClasses.push('native-card', 'haptic-medium');
        break;
      case 'input':
        baseClasses.push('native-focus');
        break;
    }
    
    element.classList.add(...baseClasses);
    preventTextSelection(element);
  }, [preventTextSelection]);

  // تحسين الأداء للرسوم المتحركة
  const optimizeForMobile = useCallback(() => {
    // تحسين عرض الشاشة
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }

    // إضافة meta tag للتطبيقات المحمولة
    const appleMobileWebApp = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!appleMobileWebApp) {
      const meta = document.createElement('meta');
      meta.name = 'apple-mobile-web-app-capable';
      meta.content = 'yes';
      document.head.appendChild(meta);
    }

    // إضافة meta tag لشريط الحالة
    const statusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!statusBar) {
      const meta = document.createElement('meta');
      meta.name = 'apple-mobile-web-app-status-bar-style';
      meta.content = 'default';
      document.head.appendChild(meta);
    }
  }, []);

  // إيقاف تأثيرات المتصفح الافتراضية
  const disableBrowserDefaults = useCallback(() => {
    // إيقاف الزووم المزدوج
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());

    // إيقاف التحديد الطويل
    document.addEventListener('selectstart', (e) => {
      if ((e.target as HTMLElement).closest('.native-button, .native-card')) {
        e.preventDefault();
      }
    });

    // منع السحب على الصور والروابط
    document.addEventListener('dragstart', (e) => {
      if ((e.target as HTMLElement).tagName === 'IMG' || 
          (e.target as HTMLElement).closest('a, button')) {
        e.preventDefault();
      }
    });
  }, []);

  // تهيئة التحسينات عند تحميل الصفحة
  useEffect(() => {
    optimizeForMobile();
    enableSmoothScrolling();
    disableBrowserDefaults();
  }, [optimizeForMobile, enableSmoothScrolling, disableBrowserDefaults]);

  return {
    triggerHaptic,
    addNativeClasses,
    preventTextSelection,
    enableSmoothScrolling,
    optimizeForMobile
  };
};