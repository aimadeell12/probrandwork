# GitHub Actions للبناء التلقائي - PayDota

## الإعداد

### 1. سكريپت بناء AAB (Android App Bundle)
تم إنشاء `.github/workflows/build-aab.yml` لبناء AAB تلقائياً:

**المميزات:**
- بناء AAB عند كل push لفرع main/master
- دعم بناء Debug و Release
- توقيع AAB تلقائياً باستخدام Keystore
- رفع ملفات AAB كـ artifacts
- إنشاء release تلقائي مع AAB عند إضافة tag
- تشغيل يدوي من GitHub Actions

### 2. سكريپت البناء التلقائي للـ APK
تم إنشاء `.github/workflows/build-android.yml` للبناء التلقائي:

**المميزات:**
- بناء APK عند كل push للمستودع
- رفع ملفات APK كـ artifacts  
- إنشاء release تلقائي مع APK
- دعم النشر لـ Debug و Release

### 3. سكريپت النشر لمتجر Google Play
تم إنشاء `.github/workflows/deploy-play-store.yml` للنشر التلقائي:

**المتطلبات:**
- Google Play Console Service Account
- تفعيل Google Play Developer API

## كيفية الاستخدام

### إعداد Secrets لتوقيع AAB

#### الخطوة 1: إنشاء Keystore (مرة واحدة فقط)
```bash
keytool -genkey -v -keystore release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias release
```
احتفظ بهذا الملف بأمان!

#### الخطوة 2: تحويل Keystore إلى Base64
```bash
base64 -i release.jks > release.jks.base64
```

#### الخطوة 3: إضافة Secrets في GitHub
اذهب إلى **Settings → Secrets and variables → Actions** وأضف:

| Secret Name | الوصف |
|-------------|-------|
| `RELEASE_KEYSTORE` | محتوى ملف release.jks.base64 |
| `RELEASE_KEYSTORE_PASSWORD` | كلمة مرور Keystore |
| `RELEASE_KEY_ALIAS` | اسم المفتاح (عادةً `release`) |
| `RELEASE_KEY_PASSWORD` | كلمة مرور المفتاح (نفس كلمة مرور Keystore عادةً) |

### بناء AAB تلقائياً
```bash
# ادفع التغييرات إلى GitHub
git add .
git commit -m "تحديث التطبيق"
git push origin main
```

سيتم تلقائياً:
- بناء أصول الويب
- مزامنة Capacitor
- إنشاء AAB موقع
- رفع AAB كـ artifact

### إنشاء Release مع AAB
```bash
# أنشئ tag جديد
git tag v1.0.0
git push origin v1.0.0
```

سيتم تلقائياً:
- بناء AAB موقع
- إنشاء GitHub Release
- رفع AAB للتحميل

### تشغيل البناء يدوياً
1. اذهب إلى GitHub → Actions
2. اختر "Build Android AAB"
3. اضغط "Run workflow"
4. اختر نوع البناء (release/debug)

### البناء التلقائي للـ APK
```bash
# ادفع التغييرات إلى GitHub
git add .
git commit -m "تحديث التطبيق"
git push origin main
```

سيتم تلقائياً:
- بناء أصول الويب
- مزامنة Capacitor
- إنشاء APK موقع
- رفع APK كـ artifact
- إنشاء release جديد

### النشر لمتجر Google Play

#### الإعداد المطلوب:
1. **إنشاء Service Account في Google Cloud:**
   - اذهب إلى Google Cloud Console
   - أنشئ Service Account جديد
   - حمل ملف JSON للمفاتيح

2. **إضافة Secrets في GitHub:**
   ```
   GOOGLE_PLAY_SERVICE_ACCOUNT_JSON = محتوى ملف JSON
   ```

3. **تشغيل النشر:**
   ```bash
   # نشر بـ tag
   git tag v1.0.0
   git push origin v1.0.0
   
   # أو نشر يدوي من GitHub Actions
   ```

## الملفات المُنشأة

### 1. `.github/workflows/build-aab.yml`
- بناء AAB (Android App Bundle) على Ubuntu
- Node.js 20 + Java 17
- توقيع AAB باستخدام Keystore
- رفع AAB كـ artifacts
- إنشاء GitHub Release تلقائي عند إضافة tag
- دعم التشغيل اليدوي

### 2. `.github/workflows/build-android.yml`
- البناء على Ubuntu
- Node.js 20 + Java 17
- بناء Debug + Release APK
- رفع artifacts
- إنشاء releases

### 3. `.github/workflows/deploy-play-store.yml`  
- نشر تلقائي لمتجر Google Play
- دعم مسارات مختلفة (internal/alpha/beta/production)
- بناء AAB للمتجر

### 4. `metadata/android/`
- وصف التحديثات بالعربية والإنجليزية
- تلقائياً يُرفع مع التطبيق

## نصائح مهمة

### الأمان:
- keystore مُتضمن في المستودع (بدون كلمة مرور)
- Secrets محمية في GitHub
- بناء معزول في بيئة آمنة

### التحكم:
- يمكن تشغيل البناء يدوياً من GitHub Actions
- خيارات مسار النشر للمتجر
- artifacts متاحة للتحميل

### المراقبة:
- سجلات البناء متاحة في GitHub
- إشعارات عند فشل البناء
- تتبع الإصدارات تلقائياً

## الاستخدام السريع

**بناء AAB فوري:**
1. أضف Secrets (Keystore + كلمات المرور)
2. ادفع إلى GitHub
3. راقب GitHub Actions
4. حمل AAB من Artifacts

**إنشاء Release:**
1. أنشئ tag: `git tag v1.0.0`
2. ادفع tag: `git push origin v1.0.0`
3. AAB سيكون متاحاً في GitHub Releases

**بناء APK فوري:**
1. ادفع إلى GitHub
2. راقب GitHub Actions
3. حمل APK من Artifacts

**نشر للمتجر:**  
1. أضف Service Account في Secrets
2. ادفع tag جديد
3. AAB سيُرفع تلقائياً للمتجر

## موقع ملفات AAB

بعد البناء، ستجد ملفات AAB في:
- **Debug**: `android/app/build/outputs/bundle/debug/app-debug.aab`
- **Release (unsigned)**: `android/app/build/outputs/bundle/release/app-release.aab`
- **Release (signed)**: `android/app/build/outputs/bundle/release/app-release-signed.aab`