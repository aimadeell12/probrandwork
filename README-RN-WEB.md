# PayDota Banking - React Native for Web

## نظرة عامة
تم تحويل تطبيق PayDota المصرفي إلى React Native for Web مع نظام GitHub Actions للنشر التلقائي. يدعم التطبيق الآن المنصات التالية:
- الويب (React Native Web)
- iOS (React Native)
- Android (React Native)

## البنية التقنية

### مكونات React Native
```
client/src/native/
├── App.tsx                 # التطبيق الرئيسي
├── index.tsx              # نقطة الدخول
├── components/
│   └── index.ts           # مكونات RN للويب
└── pages/
    ├── Dashboard.tsx      # لوحة التحكم
    └── Login.tsx          # صفحة تسجيل الدخول
```

### GitHub Actions Workflow
```
.github/workflows/deploy.yml
├── web-deploy             # نشر الويب إلى GitHub Pages
├── mobile-build           # بناء تطبيقات الموبايل
└── quality-check          # فحص الجودة والأمان
```

## كيفية الاستخدام

### التطوير المحلي
```bash
# تشغيل التطبيق العادي
npm run dev

# تشغيل React Native Web
npx expo start --web
```

### البناء للإنتاج
```bash
# بناء الويب
npm run build

# بناء React Native Web
npx expo export --platform web
```

### GitHub Actions
يتم تشغيل النشر تلقائياً عند:
- Push إلى branch main/master
- Pull Request

#### متغيرات البيئة المطلوبة
```
VITE_API_URL=https://your-api.com/api
DATABASE_URL=postgresql://...
```

### بناء تطبيقات الموبايل
لتفعيل بناء تطبيقات الموبايل، أضف `[mobile]` في رسالة الكوميت:
```bash
git commit -m "feat: add new feature [mobile]"
```

## المكونات المتاحة

### React Native Web Components
- `View` - حاوي أساسي
- `Text` - عرض النصوص
- `TouchableOpacity` - أزرار تفاعلية
- `ScrollView` - تمرير المحتوى
- `TextInput` - إدخال النصوص
- `Image` - عرض الصور
- `StyleSheet` - إدارة الأنماط

### مثال على الاستخدام
```tsx
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from '../native/components';

const MyComponent = () => {
  const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#fff',
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 15,
      borderRadius: 10,
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => console.log('Pressed!')}
      >
        <Text style={styles.buttonText}>اضغط هنا</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## الميزات المطبقة

### ✅ متم
- مكونات React Native Web الأساسية
- واجهة تسجيل الدخول باللغة العربية
- لوحة تحكم مصرفية متجاوبة
- نظام GitHub Actions للنشر
- دعم متعدد المنصات

### 🔄 قيد التطوير
- التكامل مع Expo Router
- مكونات UI محسنة
- اختبارات تلقائية
- نشر تطبيقات الموبايل

## الأمان والجودة

### فحوصات الجودة
- Type checking مع TypeScript
- Security audit للتبعيات
- Bundle size analysis

### الأمان
- متغيرات البيئة محمية
- HTTPS إجباري في الإنتاج
- تشفير البيانات الحساسة

## النشر

### GitHub Pages
التطبيق يُنشر تلقائياً على GitHub Pages عند push للفرع الرئيسي.

### Replit Deployments
يمكن أيضاً النشر عبر Replit:
```bash
npm run build
npm run start
```

## المساهمة

### إضافة صفحة جديدة
1. أنشئ ملف في `client/src/native/pages/`
2. استخدم مكونات React Native
3. أضف التوجيه في `App.tsx`

### إضافة مكون جديد
1. أنشئ المكون في `client/src/native/components/`
2. قم بتصديره في `index.ts`
3. اختبره على الويب والموبايل

## الدعم الفني

للحصول على المساعدة:
1. راجع التوثيق في `replit.md`
2. تحقق من سجلات GitHub Actions
3. اختبر محلياً قبل النشر

## التراخيص
MIT License - راجع ملف LICENSE للتفاصيل.