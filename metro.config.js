const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// إضافة دعم للملفات الويب
config.resolver.platforms = ['native', 'web', 'ios', 'android'];

// إضافة امتدادات الملفات المدعومة
config.resolver.sourceExts.push('web.js', 'web.jsx', 'web.ts', 'web.tsx');

// تكوين أسماء المسارات
config.resolver.alias = {
  '@': './client/src',
  'react-native': 'react-native-web',
};

// تكوين المحول
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;