module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['last 2 versions', 'ie >= 11']
      }
    }],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    ['babel-plugin-react-native-web', { commonjs: true }],
    ['@babel/plugin-proposal-class-properties'],
    ['@babel/plugin-transform-runtime']
  ]
};