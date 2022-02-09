const { name: displayName } = require('./package.json');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  displayName,
  expand: true,
  notify: false,
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: [
    '<rootDir>/tests/**/*.spec.ts',
  ],
  setupFilesAfterEnv: [],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
  ],
};
