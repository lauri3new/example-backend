module.exports = {
  preset: 'ts-jest',
  verbose: true,
  clearMocks: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/testConfig/setupTests.ts'],
  globalSetup: '<rootDir>/src/testConfig/globalSetup.ts'
}
