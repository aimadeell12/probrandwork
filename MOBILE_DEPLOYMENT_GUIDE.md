# دليل نشر تطبيق PayDota المحمول

## نظرة عامة
تم تحويل تطبيق PayDota بنجاح إلى تطبيق محمول باستخدام Capacitor مع إعداد نشر تلقائي عبر GitHub Actions.

## الميزات المُنفذة

### 1. تكامل Capacitor
- ✅ إعداد Capacitor مع Android و iOS
- ✅ 9 إضافات محمولة مُكاملة
- ✅ إدارة شريط الحالة وشاشة البداية
- ✅ تكامل لوحة المفاتيح ونمط المنطقة الآمنة

### 2. الميزات المحمولة
- ✅ ردود الفعل اللمسية للمدفوعات والبطاقات
- ✅ إشعارات Toast أصلية
- ✅ مشاركة المحتوى
- ✅ معلومات الجهاز وحالة الشبكة
- ✅ تصميم متجاوب للجوال

### 3. GitHub Actions CI/CD
- ✅ بناء تلقائي للأندرويد و iOS
- ✅ نشر تلقائي لمتاجر التطبيقات
- ✅ إدارة التوقيع والشهادات

## البنية الفنية

### الملفات الرئيسية
```
PayDota/
├── capacitor.config.ts        # إعدادات التطبيق
├── build-android.sh          # بناء أندرويد
├── build-ios.sh              # بناء iOS
├── mobile-build.sh           # أدوات البناء الشاملة
├── client/src/lib/capacitor.ts # إدارة الميزات المحمولة
├── client/src/hooks/useMobile.ts # Hook مخصص للجوال
├── .github/workflows/        # سير عمل النشر التلقائي
│   ├── build-mobile.yml      # بناء التطبيقات
│   └── release-mobile.yml    # نشر الإنتاج
├── android/                  # مشروع أندرويد
└── ios/                     # مشروع iOS
```

### الإضافات المُكاملة
1. **@capacitor/app** - إدارة حالة التطبيق
2. **@capacitor/device** - معلومات الجهاز
3. **@capacitor/haptics** - ردود الفعل اللمسية
4. **@capacitor/keyboard** - إدارة لوحة المفاتيح
5. **@capacitor/network** - حالة الشبكة
6. **@capacitor/share** - مشاركة المحتوى
7. **@capacitor/splash-screen** - شاشة البداية
8. **@capacitor/status-bar** - شريط الحالة
9. **@capacitor/toast** - إشعارات Toast

## طرق البناء والنشر

### 1. التطوير المحلي
```bash
# بناء الأصول
npm run build

# مزامنة المنصات
npx cap sync

# فتح أندرويد ستوديو
./build-android.sh

# فتح Xcode (macOS فقط)
./build-ios.sh
```

### 2. النشر التلقائي
يتم تشغيل GitHub Actions تلقائياً عند:
- Push إلى main/master (بناء تطويري)
- إنشاء Release (نشر إنتاجي)

### 3. متطلبات الأسرار
للنشر التلقائي، أضف هذه الأسرار في GitHub:

#### أندرويد:
- `ANDROID_SIGNING_KEY`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_PASSWORD`
- `GOOGLE_PLAY_SERVICE_ACCOUNT`

#### iOS:
- `IOS_DIST_SIGNING_KEY`
- `IOS_DIST_SIGNING_KEY_PASSWORD`
- `APPSTORE_ISSUER_ID`
- `APPSTORE_KEY_ID`
- `APPSTORE_PRIVATE_KEY`

## الاستخدام في الكود

### Hook المخصص
```typescript
import { useMobile } from '@/hooks/useMobile';

function PaymentComponent() {
  const { 
    isNative, 
    paymentFeedback, 
    toast, 
    vibrate 
  } = useMobile();

  const handlePayment = async () => {
    // عملية الدفع
    await paymentFeedback.success();
    await toast('تم الدفع بنجاح');
  };
}
```

### استخدام مباشر
```typescript
import { 
  triggerHaptic, 
  showToast, 
  shareContent 
} from '@/lib/capacitor';

// ردة فعل لمسية
await triggerHaptic(ImpactStyle.Heavy);

// إشعار
await showToast('رسالة للمستخدم', 'short');

// مشاركة
await shareContent('PayDota', 'تطبيق البنك الرقمي', 'https://paydota.com');
```

## الخطوات التالية

### 1. إعداد الأيقونات
- أضف أيقونة التطبيق (1024x1024) في `resources/icon.png`
- أضف شاشة البداية في `resources/splash.png`
- قم بتشغيل: `npx capacitor-assets generate`

### 2. إعداد متاجر التطبيقات
- قم بإنشاء حساب مطور في Google Play Console
- قم بإنشاء حساب مطور في Apple Developer Program
- أعد إعداد الشهادات والمفاتيح

### 3. اختبار التطبيق
```bash
# اختبار على أندرويد
npx cap run android

# اختبار على iOS
npx cap run ios
```

## المشاكل الشائعة والحلول

### مشكلة: خطأ في البناء
**الحل**: تأكد من تشغيل `npm run build` قبل `npx cap sync`

### مشكلة: الأيقونات لا تظهر
**الحل**: أضف الأيقونات في `resources/` وقم بتشغيل `npx capacitor-assets generate`

### مشكلة: فشل في النشر التلقائي
**الحل**: تحقق من وجود جميع الأسرار المطلوبة في GitHub Secrets

## الدعم والصيانة
- تحقق من تحديثات Capacitor شهرياً
- راجع سجلات GitHub Actions للتأكد من نجاح عمليات النشر
- اختبر التطبيق على أجهزة مختلفة قبل كل إصدار

## معلومات إضافية
- [وثائق Capacitor](https://capacitorjs.com/docs)
- [دليل Google Play](https://developer.android.com/distribute/google-play)
- [دليل App Store](https://developer.apple.com/app-store/)