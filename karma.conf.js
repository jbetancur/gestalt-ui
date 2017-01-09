const webpackConfig = require('./webpack.config');

webpackConfig.devtool = 'inline-source-map';

module.exports = (config) => {
  config.set({
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
    preprocessors: {
      'src/**/*.js': ['webpack', 'sourcemap'],
    },
    loaders: ['istanbul', {
      exclude: [
        '**/*.test*.js',
      ],
    }],
    reporters: ['mocha', 'coverage'],
    webpack: webpackConfig,
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
    module: {
      loaders: [{
        test: /(\.js|\.jsx)$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /(\.scss|\.css)$/,
        loaders: [
          'style-loader',
          'css-loader?importLoaders=2',
          'postcss-loader',
          'sass-loader?sourceMap=inline&outputStyle=expanded',
        ]
      },
      // {
      //   test: /\.svg$/,
      //   loader: 'url-loader'
      // },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'url-loader'
      },
      {
        test: /\.(ico)$/,
        loader: 'raw-loader'
      },
      {
        test: /\.(svg)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=10000' // inline base64 URLs for <=8k images, direct URLs for the rest
      }]
    }
  });
};
