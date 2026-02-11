# إعداد توقيع تطبيق BrandSoft Pay للأندرويد

## نظرة عامة
تم تكوين تطبيق BrandSoft Pay بنجاح لاستخدام keystore مخصص للتوقيع الرقمي وإنتاج APK جاهز للنشر.

## إعداد Keystore
- **ملف Keystore**: `signing_1750723138194.keystore`
- **موقع الملف**: `android/app/signing_1750723138194.keystore`
- **Key Alias**: `brandsoft-pay`
- **كلمات المرور**: غير مطلوبة (keystore بدون حماية)

## ملفات التكوين

### 1. Android Build Configuration
الملف: `android/app/build.gradle`
```gradle
signingConfigs {
    release {
        storeFile file('signing_1750723138194.keystore')
        keyAlias 'brandsoft-pay'
        storePassword ''
        keyPassword ''
    }
}
```

### 2. Gradle Properties
الملف: `android/gradle.properties`
```properties
PAYDOTA_KEYSTORE_FILE=signing_1750723138194.keystore
PAYDOTA_KEY_ALIAS=brandsoft-pay
PAYDOTA_STORE_PASSWORD=
PAYDOTA_KEY_PASSWORD=
```

### 3. ProGuard Rules
الملف: `android/app/proguard-rules.pro`
- حماية classes الخاصة بـ Capacitor
- حماية classes الخاصة بـ BrandSoft Pay

## أوامر البناء

### البناء المحلي
```bash
# بناء APK موقع للإنتاج
./build-signed-apk.sh

# أو يدوياً
npm run build
npx cap copy android
cd android && ./gradlew assembleRelease
```

### البناء التلقائي (GitHub Actions)
```bash
# يتم تشغيله تلقائياً عند push إلى main
git push origin main

# أو عند إنشاء release
git tag v1.0.0
git push origin v1.0.0
```

## ملفات الإخراج

### APK الموقع
- **موقع الملف**: `android/app/build/outputs/apk/release/app-release.apk`
- **الحجم المتوقع**: ~10-15 MB
- **نوع التوقيع**: Release مع keystore مخصص

### معلومات التطبيق
```
Package ID: com.brandsoft-pay.banking
Version Name: 1.0.0
Version Code: 1
Min SDK: 24 (Android 7.0)
Target SDK: 34 (Android 14)
```

## اختبار APK

### التثبيت على الجهاز
```bash
# تمكين مصادر غير معروفة في إعدادات الأندرويد
adb install android/app/build/outputs/apk/release/app-release.apk

# أو نسخ الملف وتثبيته يدوياً
```

### فحص التوقيع
```bash
# التحقق من توقيع APK
jarsigner -verify -verbose android/app/build/outputs/apk/release/app-release.apk

# عرض معلومات التوقيع
keytool -printcert -jarfile android/app/build/outputs/apk/release/app-release.apk
```

## النشر على Google Play Store

### متطلبات النشر
1. **حساب مطور Google Play** (25$ رسوم لمرة واحدة)
2. **تطبيق موقع** بـ keystore الإنتاج
3. **وصف التطبيق** باللغة العربية والإنجليزية
4. **أيقونات** بدقة عالية (512x512)
5. **لقطات شاشة** من التطبيق

### خطوات النشر
1. إنشاء listing جديد في Google Play Console
2. رفع APK الموقع
3. إكمال معلومات التطبيق
4. تعيين أسعار والتوزيع
5. مراجعة Google (1-3 أيام)

## النشر التلقائي

### إعداد GitHub Secrets
لتفعيل النشر التلقائي، أضف:
```
GOOGLE_PLAY_SERVICE_ACCOUNT: [JSON لحساب الخدمة]
```

### سير العمل التلقائي
1. **تطوير**: push إلى main → بناء APK تطويري
2. **إنتاج**: إنشاء release → بناء ونشر تلقائي

## استكشاف الأخطاء

### مشاكل شائعة
```bash
# خطأ في التوقيع
خطأ: Failed to sign APK
حل: تحقق من وجود keystore في المسار الصحيح

# خطأ في البناء
خطأ: Task assembleRelease failed
حل: تحقق من إعدادات Android SDK

# خطأ في رفع Google Play
خطأ: Upload key certificate
حل: استخدم نفس keystore لجميع التحديثات
```

### سجلات التشخيص
```bash
# عرض تفاصيل البناء
cd android && ./gradlew assembleRelease --info

# فحص APK
aapt dump badging app-release.apk

# تحليل حجم APK
bundletool build-apks --bundle=app-release.aab --output=app.apks
```

## الأمان

### حماية Keystore
- ✅ نسخ احتياطية آمنة
- ✅ عدم مشاركة الملف
- ✅ استخدام نفس keystore للتحديثات
- ⚠️ فقدان keystore = عدم القدرة على تحديث التطبيق

### أفضل الممارسات
1. احتفظ بنسخة احتياطية من keystore
2. استخدم كلمات مرور قوية (عند اللزوم)
3. لا تشارك keystore في مستودعات عامة
4. استخدم متغيرات البيئة للمعلومات الحساسة

## الدعم الفني
- تحقق من documentation الرسمي لـ Capacitor
- راجع Android Developer Guidelines
- استخدم Google Play Console Help Center للمساعدة في النشر