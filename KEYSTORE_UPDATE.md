# تحديث Keystore - PayDota

## المعلومات الجديدة

**ملف Keystore:**
- الاسم: `signing.keystore` (من `signing_1750726650743.keystore`)
- كلمة مرور المتجر: `_qvpL88F8qhe`
- اسم المفتاح: `my-key-alias`
- كلمة مرور المفتاح: `_qvpL88F8qhe`

## التحديثات المطبقة

### 1. Android Build Configuration
تم تحديث `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file('signing.keystore')
        keyAlias 'my-key-alias'
        storePassword '_qvpL88F8qhe'
        keyPassword '_qvpL88F8qhe'
    }
}
```

### 2. GitHub Actions Workflows
تم تحديث workflows للاستخدام keystore الجديد:
- `.github/workflows/build-android.yml`
- `.github/workflows/deploy-play-store.yml`

### 3. Build Scripts
تم تحديث `build-apk.sh` و `test-build.sh` لنسخ keystore الجديد.

## الأمان

**ملاحظات مهمة:**
- كلمة المرور مخزنة في ملف البناء (للتطوير)
- للإنتاج: يُنصح بحفظ كلمة المرور في متغيرات البيئة
- keystore محفوظ في المستودع للبناء التلقائي

## الاستخدام

البناء يعمل الآن بالطريقة العادية:
```bash
./build-apk.sh
npx cap open android
cd android && ./gradlew assembleRelease
```

GitHub Actions سيستخدم keystore الجديد تلقائياً عند الدفع للمستودع.