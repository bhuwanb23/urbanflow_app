module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-vector-icons|moti|expo-linear-gradient|react-native-safe-area-context|@react-navigation)/)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};