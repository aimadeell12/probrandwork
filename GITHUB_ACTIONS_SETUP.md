# GitHub Actions للبناء التلقائي - PayDota

## الإعداد

### 1. سكريپت البناء التلقائي
تم إنشاء `.github/workflows/build-android.yml` للبناء التلقائي:

**المميزات:**
- بناء APK عند كل push للمستودع
- رفع ملفات APK كـ artifacts  
- إنشاء release تلقائي مع APK
- دعم النشر لـ Debug و Release

### 2. سكريپت النشر لمتجر Google Play
تم إنشاء `.github/workflows/deploy-play-store.yml` للنشر التلقائي:

**المتطلبات:**
- Google Play Console Service Account
- تفعيل Google Play Developer API

## كيفية الاستخدام

### البناء التلقائي
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

### 1. `.github/workflows/build-android.yml`
- البناء على Ubuntu
- Node.js 20 + Java 17
- بناء Debug + Release APK
- رفع artifacts
- إنشاء releases

### 2. `.github/workflows/deploy-play-store.yml`  
- نشر تلقائي لمتجر Google Play
- دعم مسارات مختلفة (internal/alpha/beta/production)
- بناء AAB للمتجر

### 3. `metadata/android/`
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

**بناء فوري:**
1. ادفع إلى GitHub
2. راقب GitHub Actions
3. حمل APK من Artifacts

**نشر للمتجر:**  
1. أضف Service Account في Secrets
2. ادفع tag جديد
3. APK سيُرفع تلقائياً للمتجر