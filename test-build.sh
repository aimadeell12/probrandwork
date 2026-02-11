#!/bin/bash

echo "🧪 اختبار بناء PayDota محلياً (محاكاة GitHub Actions)"
echo "================================================"

# التحقق من المتطلبات
echo "📋 التحقق من المتطلبات..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مُثبت"
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo "❌ Java غير مُثبت"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ Java: $(java -version 2>&1 | head -n 1)"

# تثبيت التبعيات
echo ""
echo "📦 تثبيت التبعيات..."
npm ci

# بناء أصول الويب
echo ""
echo "🏗️ بناء أصول الويب..."
npm run build

# التحقق من dist/public
if [ ! -d "dist/public" ]; then
    echo "❌ فشل بناء أصول الويب"
    exit 1
fi

echo "✅ تم بناء أصول الويب"

# نسخ keystore
echo ""
echo "🔐 إعداد keystore..."
if [ -f "attached_assets/signing_1750726650743.keystore" ]; then
    cp attached_assets/signing_1750726650743.keystore android/app/signing.keystore
    echo "✅ تم نسخ keystore"
else
    echo "❌ keystore غير موجود"
    exit 1
fi

# مزامنة Capacitor
echo ""
echo "📱 مزامنة Capacitor..."
npx cap sync android

# التحقق من مجلد android
if [ ! -d "android" ]; then
    echo "❌ مجلد android غير موجود"
    exit 1
fi

echo "✅ تم إعداد مشروع Android"

# بناء APK (محاكاة)
echo ""
echo "🔨 بناء APK..."
echo "📍 للبناء الفعلي، شغل:"
echo "   cd android && ./gradlew assembleDebug"
echo "   cd android && ./gradlew assembleRelease"

echo ""
echo "✅ جاهز للبناء!"
echo ""
echo "📱 المعلومات:"
echo "   - التطبيق: PayDota"
echo "   - المعرف: com.paydota.banking"
echo "   - keystore: مُكوّن ✓"
echo "   - Capacitor: مُزامن ✓"
echo ""
echo "🚀 للنشر التلقائي:"
echo "   git add ."
echo "   git commit -m 'تحديث التطبيق'"
echo "   git push origin main"