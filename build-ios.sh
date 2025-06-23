#!/bin/bash
echo "🍎 Building iOS App..."
npm run build
npx cap copy ios
npx cap open ios