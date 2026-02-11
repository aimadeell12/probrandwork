#!/bin/bash
echo "🤖 Setting up Android Platform..."

# Build the web app first
echo "📦 Building web app..."
npm run build

# Check if android folder exists
if [ -d "android" ]; then
  echo "✅ Android platform already exists, syncing..."
  npx cap sync android
else
  echo "➕ Android platform not found, adding..."
  npx cap add android
fi

echo "✅ Android platform ready!"
echo "🚀 To open in Android Studio, run: npx cap open android"
