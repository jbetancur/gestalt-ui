const path = require('path');
const pkg = require('./package.json');
const config = require('./config.json');
const execSync = require('child_process').execSync;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Clean = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');

const PATHS = {
  rootPath: path.join(__dirname, './'),
  buildPath: path.join(__dirname, './build'),
  srcPath: path.join(__dirname, './src')
};

const common = merge([
  {
    context: __dirname,
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.jsx', '.scss', '.js', '.json'],
      modules: [
        path.resolve(__dirname, PATHS.srcPath),
        'node_modules'
      ]
    },
    entry: {
      app: [`${PATHS.srcPath}/index.jsx`],
    },
    output: {
      path: PATHS.buildPath,
      filename: 'bundle-[hash:6].js',
      publicPath: '',
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: pkg.title,
        favicon: `${PATHS.srcPath}/assets/icons/gf-logo-color.ico`,
        template: `${PATHS.srcPath}/index.html`,
        hash: true,
        inject: 'body',
      }),
    ],
  },
  parts.babelConfig(),
  parts.esLintConfig(),
  parts.fontConfig(),
  parts.icoConfig(),
  parts.svgConfig(),
  parts.imageConfig()
]);

module.exports = function test(env) {
  if (env === 'production') {
    return merge([
      common,
      parts.scssConfig({
        options: {
          sourceMap: 'inline',
          outputStyle: 'expanded'
        }
      }),
      {
        plugins: [
          new Clean(['build'], {
            root: PATHS.rootPath,
          }),
          new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            mangle: true,
            output: {
              comments: false
            },
            compress: {
              warnings: false
            }
          }),
          new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
          }),
          new ExtractTextPlugin({
            filename: 'theme-[hash:6].css',
            allChunks: true,
            disable: false
          }),
          new webpack.DefinePlugin({
            $$API_URL$$: JSON.stringify(config.production.API_URL),
            $$SEC_API_URL$$: JSON.stringify(config.production.SEC_API_URL),
            $$API_TIMEOUT$$: JSON.stringify(config.production.API_TIMEOUT),
            $$UI_VERSION$$: JSON.stringify(`${pkg.version}-${execSync('git rev-parse --short=8 HEAD')}`),
          })
        ]
      },
    ]);
  }

  return merge([
    common,
    parts.scssConfig({}),
    parts.devServer({
      port: '8081',
      contentBase: path.join(__dirname, 'build'),
      compress: true
    }),
    {
      plugins: [
        new ExtractTextPlugin({
          disable: true
        }),
        new webpack.DefinePlugin({
          $$API_URL$$: JSON.stringify(config.development.API_URL),
          $$SEC_API_URL$$: JSON.stringify(config.development.SEC_API_URL),
          $$API_TIMEOUT$$: JSON.stringify(config.development.API_TIMEOUT),
          $$UI_VERSION$$: JSON.stringify(`${pkg.version}-${execSync('git rev-parse --short=8 HEAD')}`),
        })
      ]
    }
  ]);
};
