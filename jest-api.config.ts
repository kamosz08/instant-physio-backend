import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/testUtils/setJestEnv.ts'],
  setupFilesAfterEnv: [
    '<rootDir>/src/testUtils/setupDatabase.ts',
    '<rootDir>/src/testUtils/setupJest.ts',
  ],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
  detectOpenHandles: true,
}

export default config
