const webpackConfig = require('./webpack.config');

webpackConfig.devtool = 'inline-source-map';

module.exports = (config) => {
  config.set({
    webpack: webpackConfig,
    preprocessors: {
      'src/**/*.js': ['webpack', 'sourcemap'],
    },
    browsers: ['PhantomJS'],
    singleRun: true,
    frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],
    files: [
      'src/index.tests.js',
    ],
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
    loaders: ['istanbul', {
      exclude: [
        '**/*.test*.js',
      ],
    }],
    reporters: ['mocha', 'coverage'],
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
      type: 'html',
      dir: 'coverage/',
      instrumenterOptions: {
        istanbul: { noCompact: true },
      },
    },
  });
};
