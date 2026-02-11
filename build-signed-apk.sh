#!/bin/bash

echo "🔨 Building Signed BrandSoft Pay Android APK"
echo "====================================="

# Step 1: Build web assets
echo "📦 Building web assets..."
npm run build

# Step 2: Copy web assets to Android
echo "📋 Copying assets to Android..."
npx cap copy android

# Step 3: Copy keystore if not already there
echo "🔑 Setting up keystore..."
if [ ! -f "android/app/signing_1750723138194.keystore" ]; then
    cp attached_assets/signing_1750723138194.keystore android/app/
    echo "✅ Keystore copied successfully"
else
    echo "✅ Keystore already in place"
fi

# Step 4: Build signed APK
echo "🏗️ Building signed release APK..."
cd android

# Make gradlew executable
chmod +x gradlew

# Build the release APK
./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! BrandSoft Pay APK built successfully!"
    echo "📱 APK Location: android/app/build/outputs/apk/release/app-release.apk"
    echo ""
    echo "Next steps:"
    echo "1. Install on Android device: adb install app-release.apk"
    echo "2. Upload to Google Play Console for distribution"
    echo "3. Test all banking features on real device"
else
    echo ""
    echo "❌ Build failed. Check the error messages above."
    echo "Common issues:"
    echo "- Missing Android SDK"
    echo "- Incorrect Java version"
    echo "- Keystore path issues"
fi