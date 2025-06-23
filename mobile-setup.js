#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('📱 PayDota Mobile Setup Script');
console.log('==============================\n');

// Check if running in correct directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Run this script from the project root.');
  process.exit(1);
}

// Function to run command with output
function runCommand(command, description) {
  console.log(`🔧 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ Error during ${description.toLowerCase()}: ${error.message}`);
    process.exit(1);
  }
}

// Function to create directory if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

// Main setup process
async function setupMobileApp() {
  console.log('Starting mobile app setup...\n');

  // Step 1: Build web assets
  runCommand('npm run build', 'Building web assets');

  // Step 2: Initialize Capacitor
  if (!fs.existsSync('capacitor.config.ts')) {
    console.log('⚠️  Capacitor config not found, creating default...');
  }
  
  runCommand('npx cap init PayDota com.paydota.banking --web-dir=dist/public', 'Initializing Capacitor');

  // Step 3: Create resources directory
  ensureDir('resources');
  
  // Create default icon placeholder if it doesn't exist
  if (!fs.existsSync('resources/icon.png')) {
    console.log('📝 Creating icon placeholder...');
    const iconPlaceholder = `
<!-- PayDota App Icon Placeholder -->
<!-- Replace this file with a 1024x1024 PNG icon -->
<!-- The icon should represent your PayDota banking brand -->
    `.trim();
    
    // Create a simple HTML file as placeholder since we can't create actual PNG
    fs.writeFileSync('resources/icon-readme.txt', iconPlaceholder);
    console.log('📋 Created icon placeholder readme');
  }

  // Step 4: Add platforms
  console.log('🤖 Adding Android platform...');
  try {
    runCommand('npx cap add android', 'Adding Android platform');
  } catch (error) {
    console.log('⚠️  Android platform may already exist, continuing...');
  }

  console.log('🍎 Adding iOS platform...');
  try {
    runCommand('npx cap add ios', 'Adding iOS platform');
  } catch (error) {
    console.log('⚠️  iOS platform may already exist, continuing...');
  }

  // Step 5: Sync platforms
  runCommand('npx cap sync', 'Syncing platforms');

  // Step 6: Create build script shortcuts
  const buildScripts = {
    'build-android.sh': `#!/bin/bash
echo "🤖 Building Android App..."
npm run build
npx cap copy android
npx cap open android`,
    
    'build-ios.sh': `#!/bin/bash
echo "🍎 Building iOS App..."
npm run build
npx cap copy ios
npx cap open ios`,
    
    'sync-mobile.sh': `#!/bin/bash
echo "🔄 Syncing mobile platforms..."
npm run build
npx cap sync`
  };

  Object.entries(buildScripts).forEach(([filename, content]) => {
    fs.writeFileSync(filename, content);
    try {
      execSync(`chmod +x ${filename}`);
    } catch (error) {
      console.log(`⚠️  Could not make ${filename} executable`);
    }
    console.log(`📝 Created ${filename}`);
  });

  // Step 7: Display completion message
  console.log('\n🎉 Mobile App Setup Complete!');
  console.log('================================\n');
  
  console.log('Next Steps:');
  console.log('1. Replace resources/icon-readme.txt with your actual 1024x1024 PNG icon');
  console.log('2. For Android: Run ./build-android.sh to open Android Studio');
  console.log('3. For iOS: Run ./build-ios.sh to open Xcode (macOS only)');
  console.log('4. For syncing changes: Run ./sync-mobile.sh');
  console.log('5. Set up GitHub secrets for automated deployment');
  
  console.log('\nGitHub Secrets needed for deployment:');
  console.log('- ANDROID_SIGNING_KEY');
  console.log('- ANDROID_KEYSTORE_PASSWORD');
  console.log('- GOOGLE_PLAY_SERVICE_ACCOUNT');
  console.log('- IOS_DIST_SIGNING_KEY');
  console.log('- APPSTORE_ISSUER_ID');
  console.log('- APPSTORE_KEY_ID');
  console.log('- APPSTORE_PRIVATE_KEY');
  
  console.log('\n📖 See README.mobile.md for detailed instructions');
}

// Run setup
setupMobileApp().catch(error => {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
});