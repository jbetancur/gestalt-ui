const path = require('path');
const pkg = require('../package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Clean = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // enable manually for bundle analysis
const merge = require('webpack-merge');
const parts = require('./webpack.parts');

const PATHS = {
  rootPath: path.join(__dirname, '../'),
  buildPath: path.join(__dirname, '../build'),
  srcPath: path.join(__dirname, '../src'),
};

const common = merge([
  {
    context: __dirname,
    resolve: {
      extensions: ['.jsx', '.scss', '.js', '.json'],
      modules: [
        path.resolve(__dirname, PATHS.srcPath),
        'node_modules',
      ],
      alias: {
        components: path.resolve(PATHS.srcPath, 'components'),
        Modules: path.resolve(PATHS.srcPath, 'Modules'),
        util: path.resolve(PATHS.srcPath, 'util'),
        scss: path.resolve(PATHS.srcPath, 'scss'),
        assets: path.resolve(PATHS.srcPath, 'assets'),
      },
    },
    output: {
      path: PATHS.buildPath,
      filename: 'bundle-[hash:6].js',
      publicPath: '',
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: pkg.title,
        favicon: `${PATHS.srcPath}/assets/icons/favicon.ico`,
        template: `${PATHS.srcPath}/index.html`,
        inject: 'body',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/, // exclude node_modules
        failOnError: false, // show a warning when there is a circular dependency
      }),
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|ico|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
    ],
  },
  parts.fontConfig(PATHS),
  parts.icoConfig(PATHS),
  parts.svgConfig(PATHS),
  parts.imageConfig(PATHS),
  parts.yamlConfig(PATHS),
  parts.esLintConfig(PATHS),
]);

module.exports = (env) => {
  if (env === 'production') {
    return merge([
      parts.babelConfig(PATHS),
      common,
      parts.scssConfig(
        Object.assign(PATHS, {
          options: {
            sourceMap: false,
            outputStyle: 'compressed',
          }
        })),
      {
        entry: {
          app: parts.appEntryProduction(PATHS),
        },
        performance: {
          hints: 'warning',
        },
        plugins: [
          new Clean(['build'], {
            root: PATHS.rootPath,
          }),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              unused: true, // Enables tree shaking
              dead_code: true, // Enables tree shaking
              pure_getters: true,
              warnings: false,
              screw_ie8: true,
              conditionals: true,
              comparisons: true,
              sequences: true,
              evaluate: true,
              join_vars: true,
              if_return: true,
            },
            parallel: true,
            mangle: true,
            output: {
              comments: false
            },
            sourceMap: true
          }),
          new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
          }),
          new ExtractTextPlugin({
            filename: 'theme-[hash:6].css',
            allChunks: true,
            disable: false,
          }),
          new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // exclude moment locales - we don't need them at this time
          // new BundleAnalyzerPlugin({ // enable manually for bundle analysis
          //   analyzerMode: 'static'
          // }),
          // new webpack.optimize.ModuleConcatenationPlugin(), // TODO: enable this once heap errors are resolved
          parts.generateConstants('production'),
        ],
      },
    ]);
  }

  return merge([
    parts.babelConfig(
      Object.assign(PATHS, {
        options: {
          cacheDirectory: true,
        }
      })),
    common,
    parts.externals(),
    parts.sourceMaps('inline-source-map'),
    parts.scssConfig(
      Object.assign(PATHS, {
        options: {
          sourceMap: false,
          outputStyle: 'expanded',
        }
      })),
    parts.devServer({
      port: 8081,
      contentBase: path.join(__dirname, PATHS.buildPath),
      compress: true,
    }),
    {
      entry: {
        app: parts.appEntryDevelopment(PATHS),
      },
      performance: {
        hints: false,
      },
      plugins: [
        new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
        new ExtractTextPlugin({
          filename: 'theme-[hash:6].css',
          allChunks: true,
          disable: false,
        }),
        parts.generateConstants('development'),
      ],
    },
  ]);
};
