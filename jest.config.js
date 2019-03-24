module.exports = {
  collectCoverageFrom: [
    'src/index.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  preset: 'ts-jest',
  testMatch: ['**/__tests__/*.test.ts'],
  verbose: true,
};
