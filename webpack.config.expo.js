const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: [
        // Add paths that need to be transpiled
        'client/src/native',
        'client/src/components/native'
      ]
    }
  }, argv);

  // Customize the config before returning it
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, 'client/src'),
    '@shared': path.resolve(__dirname, 'shared'),
    '@assets': path.resolve(__dirname, 'attached_assets'),
    // React Native Web aliases
    'react-native$': 'react-native-web',
    'react-native/Libraries/EventEmitter/NativeEventEmitter$': 'react-native-web/dist/exports/NativeEventEmitter',
    'react-native/Libraries/vendor/emitter/EventEmitter$': 'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
  };

  // Add support for TypeScript files
  config.resolve.extensions = [
    '.web.js', '.web.jsx', '.web.ts', '.web.tsx',
    '.js', '.jsx', '.ts', '.tsx', '.json'
  ];

  // Configure entry point
  config.entry = './client/src/native/index.tsx';

  // Configure output
  config.output = {
    ...config.output,
    path: path.resolve(__dirname, 'dist/expo'),
    publicPath: '/',
  };

  // Add CSS support
  config.module.rules.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader', 'postcss-loader'],
  });

  return config;
};