#!/bin/bash
echo "🤖 Building Android App..."

# Build the web app
npm run build

# Sync with Android (this will update existing android folder)
npx cap sync android

# Open Android Studio
npx cap open android