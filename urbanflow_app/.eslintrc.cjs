/* eslint-env node */
module.exports = {
  root: true,
  env: {
    'react-native/react-native': true,
    es2022: true,
    jest: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
  ],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-console': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    // Stylistic rules disabled — too noisy for design files
    'react-native/no-inline-styles': 'off',
    'react-native/no-raw-text': 'off',
    'react-native/no-color-literals': 'off',
    'react-native/sort-styles': 'off',
    'react-native/sort-platform-collections': 'off',
    'react-native/no-unused-styles': 'warn',
    'react-native/no-emoji': 'off',
    'react-native/no-single-element-style-arrays': 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-useless-catch': 'warn',
  },
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'web-build/',
    'dist/',
    '__tests__/',
    'scripts/',
    '*.config.js',
  ],
};
