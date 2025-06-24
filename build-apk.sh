#!/bin/bash

echo "🏗️ بناء تطبيق PayDota APK"
echo "========================"

# التحقق من وجود dist/public
if [ ! -d "dist/public" ]; then
    echo "📦 بناء أصول الويب..."
    npm run build
fi

# نسخ الأصول إلى Android
echo "📋 نسخ الأصول..."
npx cap copy android

echo "✅ جاهز للبناء!"
echo ""
echo "📱 معلومات التطبيق:"
echo "   - الاسم: PayDota"
echo "   - المعرف: com.paydota.banking"
echo "   - keystore: signing.keystore (مع كلمة مرور) ✓"
echo "   - الإضافات: 9 إضافات ✓"
echo ""
echo "🔧 للبناء في Android Studio:"
echo "   npx cap open android"
echo ""
echo "🏗️ للبناء عبر سطر الأوامر:"
echo "   cd android && ./gradlew assembleRelease"