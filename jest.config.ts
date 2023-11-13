import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/testUtils/local/setJestEnv.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/src/__tests__'], //__tests__ are used as API tests, there is separate jest config for those
}

export default config
