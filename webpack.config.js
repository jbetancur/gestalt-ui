const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Clean = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
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
    resolve: {
      extensions: ['.jsx', '.scss', '.js', '.json'],
      modules: [
        path.resolve(__dirname, PATHS.srcPath),
        'node_modules',
      ],
      alias: {
        components: path.resolve(PATHS.srcPath, 'components'),
        modules: path.resolve(PATHS.srcPath, 'modules'),
        util: path.resolve(PATHS.srcPath, 'util'),
        style: path.resolve(PATHS.srcPath, 'style'),
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
        favicon: `${PATHS.srcPath}/assets/icons/gf-logo-color.ico`,
        template: `${PATHS.srcPath}/index.html`,
        hash: true,
        inject: 'body',
      }),
      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/, // exclude node_modules
        failOnError: false, // show a warning when there is a circular dependency
      }),
    ],
  },
  parts.babelConfig(PATHS),
  parts.fontConfig(),
  parts.icoConfig(PATHS),
  parts.svgConfig(PATHS),
  parts.imageConfig(PATHS),
  parts.yamlConfig(PATHS),
  parts.esLintConfig(),
]);

module.exports = function test(env) {
  if (env === 'production') {
    return merge([
      common,
      parts.scssConfig({
        options: {
          sourceMap: 'inline',
          outputStyle: 'expanded',
        }
      }),
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
              unused: true,    // Enables tree shaking
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
          parts.generateConstants('production'),
        ],
      },
    ]);
  }

  return merge([
    common,
    parts.externals(),
    parts.sourceMaps(),
    parts.scssConfig({}),
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
        new webpack.HotModuleReplacementPlugin({
          multiStep: false, // Enable multi-pass compilation for enhanced performance in larger projects.
        }),
        new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
        new ExtractTextPlugin({
          disable: true,
        }),
        parts.generateConstants('development'),
      ],
    },
  ]);
};
