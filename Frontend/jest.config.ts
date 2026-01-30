// jest.config.ts
import type { Config } from 'jest';
import { TextEncoder, TextDecoder } from 'node:util';

globalThis.TextEncoder = TextEncoder as any;
globalThis.TextDecoder = TextDecoder as any;

const config: Config = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.app.json',
      useESM: true,
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFiles: ['<rootDir>/src/__tests__/setupJSDOMPolyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__tests__/mocks/fileMock.ts',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/stores/(.*)$': '<rootDir>/src/stores/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/common/(.*)$': '<rootDir>/src/common/$1',
    '^@/validations/(.*)$': '<rootDir>/src/validations/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/templates/(.*)$': '<rootDir>/src/components/templates/$1',
  },
  testMatch: ['<rootDir>/src/**/__tests__/**/*.(test|spec).(ts|tsx)'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['html', 'text', 'lcov'],
  coveragePathIgnorePatterns: [
    '/__tests__/',
    '/mocks/',
    '/node_modules/',
    '/dist/',
    '/build/',
  ],
  globals: {
    'import.meta.env': {
      VITE_API_URL: 'http://localhost:5000',
    },
  },
  clearMocks: true,
  transformIgnorePatterns: ['/node_modules/(?!axios|text-encoding|react-paginate)'], 
};

export default config;