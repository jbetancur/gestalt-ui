const webpackConfig = require('./webpack.config');

module.exports = (config) => {
  config.set({
    webpack: webpackConfig(),
    reporters: ['mocha', 'coverage'],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'src/all.tests.js',
    ],
    preprocessors: {
      'src/all.tests.js': ['webpack', 'sourcemap'],
    },
    browsers: ['PhantomJS'],
    singleRun: false,
    browserDisconnectTolerance: 10,
    browserNoActivityTimeout: 90000,
    frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-chai',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-mocha-reporter',
      'karma-sinon',
      'karma-sinon-chai',
      'karma-coverage',
    ],
    logLevel: config.LOG_INFO,
    webpackServer: {
      noInfo: true,
    },
    colors: true,
    autoWatch: false,
    webpackMiddleware: {
      stats: {
        colors: true,
      },
      noInfo: true,
    },
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
