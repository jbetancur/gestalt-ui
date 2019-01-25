module.exports = {
  rootDir: '../',
  // prevents test warnings when testing XMLhttpRequests (i.e. axios)
  testURL: 'http://gestalt',
  // note babelrc containers test exclusions for istanbul
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx}',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/__mocks__/',
    '<rootDir>/src/themes',
    '<rootDir>/src/scss',
    '<rootDir>/test',
  ],
  coverageDirectory: '<rootDir>/test/coverage',
  // setupFiles: [
  //   '<rootDir>/test/jestSetup.js'
  // ],
  setupFilesAfterEnv: ['<rootDir>/test/setup-test-framework-script'],
  testMatch: [
    '**/__tests__/**/*.js?(x)',
    '**/?(*.)(jest|spec|test).js?(x)'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__mocks__/',
  ],
  moduleFileExtensions: ['js', 'jsx'],
  // The next two lines section should generally mirror webpack.alias
  moduleDirectories: ['node_modules', 'src'],
  modulePaths: ['src/Modules', 'src/components', 'src/util'],
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
    $$REQUIRE_HTTPS_COOKIE$$: 'bingbangboom',
    $$UI_VERSION$$: 'bingbangboom',
  }
};
