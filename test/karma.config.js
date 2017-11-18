const webpackConfig = require('../webpack/webpack.config');

const webpack = webpackConfig();
delete webpack.entry;

module.exports = (config) => {
  config.set({
    webpack,
    reporters: ['mocha', 'coverage'],
    files: [
      '../src/test.helper.js',
    ],
    preprocessors: {
      '../src/test.helper.js': ['webpack', 'sourcemap'],
    },
    browsers: ['PhantomJS'],
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless'],
      },
    },
    browserConsoleLogOptions: {
      level: 'log',
      terminal: true,
    },
    singleRun: false,
    captureTimeout: 120000,
    browserDisconnectTimeout: 120000,
    browserDisconnectTolerance: 5,
    browserNoActivityTimeout: 120000,
    frameworks: ['mocha', 'chai'],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-safari-launcher',
      'karma-chai',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-mocha-reporter',
      'karma-coverage',
    ],
    logLevel: config.LOG_INFO,
    webpackServer: {
      stats: {
        colors: true,
      },
      noInfo: true,
      quiet: true,
    },
    colors: true,
    autoWatch: false,
    coverageReporter: {
      includeAllSources: true,
      failOnEmptyTestSuite: false,
      reporters: [
        { type: 'lcov', dir: 'coverage/' },
        { type: 'json', dir: 'coverage/' },
        { type: 'text-summary' },
      ],
      instrumenterOptions: {
        istanbul: { noCompact: true },
      },
    },
  });
};
