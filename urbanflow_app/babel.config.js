module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-react',
    '@react-native/babel-preset'
  ],
  plugins: [
    'react-native-reanimated/plugin',
  ],
};