import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
      esModuleInterop: true,
    }]
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '!**/integration/**',
    '!**/e2e/**'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^mongoose$': '<rootDir>/src/__mocks__/mongoose.ts'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testTimeout: 30000, // 30 seconds per test
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '__mocks__',
    '.d.ts',
    'types.ts',
    'interfaces.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  maxWorkers: 4,
  bail: true, // Stop running tests after first failure
  verbose: false // Reduce console output for cleaner logs
}

export default config;