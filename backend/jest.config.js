module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  setupFiles: ['<rootDir>/jest.setup-env.js'],
  clearMocks: true,
  forceExit: true,
  collectCoverageFrom: [
    'routes/**/*.js',
    'utils/**/*.js',
    'services/**/*.js',
    'validators/**/*.js',
    'middleware/**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/coverage/',
    '/scripts/'
  ]
};
