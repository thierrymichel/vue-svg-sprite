module.exports = {
  collectCoverageFrom: ['src/*.ts'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  preset: 'ts-jest',
  globals: {},
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/*.spec.ts'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    // "^.+\\js$": "babel-jest"
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
}
