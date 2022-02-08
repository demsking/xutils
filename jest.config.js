const { name: displayName } = require('./package.json');

module.exports = {
  displayName,
  expand: true,
  notify: false,
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/**/tests/specs/**/*.spec.ts',
  ],
  setupFilesAfterEnv: [
    './jest.setup.js',
  ],
  collectCoverageFrom: [
    '**/*.{js,ts}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/tests/**',
    '!**/typings/**',
    '!**/coverage/**',
    '!**/jest.*',
  ],
};
