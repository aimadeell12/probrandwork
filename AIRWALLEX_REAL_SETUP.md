# دليل تفعيل Airwallex الحقيقي

## المشكلة الحالية
حساب Airwallex الخاص بك لا يحتوي على إذن الوصول لـ Issuing API. الرسالة الخطأ:
```
access_denied_not_enabled - API access for this resource has been disabled
```

## الحلول المطلوبة

### 1. تفعيل Issuing API في حساب Airwallex
يجب عليك:
1. الدخول إلى حساب Airwallex الخاص بك
2. الذهاب إلى Developer Console
3. طلب تفعيل Issuing API (قد يتطلب موافقة من Airwallex)
4. التأكد من أن Client ID و API Key لديك صلاحيات Issuing

### 2. إعداد Webhooks
بعد تفعيل Issuing API، يجب إعداد webhooks:

#### إعداد Webhook في حساب Airwallex:
1. اذهب إلى Developer Console → Webhooks
2. أضف webhook جديد بالـ URL: `https://paydota.replit.app/api/webhooks/airwallex`
3. اختر الأحداث التالية:
   - `issuing.card.created`
   - `issuing.card.updated`
   - `issuing.card.suspended`
   - `issuing.card.cancelled`
   - `issuing.transaction.created`
   - `issuing.transaction.updated`

#### إعداد Webhook في النظام:
```javascript
// في server/routes.ts
app.post("/api/webhooks/airwallex", async (req, res) => {
  try {
    const { event_type, data } = req.body;
    
    switch (event_type) {
      case 'issuing.card.created':
        // تحديث حالة البطاقة في قاعدة البيانات
        await storage.updateCard(data.id, { status: 'active' });
        break;
        
      case 'issuing.transaction.created':
        // إضافة المعاملة الجديدة
        await storage.createTransaction({
          cardId: data.card_id,
          amount: data.amount,
          currency: data.currency,
          merchant: data.merchant_name,
          status: data.status
        });
        break;
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});
```

### 3. التحويل من النظام المحاكي إلى النظام الحقيقي

في `server/airwallex.ts`، قم بتغيير:
```javascript
// من:
console.log('🔧 Using Mock Airwallex Service for development (API access restricted)');
return MockAirwallexService.getInstance();

// إلى:
console.log('✅ Airwallex Production API initialized with real credentials');
return new AirwallexService({
  clientId,
  apiKey,
  isDemo: false,
});
```

### 4. تنسيق Airwallex API الصحيح

النظام يستخدم الآن التنسيق الصحيح لـ Airwallex API:

```javascript
// إنشاء cardholder بالتنسيق الصحيح
const cardholder = await airwallex.createCardholder({
  type: 'INDIVIDUAL',
  email: 'user@example.com',
  mobile_number: '+1234567890',
  individual: {
    name: {
      first_name: 'John',
      last_name: 'Smith',
      title: 'Mr'
    },
    date_of_birth: '1990-01-01',
    nationality: 'US',
    address: {
      city: 'Albuquerque',
      country: 'US',
      line1: '8206 Louisiana Blvd Ne',
      postcode: '87113',
      state: 'NM'
    },
    cardholder_agreement_terms_consent_obtained: 'yes',
    express_consent_obtained: 'yes',
    paperless_notification_consent_obtained: 'yes',
    privacy_policy_terms_consent_obtained: 'yes'
  },
  postal_address: {
    city: 'Albuquerque',
    country: 'US',
    line1: '8206 Louisiana Blvd Ne',
    postcode: '87113',
    state: 'NM'
  }
});
```

### 4. اختبار النظام الحقيقي
بعد تفعيل Issuing API:
1. أعد تشغيل النظام
2. جرب إنشاء بطاقة جديدة
3. تحقق من أن البطاقة تظهر في حساب Airwallex
4. اختبر المعاملات والـ webhooks

## الحالة الحالية
النظام يعمل حالياً مع MockAirwallexService الذي يحاكي جميع وظائف Airwallex محلياً. هذا يسمح لك بتطوير واختبار النظام حتى يتم تفعيل Issuing API الحقيقي.

## معلومات إضافية
- البطاقات المحاكية تستخدم أرقام بطاقات حقيقية المظهر (4000...)
- جميع العمليات تتم محلياً ولا تؤثر على حساب Airwallex
- يمكن التحويل للنظام الحقيقي فور تفعيل Issuing API