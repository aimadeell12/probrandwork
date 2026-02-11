# إعداد الخادم للتطبيق المحمول

## التكوين الحالي

التطبيق المحمول BrandSoft Pay مُكوّن للاتصال بـ:
**https://brandsoft-pay.replit.app**

## الإعدادات في capacitor.config.json

```json
{
  "server": {
    "url": "https://brandsoft-pay.replit.app",
    "cleartext": false,
    "androidScheme": "https"
  }
}
```

## المميزات

### الأمان
- اتصال HTTPS مشفر
- `cleartext: false` لمنع HTTP غير المشفر
- استخدام `androidScheme: "https"` للأمان

### الأداء
- اتصال مباشر بخادم الإنتاج
- لا حاجة لخادم محلي أثناء التطوير
- تحديث فوري عند تغيير المحتوى على الخادم

## التطوير والاختبار

### للتطوير المحلي:
إذا أردت الاختبار مع خادم محلي، يمكن تغيير URL مؤقتاً:
```json
"server": {
  "url": "http://localhost:5000"
}
```

### للإنتاج:
يُترك التكوين الحالي كما هو للاتصال بـ Replit.

## إعادة المزامنة

بعد أي تغيير في capacitor.config.json:
```bash
npx cap sync android
```

## البناء

التطبيق سيتصل تلقائياً بـ https://brandsoft-pay.replit.app بعد البناء والتثبيت على الجهاز.