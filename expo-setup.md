# Expo Integration for PayDota Banking

## Overview
This document explains the Expo setup for the PayDota Banking React Native for Web application.

## Configuration Files

### app.json
Main Expo configuration file with platform-specific settings:
- iOS bundle identifier: com.paydota.banking
- Android package: com.paydota.banking
- Web bundler: webpack
- Support for iOS, Android, and Web platforms

### App.tsx
Root Expo app component that:
- Initializes the QueryClient for API state management
- Sets up LanguageProvider for Arabic/English support
- Handles app loading states with branded splash screen
- Integrates with existing React Native Web components

## Available Commands

Since package.json modifications are restricted, use these npx commands:

### Development
```bash
# Start Expo development server
npx expo start

# Start web development
npx expo start --web

# Start iOS simulator
npx expo start --ios

# Start Android emulator
npx expo start --android
```

### Building
```bash
# Export for web
npx expo export --platform web

# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android

# Export all platforms
npx expo export
```

## Project Structure

```
client/src/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home page
├── native/                # React Native components
│   ├── App.tsx            # Native app wrapper
│   ├── components/        # RN Web components
│   └── pages/             # Native pages
└── ...                    # Existing web structure
```

## Integration Benefits

1. **Cross-Platform Development**: Write once, run on Web, iOS, and Android
2. **Enhanced Tooling**: Expo CLI provides better development experience
3. **Easy Deployment**: Simple build and deployment process
4. **Native Features**: Access to device APIs when needed
5. **Hot Reload**: Fast development iteration

## GitHub Actions Integration

The existing GitHub Actions workflows support Expo builds:
- Web builds via `npx expo export --platform web`
- Mobile builds triggered by commit messages containing `[mobile]`
- Quality checks and security audits

## Next Steps

1. Install Expo CLI globally: `npm install -g @expo/cli`
2. Test web build: `npx expo start --web`
3. Configure EAS Build for mobile apps
4. Set up Expo environment variables for production
5. Add native features as needed

## Troubleshooting

- If dependencies are missing, use `npx expo install` instead of npm
- For React Native Web compatibility issues, check the alias configurations
- Ensure metro.config.js and webpack configs are properly set up