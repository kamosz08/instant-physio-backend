import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/testUtils/local/setJestEnv.ts'],
  setupFilesAfterEnv: [
    '<rootDir>/src/testUtils/mockRedis.ts',
    '<rootDir>/src/testUtils/setupCache.ts',
    '<rootDir>/src/testUtils/local/setupDatabase.ts',
    '<rootDir>/src/testUtils/setupJest.ts',
  ],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
  detectOpenHandles: true,
}

export default config
