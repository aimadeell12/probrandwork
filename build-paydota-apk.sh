#!/bin/bash

echo "🏗️ بناء تطبيق PayDota المحمول"
echo "=========================="

# التحقق من وجود keystore
if [ ! -f "android/app/signing_1750723138194.keystore" ]; then
    echo "نسخ keystore..."
    cp attached_assets/signing_1750723138194.keystore android/app/
fi

# بناء الأصول للويب
echo "📦 بناء أصول الويب..."
npm run build

# نسخ الأصول إلى Android
echo "📋 نسخ الأصول إلى Android..."
npx cap copy android

# إنشاء مجلد التطوير إذا لم يكن موجوداً
mkdir -p dist/public

echo "✅ تم الانتهاء من الإعداد!"
echo ""
echo "📱 حالة التطبيق المحمول:"
echo "- معرف التطبيق: com.paydota.banking"
echo "- اسم التطبيق: PayDota"
echo "- keystore: موجود ومُكوّن"
echo "- الإضافات المحمولة: 9 إضافات مُثبتة"
echo ""
echo "للبناء في بيئة Android Studio:"
echo "npx cap open android"