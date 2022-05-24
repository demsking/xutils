/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  expand: true,
  detectOpenHandles: true,
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
  transform: {},
  moduleNameMapper: {
    './http.js': './http.ts',
    './object.js': './object.ts',
    './ping.js': './ping.ts',
    './promise.js': './promise.ts',
    './Trace/trace.node.js': './Trace/trace.node.ts',
    '../color/color.node.js': '../color/color.node.ts',
  },
  moduleFileExtensions: [
    'js',
    'ts',
    'json',
  ],
};
