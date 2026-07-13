module.exports = {
  preset: 'react-native',
  clearMocks: true,
  moduleNameMapper: {
    '^react-native-maps$': '<rootDir>/__mocks__/reactNativeMaps.js',
    '^@sentry/react-native$': '<rootDir>/__mocks__/sentryMock.js',
    '^expo-device$': '<rootDir>/__mocks__/expoDeviceMock.js',
    '\\.(png|jpg|jpeg|gif|webp|svg|ttf|otf|woff2?|mp3|wav)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-vector-icons|moti|expo-linear-gradient|react-native-safe-area-context|@react-navigation|expo-constants|@react-native-async-storage)/)',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  collectCoverageFrom: [
    'utils/**/*.js',
    'pages/**/*.js',
    'components/**/*.js',
    '!**/node_modules/**',
    '!**/__tests__/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json-summary']
};