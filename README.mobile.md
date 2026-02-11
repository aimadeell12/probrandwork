# PayDota Mobile App Setup

هذا الدليل يوضح كيفية تحويل تطبيق PayDota إلى تطبيق جوال باستخدام Capacitor وإعداد النشر التلقائي عبر GitHub Actions.

## متطلبات النظام

### للتطوير العام:
- Node.js 20 أو أحدث
- npm أو yarn

### لتطوير Android:
- Java JDK 17
- Android Studio
- Android SDK

### لتطوير iOS:
- macOS
- Xcode 14 أو أحدث
- iOS Simulator

## إعداد التطبيق المحمول

### 1. بناء الأصول للويب
```bash
npm run build
```

### 2. تهيئة Capacitor
```bash
./mobile-build.sh init
```

### 3. إضافة المنصات

#### Android:
```bash
./mobile-build.sh android
```

#### iOS:
```bash
./mobile-build.sh ios
```

### 4. مزامنة الأصول
```bash
./mobile-build.sh sync
```

### 5. فتح المشروع في IDE

#### Android Studio:
```bash
./mobile-build.sh open-android
```

#### Xcode:
```bash
./mobile-build.sh open-ios
```

## إعداد GitHub Actions

### متطلبات الأسرار (Secrets):

#### للأندرويد:
- `ANDROID_SIGNING_KEY`: مفتاح التوقيع بتنسيق base64
- `ANDROID_KEY_ALIAS`: اسم المفتاح
- `ANDROID_KEYSTORE_PASSWORD`: كلمة مرور المتجر
- `ANDROID_KEY_PASSWORD`: كلمة مرور المفتاح
- `GOOGLE_PLAY_SERVICE_ACCOUNT`: حساب خدمة Google Play

#### لـ iOS:
- `IOS_DIST_SIGNING_KEY`: شهادة التوزيع بتنسيق base64
- `IOS_DIST_SIGNING_KEY_PASSWORD`: كلمة مرور الشهادة
- `APPSTORE_ISSUER_ID`: معرف المُصدر
- `APPSTORE_KEY_ID`: معرف مفتاح API
- `APPSTORE_PRIVATE_KEY`: المفتاح الخاص

### سير العمل التلقائي:

1. **Build Mobile**: يتم تشغيله عند كل push لـ main/master
2. **Release Mobile**: يتم تشغيله عند إنشاء release جديد

## بنية المشروع

```
PayDota/
├── capacitor.config.ts        # إعدادات Capacitor
├── mobile-build.sh           # سكريبت بناء التطبيق
├── vite.mobile.config.ts     # إعدادات Vite للجوال
├── resources/                # أيقونات وموارد التطبيق
├── android/                  # مشروع Android
├── ios/                     # مشروع iOS
└── .github/workflows/       # سير عمل GitHub Actions
```

## إعداد الأيقونات والموارد

1. ضع أيقونة التطبيق (1024x1024) في `resources/icon.png`
2. ضع شاشة البداية في `resources/splash.png`
3. قم بتشغيل: `npx capacitor-assets generate`

## اختبار التطبيق

### على Android:
```bash
npx cap run android
```

### على iOS:
```bash
npx cap run ios
```

## نصائح مهمة

1. **تطوير محلي**: استخدم `npm run dev` للتطوير العادي
2. **بناء الإنتاج**: استخدم `npm run build` قبل المزامنة
3. **تحديث المنصات**: قم بتشغيل `npx cap sync` بعد تغيير الكود
4. **إعدادات الأمان**: تأكد من إعداد HTTPS في الإنتاج

## استكشاف الأخطاء

### مشاكل شائعة:
- **خطأ في البناء**: تأكد من تشغيل `npm run build` أولاً
- **مشاكل المنصة**: احذف مجلد `android/` أو `ios/` وأعد إضافة المنصة
- **مشاكل المزامنة**: قم بتشغيل `npx cap sync --force`

## المزيد من المعلومات

- [وثائق Capacitor](https://capacitorjs.com/docs)
- [دليل Android](https://capacitorjs.com/docs/android)
- [دليل iOS](https://capacitorjs.com/docs/ios)