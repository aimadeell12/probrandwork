#!/bin/bash
echo "🤖 Building Android App..."
npm run build
npx cap copy android
npx cap open android