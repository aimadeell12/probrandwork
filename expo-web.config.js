const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configure for web
config.resolver.platforms = ['native', 'web', 'ios', 'android'];
config.resolver.sourceExts.push('web.js', 'web.jsx', 'web.ts', 'web.tsx');

config.resolver.alias = {
  '@': path.resolve(__dirname, 'client/src'),
  '@shared': path.resolve(__dirname, 'shared'),
  '@assets': path.resolve(__dirname, 'attached_assets'),
  'react-native': 'react-native-web',
};

// Web-specific configuration
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Configure for React Native Web
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;