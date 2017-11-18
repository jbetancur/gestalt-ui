module.exports = {
  rootDir: '../',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!/**/test/**',
    '!/__mocks__/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__mocks__/',
  ],
  coverageDirectory: '<rootDir>/test/coverage',
  setupFiles: [
    '<rootDir>/test/shim.js',
    '<rootDir>/test/jestSetup.js'
  ],
  setupTestFrameworkScriptFile: '<rootDir>/test/setup-test-framework-script',
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__mocks__/',
  ],
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },
  globals: {
    $$API_URL$$: 'bingbangboom',
    $$SEC_API_URL$$: 'bingbangboom',
    $$API_TIMEOUT$$: 'bingbangboom',
    $$API_RETRIES$$: 'bingbangboom',
    $$LICENSE_EXP_THRESHOLD$$: 'bingbangboom',
    $$DEBUG$$: 'bingbangboom',
    $$COMPANY_TITLE$$: 'bingbangboom',
    $$COMPANY_URL$$: 'bingbangboom',
    $$APP_TITLE$$: 'bingbangboom',
    $$DOCUMENTATION_URL$$: 'bingbangboom',
    $$ANALYTICS_TRACKING$$: 'bingbangboom',
    $$ANALYTICS_TRACKING_ACCT$$: 'bingbangboom',
    $$UI_VERSION$$: 'bingbangboom',
  }
};
