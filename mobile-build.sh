#!/bin/bash

# BrandSoft Pay Mobile Build Script
# This script helps build and manage the mobile app using Capacitor

set -e

echo "📱 BrandSoft Pay Mobile Build Script"
echo "==============================="

# Function to display help
show_help() {
    echo "Usage: ./mobile-build.sh [command]"
    echo ""
    echo "Commands:"
    echo "  init        Initialize Capacitor"
    echo "  android     Add Android platform"
    echo "  ios         Add iOS platform"
    echo "  build       Build web assets for mobile"
    echo "  sync        Sync web assets to mobile platforms"
    echo "  open-android Open Android Studio"
    echo "  open-ios    Open Xcode"
    echo "  help        Show this help message"
    echo ""
}

case "$1" in
    "init")
        echo "🔧 Initializing Capacitor..."
        npx cap init BrandSoft Pay com.brandsoft-pay.banking --web-dir=dist/public
        ;;
    "android")
        echo "🤖 Adding Android platform..."
        npx cap add android
        ;;
    "ios")
        echo "🍎 Adding iOS platform..."
        npx cap add ios
        ;;
    "build")
        echo "🏗️ Building web assets for mobile..."
        npm run build:mobile
        ;;
    "sync")
        echo "🔄 Syncing assets to mobile platforms..."
        npx cap sync
        ;;
    "open-android")
        echo "📱 Opening Android Studio..."
        npx cap open android
        ;;
    "open-ios")
        echo "📱 Opening Xcode..."
        npx cap open ios
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        show_help
        exit 1
        ;;
esac

echo "✅ Command completed successfully!"