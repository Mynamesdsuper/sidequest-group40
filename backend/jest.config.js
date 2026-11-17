// Two Jest projects: `unit` (no database) and `integration` (supertest against the real test DB).
/** @type {import('jest').Config} */
const common = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

module.exports = {
  collectCoverageFrom: ['src/**/*.ts', '!src/db/migrations/**', '!src/db/seeds/**', '!src/server.ts', '!src/db/cli.ts'],
  coverageReporters: ['text-summary', 'lcov'],
  projects: [
    { ...common, displayName: 'unit', testMatch: ['<rootDir>/tests/unit/**/*.test.ts'] },
    {
      ...common,
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
      setupFiles: ['<rootDir>/tests/helpers/integration-env.ts'],
    },
  ],
};
