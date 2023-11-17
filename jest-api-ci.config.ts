import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/testUtils/ci/setJestEnv.ts'],
  setupFilesAfterEnv: [
    '<rootDir>/src/testUtils/mockRedis.ts',
    '<rootDir>/src/testUtils/setupCache.ts',
    '<rootDir>/src/testUtils/ci/setupDatabase.ts',
    '<rootDir>/src/testUtils/setupJest.ts',
  ],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
  ci: true,
}

export default config
